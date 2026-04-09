import path from 'node:path';
import fs from 'node:fs/promises';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import SQLiteStoreFactory from 'better-sqlite3-session-store';
import Database from 'better-sqlite3';
import { z } from 'zod';

import { getPublicDb, readDb, writeDb } from './db';
import { requireAdmin } from './auth';
import {
  athleteSchema,
  competitionSchema,
  competitionGroupV2Schema,
  directSchema,
  homeSchema,
  loginSchema,
  mediaImageSchema,
  newsPostSchema,
  rankingTableSchema,
  resultEventSchema,
  resultItemSchema,
  sponsorSchema,
} from './validators';

const PORT = Number(process.env.PORT ?? 8787);
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-me';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? null;
const ADMIN_FORCE_RESET = process.env.ADMIN_FORCE_RESET === 'true';
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const IS_PROD = NODE_ENV === 'production';

const app = express();
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false })); // CSP can be tightened later for YouTube embeds
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

const limiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use('/api/', limiter);

const sqlite = new Database(path.resolve(process.cwd(), 'data', 'sessions.sqlite'));
const SQLiteStore = SQLiteStoreFactory(session);
const store = new SQLiteStore({ client: sqlite });

app.use(
  session({
    store,
    name: 'fma.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: IS_PROD,
      maxAge: 1000 * 60 * 60 * 12,
    },
  })
);

// Static uploads (public)
app.use('/uploads/images', express.static(path.resolve(process.cwd(), 'storage', 'uploads', 'images')));

async function ensureAdminInitialized() {
  const db = await readDb();
  if (db.admin.username !== ADMIN_USERNAME) {
    db.admin.username = ADMIN_USERNAME;
    db.admin.updatedAt = new Date().toISOString();
  }
  if (!ADMIN_PASSWORD) {
    if (!db.admin.passwordHash) {
      console.warn(
        '[FMA] ADMIN_PASSWORD not set. Admin login is disabled until you set ADMIN_PASSWORD and restart.'
      );
    }
    return;
  }

  if (!db.admin.passwordHash || ADMIN_FORCE_RESET) {
    db.admin.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    db.admin.updatedAt = new Date().toISOString();
    await writeDb(db);
    console.log(
      ADMIN_FORCE_RESET
        ? '[FMA] Admin password reset from ADMIN_PASSWORD.'
        : '[FMA] Admin password initialized from ADMIN_PASSWORD.'
    );
  }
}

// Public API
app.get('/api/public/db', async (_req, res) => {
  const data = await getPublicDb();
  res.json(data);
});

app.get('/api/public/competitions', async (_req, res) => {
  const db = await readDb();
  res.json(db.competitions);
});

app.get('/api/public/competitions-v2', async (_req, res) => {
  const db = await readDb();
  res.json(db.competitionsV2 ?? []);
});

app.get('/api/public/results', async (_req, res) => {
  const db = await readDb();
  res.json(db.results);
});

app.get('/api/public/results/:id', async (req, res) => {
  const id = String(req.params.id);
  const db = await readDb();
  const item = db.results.find((r) => String(r.id) === id);
  if (!item) return res.status(404).json({ error: 'not_found' });
  const details = (db.resultDetailsById ?? {})[id] ?? null;
  res.json({ item, details });
});

app.get('/api/public/sponsors', async (_req, res) => {
  const db = await readDb();
  res.json(db.sponsors);
});

app.get('/api/public/news', async (_req, res) => {
  const db = await readDb();
  res.json(db.news ?? []);
});

app.get('/api/public/athletes', async (_req, res) => {
  const db = await readDb();
  res.json(db.athletes ?? []);
});

app.get('/api/public/rankings', async (_req, res) => {
  const db = await readDb();
  res.json(db.rankings ?? { tables: [] });
});

app.get('/api/public/home', async (_req, res) => {
  const db = await readDb();
  res.json(db.home ?? null);
});

app.get('/api/public/direct', async (_req, res) => {
  const db = await readDb();
  res.json(db.direct ?? null);
});

// Admin auth
app.post('/api/admin/login', loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });

  const { username, password } = parsed.data;
  const db = await readDb();

  if (!db.admin.passwordHash) return res.status(503).json({ error: 'admin_not_initialized' });
  if (username !== db.admin.username) return res.status(401).json({ error: 'invalid_credentials' });

  const ok = await bcrypt.compare(password, db.admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

  (req.session as any).admin = true;
  res.json({ ok: true, username: db.admin.username });
});

app.post('/api/admin/logout', async (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/admin/me', (req, res) => {
  const isAdmin = (req.session as any)?.admin === true;
  res.json({ isAdmin });
});

// Admin CRUD: competitions
app.get('/api/admin/competitions', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.competitions);
});

// Admin: competitions v2 (group + sub-competitions)
app.get('/api/admin/competitions-v2', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.competitionsV2 ?? []);
});

app.put('/api/admin/competitions-v2', requireAdmin, async (req, res) => {
  const parsed = z.array(competitionGroupV2Schema).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.competitionsV2 = parsed.data as any;
  await writeDb(db);
  res.json(db.competitionsV2);
});

app.post('/api/admin/competitions', requireAdmin, async (req, res) => {
  const parsed = competitionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  if (db.competitions.some((c) => c.id === parsed.data.id)) return res.status(409).json({ error: 'id_exists' });
  db.competitions.unshift(parsed.data);
  await writeDb(db);
  res.json(parsed.data);
});

app.patch('/api/admin/competitions/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });
  const parsed = competitionSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });

  const db = await readDb();
  const idx = db.competitions.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not_found' });

  db.competitions[idx] = { ...db.competitions[idx], ...parsed.data, id };
  await writeDb(db);
  res.json(db.competitions[idx]);
});

app.delete('/api/admin/competitions/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });
  const db = await readDb();
  const before = db.competitions.length;
  db.competitions = db.competitions.filter((c) => c.id !== id);
  if (db.competitions.length === before) return res.status(404).json({ error: 'not_found' });
  await writeDb(db);
  res.json({ ok: true });
});

// Admin CRUD: results list
app.get('/api/admin/results', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.results);
});

app.post('/api/admin/results', requireAdmin, async (req, res) => {
  const parsed = resultItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  if (db.results.some((r) => r.id === parsed.data.id)) return res.status(409).json({ error: 'id_exists' });
  db.results.unshift(parsed.data);
  await writeDb(db);
  res.json(parsed.data);
});

app.patch('/api/admin/results/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });
  const parsed = resultItemSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  const idx = db.results.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not_found' });
  db.results[idx] = { ...db.results[idx], ...parsed.data, id };
  await writeDb(db);
  res.json(db.results[idx]);
});

app.delete('/api/admin/results/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid_id' });
  const db = await readDb();
  const before = db.results.length;
  db.results = db.results.filter((r) => r.id !== id);
  if (db.results.length === before) return res.status(404).json({ error: 'not_found' });
  if (db.resultDetailsById) delete (db.resultDetailsById as any)[String(id)];
  await writeDb(db);
  res.json({ ok: true });
});

// Admin: results details (v2 store)
app.get('/api/admin/results/:id/details', requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const db = await readDb();
  res.json(((db.resultDetailsById ?? {}) as any)[id] ?? null);
});

app.put('/api/admin/results/:id/details', requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  // Accept either {mode, events[]} later; for now validate as array of event blocks
  const parsed = z.array(resultEventSchema).safeParse(req.body?.events ?? req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.resultDetailsById = db.resultDetailsById ?? {};
  (db.resultDetailsById as any)[id] = { events: parsed.data };
  await writeDb(db);
  res.json((db.resultDetailsById as any)[id]);
});

// Admin CRUD: sponsors
app.get('/api/admin/sponsors', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.sponsors);
});

app.post('/api/admin/sponsors', requireAdmin, async (req, res) => {
  const parsed = sponsorSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  if (db.sponsors.some((s) => s.id === parsed.data.id)) return res.status(409).json({ error: 'id_exists' });
  db.sponsors.push(parsed.data);
  await writeDb(db);
  res.json(parsed.data);
});

app.patch('/api/admin/sponsors/:id', requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const parsed = sponsorSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  const idx = db.sponsors.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not_found' });
  db.sponsors[idx] = { ...db.sponsors[idx], ...parsed.data, id };
  await writeDb(db);
  res.json(db.sponsors[idx]);
});

app.delete('/api/admin/sponsors/:id', requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const db = await readDb();
  const before = db.sponsors.length;
  db.sponsors = db.sponsors.filter((s) => s.id !== id);
  if (db.sponsors.length === before) return res.status(404).json({ error: 'not_found' });
  await writeDb(db);
  res.json({ ok: true });
});

// Admin CRUD: news
app.get('/api/admin/news', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.news ?? []);
});

app.post('/api/admin/news', requireAdmin, async (req, res) => {
  const parsed = newsPostSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.news = db.news ?? [];
  if ((db.news as any[]).some((p) => p.id === parsed.data.id)) return res.status(409).json({ error: 'id_exists' });
  (db.news as any[]).unshift(parsed.data);
  await writeDb(db);
  res.json(parsed.data);
});

app.patch('/api/admin/news/:id', requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const parsed = newsPostSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.news = db.news ?? [];
  const idx = (db.news as any[]).findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not_found' });
  (db.news as any[])[idx] = { ...(db.news as any[])[idx], ...parsed.data, id };
  await writeDb(db);
  res.json((db.news as any[])[idx]);
});

app.delete('/api/admin/news/:id', requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const db = await readDb();
  db.news = db.news ?? [];
  const before = (db.news as any[]).length;
  db.news = (db.news as any[]).filter((p) => p.id !== id);
  if ((db.news as any[]).length === before) return res.status(404).json({ error: 'not_found' });
  await writeDb(db);
  res.json({ ok: true });
});

// Admin CRUD: athletes
app.get('/api/admin/athletes', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.athletes ?? []);
});

app.post('/api/admin/athletes', requireAdmin, async (req, res) => {
  const parsed = athleteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.athletes = db.athletes ?? [];
  if ((db.athletes as any[]).some((a) => a.id === parsed.data.id)) return res.status(409).json({ error: 'id_exists' });
  (db.athletes as any[]).unshift(parsed.data);
  await writeDb(db);
  res.json(parsed.data);
});

app.patch('/api/admin/athletes/:id', requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const parsed = athleteSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.athletes = db.athletes ?? [];
  const idx = (db.athletes as any[]).findIndex((a) => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not_found' });
  (db.athletes as any[])[idx] = { ...(db.athletes as any[])[idx], ...parsed.data, id };
  await writeDb(db);
  res.json((db.athletes as any[])[idx]);
});

app.delete('/api/admin/athletes/:id', requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const db = await readDb();
  db.athletes = db.athletes ?? [];
  const before = (db.athletes as any[]).length;
  db.athletes = (db.athletes as any[]).filter((a) => a.id !== id);
  if ((db.athletes as any[]).length === before) return res.status(404).json({ error: 'not_found' });
  await writeDb(db);
  res.json({ ok: true });
});

// Admin: rankings
app.get('/api/admin/rankings', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.rankings ?? { tables: [] });
});

app.put('/api/admin/rankings', requireAdmin, async (req, res) => {
  const parsed = z.object({ tables: z.array(rankingTableSchema) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.rankings = parsed.data as any;
  await writeDb(db);
  res.json(db.rankings);
});

// Admin: home
app.get('/api/admin/home', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.home ?? null);
});

app.put('/api/admin/home', requireAdmin, async (req, res) => {
  const parsed = homeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.home = parsed.data as any;
  await writeDb(db);
  res.json(db.home);
});

// Admin: direct
app.get('/api/admin/direct', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.direct ?? null);
});

app.put('/api/admin/direct', requireAdmin, async (req, res) => {
  const parsed = directSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.direct = parsed.data as any;
  await writeDb(db);
  res.json(db.direct);
});

// Admin: media images metadata
app.get('/api/admin/media/images', requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.mediaImages ?? []);
});

app.post('/api/admin/media/images', requireAdmin, async (req, res) => {
  const parsed = mediaImageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_body' });
  const db = await readDb();
  db.mediaImages = db.mediaImages ?? [];
  if ((db.mediaImages as any[]).some((m) => m.id === parsed.data.id)) return res.status(409).json({ error: 'id_exists' });
  (db.mediaImages as any[]).unshift(parsed.data);
  await writeDb(db);
  res.json(parsed.data);
});

app.delete('/api/admin/media/images/:id', requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const db = await readDb();
  db.mediaImages = db.mediaImages ?? [];
  const before = (db.mediaImages as any[]).length;
  db.mediaImages = (db.mediaImages as any[]).filter((m) => m.id !== id);
  if ((db.mediaImages as any[]).length === before) return res.status(404).json({ error: 'not_found' });
  await writeDb(db);
  res.json({ ok: true });
});

// Upload images
const uploadDir = path.resolve(process.cwd(), 'storage', 'uploads', 'images');
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext) ? ext : '.bin';
      const name = `${Date.now()}-${Math.random().toString(16).slice(2)}${safeExt}`;
      cb(null, name);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype);
    cb((ok ? null : (new Error('invalid_mime') as any)) as any, ok);
  },
});

app.post('/api/admin/upload/image', requireAdmin, upload.single('file'), async (req, res) => {
  const f = req.file;
  if (!f) return res.status(400).json({ error: 'missing_file' });
  res.json({ url: `/uploads/images/${encodeURIComponent(f.filename)}`, filename: f.filename });
});

// Serve built app in production
if (IS_PROD) {
  const dist = path.resolve(process.cwd(), 'dist');
  app.use(express.static(dist));
  app.get('*', async (_req, res) => {
    const html = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.send(html);
  });
}

ensureAdminInitialized()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[FMA] API listening on :${PORT}`);
    });
  })
  .catch((e) => {
    console.error('[FMA] Failed to start', e);
    process.exit(1);
  });

