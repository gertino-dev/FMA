import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, LogOut, Plus, RefreshCw, Trash2, Save, Home, Newspaper, Users, Trophy, BarChart3, Tv, Image as ImageIcon } from 'lucide-react';
import { Page, Competition as CompetitionUi } from '../types';
import { apiFetch } from '../lib/api';

type Competition = CompetitionUi;
type Sponsor = { id: string; name: string; logo: string; order: number };
type NewsPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  contentMarkdown: string;
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
};
type Athlete = {
  id: string;
  name: string;
  country: string;
  flag: string;
  disciplines: string[];
  image: string;
  bio: string;
};
type Rankings = { tables: any[] };
type ResultItem = Competition;
type ResultDetails = { events?: any[] } | null;
type HomeV2 = any;
type DirectV2 = any;
type MediaImage = { id: string; url: string; filename: string; createdAt: string; size?: number; mime?: string };
type CompetitionGroupV2 = {
  id: string;
  title: string;
  season?: string;
  category: string;
  location: string;
  date: string;
  status: string;
  image: string;
  subCompetitions: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    status: string;
    category?: string;
    image?: string;
  }>;
};

type TabId =
  | 'home'
  | 'news'
  | 'athletes'
  | 'competitions'
  | 'rankings'
  | 'results'
  | 'direct'
  | 'media'
  | 'sponsors';

interface AdminPageProps {
  setPage: (p: Page) => void;
}

function toId(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const AdminPage = ({ setPage }: AdminPageProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabId>('home');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [competitionsV2, setCompetitionsV2] = useState<CompetitionGroupV2[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [rankings, setRankings] = useState<Rankings>({ tables: [] });
  const [results, setResults] = useState<ResultItem[]>([]);
  const [resultDetailsId, setResultDetailsId] = useState<string>('');
  const [resultDetails, setResultDetails] = useState<ResultDetails>(null);
  const [home, setHome] = useState<HomeV2 | null>(null);
  const [direct, setDirect] = useState<DirectV2 | null>(null);
  const [mediaImages, setMediaImages] = useState<MediaImage[]>([]);

  const [newComp, setNewComp] = useState<Competition>(() => ({
    id: Date.now(),
    title: '',
    location: '',
    date: '',
    category: 'National',
    status: 'À venir',
    image: '/image/image%20(1).png',
  }));

  const [newSponsor, setNewSponsor] = useState<Sponsor>(() => ({
    id: 'sponsor',
    name: 'Sponsor',
    logo: '/image%20spons/images.jpg',
    order: 1,
  }));

  const [newNews, setNewNews] = useState<NewsPost>(() => {
    const now = new Date().toISOString();
    return {
      id: `n-${Date.now()}`,
      title: '',
      slug: '',
      category: 'Actualités',
      excerpt: '',
      coverImage: '/image/image%20(1).png',
      contentMarkdown: '',
      publishedAt: now,
      updatedAt: now,
      status: 'draft',
    };
  });

  const [newAthlete, setNewAthlete] = useState<Athlete>(() => ({
    id: `a-${Date.now()}`,
    name: '',
    country: 'Madagascar',
    flag: '🇲🇬',
    disciplines: [],
    image: '/image/image%20(1).png',
    bio: '',
  }));

  const [newResult, setNewResult] = useState<ResultItem>(() => ({
    id: Date.now(),
    title: '',
    location: '',
    date: '',
    category: '',
    status: 'Résultats',
    image: '/image/image%20(1).png',
  }));

  const [rankingsText, setRankingsText] = useState<string>(() => JSON.stringify({ tables: [] }, null, 2));
  const [homeText, setHomeText] = useState<string>(() => JSON.stringify(null, null, 2));
  const [directText, setDirectText] = useState<string>(() => JSON.stringify(null, null, 2));
  const [resultDetailsText, setResultDetailsText] = useState<string>(() => JSON.stringify({ events: [] }, null, 2));
  const [competitionsV2Text, setCompetitionsV2Text] = useState<string>(() => JSON.stringify([], null, 2));

  useEffect(() => {
    apiFetch<{ isAdmin: boolean }>('/api/admin/me')
      .then((r) => {
        if (!r.isAdmin) {
          setIsAdmin(false);
          setPage('admin-login');
        } else {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setPage('admin-login');
      });
  }, [setPage]);

  async function refresh() {
    setBusy(true);
    setError(null);
    try {
      const [c, cv2, s, n, a, rk, rs, h, d, mi] = await Promise.all([
        apiFetch<Competition[]>('/api/admin/competitions'),
        apiFetch<CompetitionGroupV2[]>('/api/admin/competitions-v2'),
        apiFetch<Sponsor[]>('/api/admin/sponsors'),
        apiFetch<NewsPost[]>('/api/admin/news'),
        apiFetch<Athlete[]>('/api/admin/athletes'),
        apiFetch<Rankings>('/api/admin/rankings'),
        apiFetch<ResultItem[]>('/api/admin/results'),
        apiFetch<HomeV2 | null>('/api/admin/home'),
        apiFetch<DirectV2 | null>('/api/admin/direct'),
        apiFetch<MediaImage[]>('/api/admin/media/images'),
      ]);
      setCompetitions(c);
      setCompetitionsV2(cv2 ?? []);
      setSponsors(s.slice().sort((a, b) => a.order - b.order));
      setNews(n ?? []);
      setAthletes(a ?? []);
      setRankings(rk ?? { tables: [] });
      setResults(rs ?? []);
      setHome(h ?? null);
      setDirect(d ?? null);
      setMediaImages(mi ?? []);

      setRankingsText(JSON.stringify(rk ?? { tables: [] }, null, 2));
      setHomeText(JSON.stringify(h ?? null, null, 2));
      setDirectText(JSON.stringify(d ?? null, null, 2));
      setCompetitionsV2Text(JSON.stringify(cv2 ?? [], null, 2));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (isAdmin) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const sortedCompetitions = useMemo(() => competitions.slice(), [competitions]);
  const sortedNews = useMemo(() => news.slice(), [news]);
  const sortedAthletes = useMemo(() => athletes.slice(), [athletes]);
  const sortedResults = useMemo(() => results.slice(), [results]);

  async function logout() {
    await apiFetch('/api/admin/logout', { method: 'POST' });
    setPage('admin-login');
  }

  async function createCompetition() {
    setBusy(true);
    setError(null);
    try {
      const created = await apiFetch<Competition>('/api/admin/competitions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newComp),
      });
      setCompetitions((prev) => [created, ...prev]);
      setNewComp((c) => ({ ...c, id: Date.now(), title: '', location: '', date: '' }));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function patchCompetition(id: number, patch: Partial<Competition>) {
    setBusy(true);
    setError(null);
    try {
      const updated = await apiFetch<Competition>(`/api/admin/competitions/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      });
      setCompetitions((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function deleteCompetition(id: number) {
    if (!confirm('Supprimer cette compétition ?')) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/api/admin/competitions/${id}`, { method: 'DELETE' });
      setCompetitions((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function createSponsor() {
    setBusy(true);
    setError(null);
    try {
      const payload = { ...newSponsor, id: toId(newSponsor.id || newSponsor.name) || `s-${Date.now()}` };
      const created = await apiFetch<Sponsor>('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSponsors((prev) => prev.concat(created).slice().sort((a, b) => a.order - b.order));
      setNewSponsor((s) => ({ ...s, id: 'sponsor', name: 'Sponsor', order: (created.order ?? 0) + 1 }));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function patchSponsor(id: string, patch: Partial<Sponsor>) {
    setBusy(true);
    setError(null);
    try {
      const updated = await apiFetch<Sponsor>(`/api/admin/sponsors/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      });
      setSponsors((prev) => prev.map((s) => (s.id === id ? updated : s)).slice().sort((a, b) => a.order - b.order));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function deleteSponsor(id: string) {
    if (!confirm('Supprimer ce sponsor ?')) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/api/admin/sponsors/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setSponsors((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await apiFetch<{ url: string }>('/api/admin/upload/image', { method: 'POST', body: fd });
    return res.url;
  }

  async function createNews() {
    setBusy(true);
    setError(null);
    try {
      const now = new Date().toISOString();
      const payload: NewsPost = {
        ...newNews,
        id: newNews.id || `n-${Date.now()}`,
        slug: newNews.slug || toId(newNews.title) || `n-${Date.now()}`,
        updatedAt: now,
      };
      const created = await apiFetch<NewsPost>('/api/admin/news', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setNews((prev) => [created, ...prev]);
      setNewNews((p) => ({ ...p, id: `n-${Date.now()}`, title: '', slug: '', excerpt: '', contentMarkdown: '', updatedAt: now }));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function patchNews(id: string, patch: Partial<NewsPost>) {
    setBusy(true);
    setError(null);
    try {
      const updated = await apiFetch<NewsPost>(`/api/admin/news/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...patch, updatedAt: new Date().toISOString() }),
      });
      setNews((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function deleteNews(id: string) {
    if (!confirm('Supprimer cette actualité ?')) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/api/admin/news/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setNews((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function createAthlete() {
    setBusy(true);
    setError(null);
    try {
      const payload: Athlete = { ...newAthlete, id: newAthlete.id || `a-${Date.now()}` };
      const created = await apiFetch<Athlete>('/api/admin/athletes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setAthletes((prev) => [created, ...prev]);
      setNewAthlete((a) => ({ ...a, id: `a-${Date.now()}`, name: '', disciplines: [] }));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function patchAthlete(id: string, patch: Partial<Athlete>) {
    setBusy(true);
    setError(null);
    try {
      const updated = await apiFetch<Athlete>(`/api/admin/athletes/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      });
      setAthletes((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function deleteAthlete(id: string) {
    if (!confirm('Supprimer cet athlète ?')) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/api/admin/athletes/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setAthletes((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function createResult() {
    setBusy(true);
    setError(null);
    try {
      const created = await apiFetch<ResultItem>('/api/admin/results', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newResult),
      });
      setResults((prev) => [created, ...prev]);
      setNewResult((r) => ({ ...r, id: Date.now(), title: '', location: '', date: '', category: '' }));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function patchResult(id: number, patch: Partial<ResultItem>) {
    setBusy(true);
    setError(null);
    try {
      const updated = await apiFetch<ResultItem>(`/api/admin/results/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      });
      setResults((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function deleteResult(id: number) {
    if (!confirm('Supprimer ce résultat ?')) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/api/admin/results/${id}`, { method: 'DELETE' });
      setResults((prev) => prev.filter((r) => r.id !== id));
      if (String(id) === resultDetailsId) {
        setResultDetailsId('');
        setResultDetails(null);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function loadResultDetails(id: string) {
    setBusy(true);
    setError(null);
    try {
      const d = await apiFetch<ResultDetails>(`/api/admin/results/${encodeURIComponent(id)}/details`);
      setResultDetails(d);
      setResultDetailsText(JSON.stringify(d ?? { events: [] }, null, 2));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function saveResultDetails(id: string) {
    setBusy(true);
    setError(null);
    try {
      const parsed = JSON.parse(resultDetailsText);
      const saved = await apiFetch<any>(`/api/admin/results/${encodeURIComponent(id)}/details`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      setResultDetails(saved);
    } catch (err: any) {
      setError(err?.message ?? 'JSON invalide / Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function saveRankings() {
    setBusy(true);
    setError(null);
    try {
      const parsed = JSON.parse(rankingsText);
      const saved = await apiFetch<Rankings>('/api/admin/rankings', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      setRankings(saved);
      setRankingsText(JSON.stringify(saved, null, 2));
    } catch (err: any) {
      setError(err?.message ?? 'JSON invalide / Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function saveHome() {
    setBusy(true);
    setError(null);
    try {
      const parsed = JSON.parse(homeText);
      const saved = await apiFetch<HomeV2>('/api/admin/home', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      setHome(saved);
      setHomeText(JSON.stringify(saved, null, 2));
    } catch (err: any) {
      setError(err?.message ?? 'JSON invalide / Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function saveDirect() {
    setBusy(true);
    setError(null);
    try {
      const parsed = JSON.parse(directText);
      const saved = await apiFetch<DirectV2>('/api/admin/direct', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      setDirect(saved);
      setDirectText(JSON.stringify(saved, null, 2));
    } catch (err: any) {
      setError(err?.message ?? 'JSON invalide / Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function saveCompetitionsV2() {
    setBusy(true);
    setError(null);
    try {
      const parsed = JSON.parse(competitionsV2Text);
      const saved = await apiFetch<CompetitionGroupV2[]>('/api/admin/competitions-v2', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      setCompetitionsV2(saved ?? []);
      setCompetitionsV2Text(JSON.stringify(saved ?? [], null, 2));
    } catch (err: any) {
      setError(err?.message ?? 'JSON invalide / Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function addMediaImage(url: string, filename: string, mime?: string, size?: number) {
    setBusy(true);
    setError(null);
    try {
      const payload: MediaImage = {
        id: filename,
        url,
        filename,
        createdAt: new Date().toISOString(),
        mime,
        size,
      };
      const created = await apiFetch<MediaImage>('/api/admin/media/images', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMediaImages((prev) => [created, ...prev]);
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  async function deleteMediaImage(id: string) {
    if (!confirm('Supprimer cette entrée média ? (ne supprime pas forcément le fichier)')) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/api/admin/media/images/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setMediaImages((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  if (isAdmin === null) return null;

  const tabs: Array<{ id: TabId; label: string; icon: any }> = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'news', label: 'Actualités', icon: Newspaper },
    { id: 'athletes', label: 'Athlètes', icon: Users },
    { id: 'competitions', label: 'Compétitions', icon: Trophy },
    { id: 'rankings', label: 'Classements', icon: BarChart3 },
    { id: 'results', label: 'Résultats', icon: Trophy },
    { id: 'direct', label: 'Direct', icon: Tv },
    { id: 'media', label: 'Médias', icon: ImageIcon },
    { id: 'sponsors', label: 'Sponsors', icon: ImageIcon },
  ];

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-6xl font-display font-black italic uppercase tracking-tighter mb-4">
            Back‑office
          </h1>
          <p className="text-text-muted text-base sm:text-lg max-w-2xl border-l-4 border-brand-primary pl-6">
            Gestion du contenu (JSON) + uploads.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3">
          <button onClick={refresh} className="btn-outline px-6 py-3 text-xs flex items-center gap-2">
            <RefreshCw size={16} /> Rafraîchir
          </button>
          <button onClick={logout} className="btn-outline px-6 py-3 text-xs flex items-center gap-2">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-10 border-l-4 border-brand-primary bg-bg-surface p-4 text-sm">
          <p className="font-black uppercase tracking-widest text-[10px] text-text-muted mb-1">Erreur</p>
          <p className="text-text-main">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-3 border-2 text-xs font-black uppercase tracking-widest -skew-x-12 ${
              tab === t.id ? 'border-brand-primary text-brand-primary bg-bg-surface' : 'border-border-main text-text-muted hover:text-text-main'
            }`}
          >
            <span className="skew-x-12 inline-flex items-center gap-2">
              <t.icon size={14} />
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {tab === 'home' && (
        <div className="space-y-10">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Accueil (JSON)</h2>
              <button disabled={busy} onClick={saveHome} className="btn-primary px-8 py-3 text-xs flex items-center gap-2 disabled:opacity-60">
                <Save size={16} /> Enregistrer
              </button>
            </div>
            <textarea
              value={homeText}
              onChange={(e) => setHomeText(e.target.value)}
              className="w-full h-[420px] bg-bg-main border-2 border-border-main p-4 text-xs font-mono focus:outline-none focus:border-brand-primary"
            />
            <p className="text-xs text-text-muted mt-3">
              Astuce: pour les vidéos, mets juste `youtubeId` (ex: `dQw4w9WgXcQ`). Les images peuvent venir de l’upload.
            </p>
          </div>
        </div>
      )}

      {tab === 'news' && (
        <div className="space-y-10">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-6 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Ajouter une actualité</h2>
              <button disabled={busy} onClick={createNews} className="btn-primary px-8 py-3 text-xs flex items-center gap-2 disabled:opacity-60">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Titre</span>
                <input value={newNews.title} onChange={(e) => setNewNews((p) => ({ ...p, title: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Slug</span>
                <input value={newNews.slug} onChange={(e) => setNewNews((p) => ({ ...p, slug: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Catégorie</span>
                <input value={newNews.category} onChange={(e) => setNewNews((p) => ({ ...p, category: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Statut</span>
                <select value={newNews.status} onChange={(e) => setNewNews((p) => ({ ...p, status: e.target.value as any }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary">
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Image (cover)</span>
                <input value={newNews.coverImage} onChange={(e) => setNewNews((p) => ({ ...p, coverImage: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Upload image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      setBusy(true);
                      const url = await uploadImage(f);
                      setNewNews((p) => ({ ...p, coverImage: url }));
                    } catch (err: any) {
                      setError(err?.message ?? 'Erreur upload');
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Résumé</span>
                <textarea value={newNews.excerpt} onChange={(e) => setNewNews((p) => ({ ...p, excerpt: e.target.value }))} className="bg-bg-main border-2 border-border-main p-4 text-sm focus:outline-none focus:border-brand-primary min-h-28" />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Contenu (Markdown)</span>
                <textarea value={newNews.contentMarkdown} onChange={(e) => setNewNews((p) => ({ ...p, contentMarkdown: e.target.value }))} className="bg-bg-main border-2 border-border-main p-4 text-sm focus:outline-none focus:border-brand-primary min-h-52 font-mono" />
              </label>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border-main bg-bg-surface/50 flex items-end justify-between">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Actualités</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{sortedNews.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1100px]">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Titre</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Catégorie</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Statut</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Cover</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNews.map((p) => (
                    <tr key={p.id} className="border-b border-border-main/50 hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-4">
                        <input value={p.title} onChange={(e) => setNews((prev) => prev.map((x) => (x.id === p.id ? { ...x, title: e.target.value } : x)))} className="w-[420px] bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
                        <div className="mt-2 text-xs text-text-muted font-mono">id: {p.id} · slug: {p.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <input value={p.category} onChange={(e) => setNews((prev) => prev.map((x) => (x.id === p.id ? { ...x, category: e.target.value } : x)))} className="w-56 bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
                      </td>
                      <td className="px-6 py-4">
                        <select value={p.status} onChange={(e) => setNews((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: e.target.value as any } : x)))} className="w-40 bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary">
                          <option value="draft">Brouillon</option>
                          <option value="published">Publié</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.coverImage} alt="" className="w-10 h-10 object-cover border border-border-main" />
                          <input value={p.coverImage} onChange={(e) => setNews((prev) => prev.map((x) => (x.id === p.id ? { ...x, coverImage: e.target.value } : x)))} className="w-[420px] bg-transparent border border-border-main/60 px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-primary" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button disabled={busy} onClick={() => patchNews(p.id, p)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60">
                            <Save size={14} /> Enregistrer
                          </button>
                          <button disabled={busy} onClick={() => deleteNews(p.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60">
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'athletes' && (
        <div className="space-y-10">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-6 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Ajouter un athlète</h2>
              <button disabled={busy} onClick={createAthlete} className="btn-primary px-8 py-3 text-xs flex items-center gap-2 disabled:opacity-60">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Nom</span>
                <input value={newAthlete.name} onChange={(e) => setNewAthlete((a) => ({ ...a, name: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Pays</span>
                <input value={newAthlete.country} onChange={(e) => setNewAthlete((a) => ({ ...a, country: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Drapeau</span>
                <input value={newAthlete.flag} onChange={(e) => setNewAthlete((a) => ({ ...a, flag: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Disciplines (séparées par virgules)</span>
                <input value={newAthlete.disciplines.join(', ')} onChange={(e) => setNewAthlete((a) => ({ ...a, disciplines: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Image</span>
                <input value={newAthlete.image} onChange={(e) => setNewAthlete((a) => ({ ...a, image: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Upload image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      setBusy(true);
                      const url = await uploadImage(f);
                      setNewAthlete((a) => ({ ...a, image: url }));
                    } catch (err: any) {
                      setError(err?.message ?? 'Erreur upload');
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm"
                />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Bio</span>
                <textarea value={newAthlete.bio} onChange={(e) => setNewAthlete((a) => ({ ...a, bio: e.target.value }))} className="bg-bg-main border-2 border-border-main p-4 text-sm focus:outline-none focus:border-brand-primary min-h-36" />
              </label>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border-main bg-bg-surface/50 flex items-end justify-between">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Athlètes</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{sortedAthletes.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1100px]">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Nom</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Pays</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Disciplines</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Image</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAthletes.map((a) => (
                    <tr key={a.id} className="border-b border-border-main/50 hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-4">
                        <input value={a.name} onChange={(e) => setAthletes((prev) => prev.map((x) => (x.id === a.id ? { ...x, name: e.target.value } : x)))} className="w-72 bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
                        <div className="mt-2 text-xs text-text-muted font-mono">id: {a.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input value={a.flag} onChange={(e) => setAthletes((prev) => prev.map((x) => (x.id === a.id ? { ...x, flag: e.target.value } : x)))} className="w-16 bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
                          <input value={a.country} onChange={(e) => setAthletes((prev) => prev.map((x) => (x.id === a.id ? { ...x, country: e.target.value } : x)))} className="w-56 bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={a.disciplines.join(', ')}
                          onChange={(e) =>
                            setAthletes((prev) =>
                              prev.map((x) =>
                                x.id === a.id
                                  ? { ...x, disciplines: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }
                                  : x
                              )
                            )
                          }
                          className="w-[360px] bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={a.image} alt="" className="w-10 h-10 object-cover border border-border-main" />
                          <input value={a.image} onChange={(e) => setAthletes((prev) => prev.map((x) => (x.id === a.id ? { ...x, image: e.target.value } : x)))} className="w-[420px] bg-transparent border border-border-main/60 px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-primary" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button disabled={busy} onClick={() => patchAthlete(a.id, a)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60">
                            <Save size={14} /> Enregistrer
                          </button>
                          <button disabled={busy} onClick={() => deleteAthlete(a.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60">
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'competitions' && (
        <div className="space-y-10">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">
                  Compétitions v2 (groupes + sous‑compétitions)
                </h2>
                <p className="text-xs text-text-muted mt-2">
                  C’est cette structure qui correspond à “une compétition puis plein de sous‑compétitions dedans”.
                </p>
              </div>
              <button
                disabled={busy}
                onClick={saveCompetitionsV2}
                className="btn-primary px-8 py-3 text-xs flex items-center gap-2 disabled:opacity-60"
              >
                <Save size={16} /> Enregistrer v2
              </button>
            </div>
            <textarea
              value={competitionsV2Text}
              onChange={(e) => setCompetitionsV2Text(e.target.value)}
              className="w-full h-[520px] bg-bg-main border-2 border-border-main p-4 text-xs font-mono focus:outline-none focus:border-brand-primary"
            />
            <p className="text-xs text-text-muted mt-3">
              Exemple: un groupe avec <code className="font-mono text-[11px]">{'{ subCompetitions: [...] }'}</code>.
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-6 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Ajouter une compétition</h2>
              <button
                disabled={busy}
                onClick={createCompetition}
                className="btn-primary px-8 py-3 text-xs flex items-center gap-2 disabled:opacity-60"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">ID</span>
                <input
                  type="number"
                  value={newComp.id}
                  onChange={(e) => setNewComp((c) => ({ ...c, id: Number(e.target.value) }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Catégorie</span>
                <input
                  value={newComp.category}
                  onChange={(e) => setNewComp((c) => ({ ...c, category: e.target.value }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Titre</span>
                <input
                  value={newComp.title}
                  onChange={(e) => setNewComp((c) => ({ ...c, title: e.target.value }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Lieu</span>
                <input
                  value={newComp.location}
                  onChange={(e) => setNewComp((c) => ({ ...c, location: e.target.value }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Date</span>
                <input
                  value={newComp.date}
                  onChange={(e) => setNewComp((c) => ({ ...c, date: e.target.value }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Statut</span>
                <input
                  value={newComp.status}
                  onChange={(e) => setNewComp((c) => ({ ...c, status: e.target.value }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Image URL</span>
                <input
                  value={newComp.image}
                  onChange={(e) => setNewComp((c) => ({ ...c, image: e.target.value }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Upload image</span>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        setBusy(true);
                        const url = await uploadImage(f);
                        setNewComp((c) => ({ ...c, image: url }));
                      } catch (err: any) {
                        setError(err?.message ?? 'Erreur upload');
                      } finally {
                        setBusy(false);
                      }
                    }}
                    className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm"
                  />
                  <div className="flex items-center gap-3">
                    <Upload size={16} className="text-brand-primary" />
                    <span className="text-xs text-text-muted">Stockage: `storage/uploads/images/`</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border-main bg-bg-surface/50 flex items-end justify-between">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Compétitions</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                {sortedCompetitions.length} items
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1100px]">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">ID</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Titre</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Lieu</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Date</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Catégorie</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Statut</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Image</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCompetitions.map((c) => (
                    <tr key={c.id} className="border-b border-border-main/50 hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-4 font-mono font-bold">{c.id}</td>
                      <td className="px-6 py-4">
                        <input
                          value={c.title}
                          onChange={(e) => setCompetitions((prev) => prev.map((x) => (x.id === c.id ? { ...x, title: e.target.value } : x)))}
                          className="w-full bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={c.location}
                          onChange={(e) => setCompetitions((prev) => prev.map((x) => (x.id === c.id ? { ...x, location: e.target.value } : x)))}
                          className="w-full bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={c.date}
                          onChange={(e) => setCompetitions((prev) => prev.map((x) => (x.id === c.id ? { ...x, date: e.target.value } : x)))}
                          className="w-full bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={c.category}
                          onChange={(e) => setCompetitions((prev) => prev.map((x) => (x.id === c.id ? { ...x, category: e.target.value } : x)))}
                          className="w-full bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={c.status}
                          onChange={(e) => setCompetitions((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: e.target.value } : x)))}
                          className="w-full bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={c.image} alt="" className="w-10 h-10 object-cover border border-border-main" />
                          <input
                            value={c.image}
                            onChange={(e) => setCompetitions((prev) => prev.map((x) => (x.id === c.id ? { ...x, image: e.target.value } : x)))}
                            className="w-[360px] bg-transparent border border-border-main/60 px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            disabled={busy}
                            onClick={() => patchCompetition(c.id, c)}
                            className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60"
                          >
                            <Save size={14} /> Enregistrer
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => deleteCompetition(c.id)}
                            className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60"
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'rankings' && (
        <div className="space-y-10">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Classements (JSON)</h2>
              <button disabled={busy} onClick={saveRankings} className="btn-primary px-8 py-3 text-xs flex items-center gap-2 disabled:opacity-60">
                <Save size={16} /> Enregistrer
              </button>
            </div>
            <textarea
              value={rankingsText}
              onChange={(e) => setRankingsText(e.target.value)}
              className="w-full h-[520px] bg-bg-main border-2 border-border-main p-4 text-xs font-mono focus:outline-none focus:border-brand-primary"
            />
            <p className="text-xs text-text-muted mt-3">
              Structure attendue:{' '}
              <code className="font-mono text-[11px]">
                {'{ "tables": [ { "id", "title", "updatedAt", "rows": [...] } ] }'}
              </code>
            </p>
          </div>
        </div>
      )}

      {tab === 'results' && (
        <div className="space-y-10">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-6 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Ajouter un résultat</h2>
              <button disabled={busy} onClick={createResult} className="btn-primary px-8 py-3 text-xs flex items-center gap-2 disabled:opacity-60">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">ID</span>
                <input type="number" value={newResult.id} onChange={(e) => setNewResult((r) => ({ ...r, id: Number(e.target.value) }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Catégorie</span>
                <input value={newResult.category} onChange={(e) => setNewResult((r) => ({ ...r, category: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Titre</span>
                <textarea value={newResult.title} onChange={(e) => setNewResult((r) => ({ ...r, title: e.target.value }))} className="bg-bg-main border-2 border-border-main p-4 text-sm focus:outline-none focus:border-brand-primary min-h-24" />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Lieu</span>
                <input value={newResult.location} onChange={(e) => setNewResult((r) => ({ ...r, location: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Date</span>
                <input value={newResult.date} onChange={(e) => setNewResult((r) => ({ ...r, date: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Image</span>
                <input value={newResult.image} onChange={(e) => setNewResult((r) => ({ ...r, image: e.target.value }))} className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary" />
              </label>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border-main bg-bg-surface/50 flex items-end justify-between">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Résultats</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{sortedResults.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1200px]">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">ID</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Titre</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Date</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Catégorie</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r) => (
                    <tr key={r.id} className="border-b border-border-main/50 hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-4 font-mono font-bold">{r.id}</td>
                      <td className="px-6 py-4">
                        <textarea value={r.title} onChange={(e) => setResults((prev) => prev.map((x) => (x.id === r.id ? { ...x, title: e.target.value } : x)))} className="w-[520px] bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary min-h-20" />
                      </td>
                      <td className="px-6 py-4">
                        <input value={r.date} onChange={(e) => setResults((prev) => prev.map((x) => (x.id === r.id ? { ...x, date: e.target.value } : x)))} className="w-52 bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
                      </td>
                      <td className="px-6 py-4">
                        <input value={r.category} onChange={(e) => setResults((prev) => prev.map((x) => (x.id === r.id ? { ...x, category: e.target.value } : x)))} className="w-52 bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button disabled={busy} onClick={() => patchResult(r.id, r)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60">
                            <Save size={14} /> Enregistrer
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => {
                              setResultDetailsId(String(r.id));
                              loadResultDetails(String(r.id));
                            }}
                            className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60"
                          >
                            <Save size={14} /> Détails
                          </button>
                          <button disabled={busy} onClick={() => deleteResult(r.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60">
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Détails du résultat</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <label className="text-xs text-text-muted">ID</label>
                <input
                  value={resultDetailsId}
                  onChange={(e) => setResultDetailsId(e.target.value)}
                  className="w-40 bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
                <button disabled={busy || !resultDetailsId} onClick={() => loadResultDetails(resultDetailsId)} className="btn-outline px-6 py-2 text-xs flex items-center gap-2 disabled:opacity-60">
                  <RefreshCw size={14} /> Charger
                </button>
                <button disabled={busy || !resultDetailsId} onClick={() => saveResultDetails(resultDetailsId)} className="btn-primary px-6 py-2 text-xs flex items-center gap-2 disabled:opacity-60">
                  <Save size={14} /> Enregistrer
                </button>
              </div>
            </div>
            <textarea
              value={resultDetailsText}
              onChange={(e) => setResultDetailsText(e.target.value)}
              className="w-full h-[520px] bg-bg-main border-2 border-border-main p-4 text-xs font-mono focus:outline-none focus:border-brand-primary"
            />
            <p className="text-xs text-text-muted mt-3">
              Format: soit{' '}
              <code className="font-mono text-[11px]">
                {'{ "events": [ { "epreuve", "categorie", "genre", "rows": [...] } ] }'}
              </code>{' '}
              soit directement un objet équivalent.
            </p>
          </div>
        </div>
      )}

      {tab === 'direct' && (
        <div className="space-y-10">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Direct (JSON)</h2>
              <button disabled={busy} onClick={saveDirect} className="btn-primary px-8 py-3 text-xs flex items-center gap-2 disabled:opacity-60">
                <Save size={16} /> Enregistrer
              </button>
            </div>
            <textarea
              value={directText}
              onChange={(e) => setDirectText(e.target.value)}
              className="w-full h-[420px] bg-bg-main border-2 border-border-main p-4 text-xs font-mono focus:outline-none focus:border-brand-primary"
            />
            <p className="text-xs text-text-muted mt-3">Pour lancer un live: mets `enabled: true` + `youtubeId`.</p>
          </div>
        </div>
      )}

      {tab === 'media' && (
        <div className="space-y-10">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-6 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Upload image</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Fichier</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      setBusy(true);
                      const url = await uploadImage(f);
                      await addMediaImage(url, f.name, f.type, f.size);
                    } catch (err: any) {
                      setError(err?.message ?? 'Erreur upload');
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm"
                />
              </label>
              <div className="flex items-center gap-3 text-xs text-text-muted lg:col-span-2">
                <Upload size={16} className="text-brand-primary" />
                <span>Stockage: `storage/uploads/images/` · URL publique: `/uploads/images/...`</span>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border-main bg-bg-surface/50 flex items-end justify-between">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Médias</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{mediaImages.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1100px]">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Aperçu</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">URL</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Fichier</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Créé</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaImages.map((m) => (
                    <tr key={m.id} className="border-b border-border-main/50 hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-4">
                        <img src={m.url} alt="" className="w-12 h-12 object-cover border border-border-main" />
                      </td>
                      <td className="px-6 py-4">
                        <input value={m.url} readOnly className="w-[520px] bg-transparent border border-border-main/60 px-3 py-2 text-xs font-mono" />
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{m.filename}</td>
                      <td className="px-6 py-4 font-mono text-xs">{m.createdAt}</td>
                      <td className="px-6 py-4">
                        <button disabled={busy} onClick={() => deleteMediaImage(m.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60">
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'sponsors' && (
        <div className="space-y-10">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-6 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Ajouter un sponsor</h2>
              <button
                disabled={busy}
                onClick={createSponsor}
                className="btn-primary px-8 py-3 text-xs flex items-center gap-2 disabled:opacity-60"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">ID</span>
                <input
                  value={newSponsor.id}
                  onChange={(e) => setNewSponsor((s) => ({ ...s, id: e.target.value }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Ordre</span>
                <input
                  type="number"
                  value={newSponsor.order}
                  onChange={(e) => setNewSponsor((s) => ({ ...s, order: Number(e.target.value) }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Nom</span>
                <input
                  value={newSponsor.name}
                  onChange={(e) => setNewSponsor((s) => ({ ...s, name: e.target.value }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Logo URL</span>
                <input
                  value={newSponsor.logo}
                  onChange={(e) => setNewSponsor((s) => ({ ...s, logo: e.target.value }))}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                />
              </label>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border-main bg-bg-surface/50 flex items-end justify-between">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Sponsors</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{sponsors.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Ordre</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Logo</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Nom</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">URL</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((s) => (
                    <tr key={s.id} className="border-b border-border-main/50 hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={s.order}
                          onChange={(e) =>
                            setSponsors((prev) =>
                              prev.map((x) => (x.id === s.id ? { ...x, order: Number(e.target.value) } : x))
                            )
                          }
                          className="w-24 bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <img src={s.logo} alt="" className="h-10 w-auto object-contain border border-border-main bg-bg-main px-2" />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={s.name}
                          onChange={(e) => setSponsors((prev) => prev.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)))}
                          className="w-full bg-transparent border border-border-main/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={s.logo}
                          onChange={(e) => setSponsors((prev) => prev.map((x) => (x.id === s.id ? { ...x, logo: e.target.value } : x)))}
                          className="w-[420px] bg-transparent border border-border-main/60 px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            disabled={busy}
                            onClick={() => patchSponsor(s.id, s)}
                            className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60"
                          >
                            <Save size={14} /> Enregistrer
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => deleteSponsor(s.id)}
                            className="btn-outline px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60"
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

