import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Save, Trash2, RefreshCw } from 'lucide-react';
import { Page } from '../types';
import {
  AdminContent,
  AdminNews,
  AdminVideo,
  AdminAthlete,
  AdminCompetitionGroup,
  AdminSubCompetition,
  TicketTier,
  TicketingConfig,
  ProgramSession,
  ProgramEvent,
  ProgrammeConfig,
  ResultEvent,
  ResultRow,
  ResultConfig,
  DirectUpcoming,
  loadAdminContent,
  saveAdminContent,
  getDefaultAdminContent,
} from '../lib/adminContentStore';

type TabId =
  | 'accueil'
  | 'actualites'
  | 'feature'
  | 'videos'
  | 'athletes'
  | 'competitions'
  | 'billetterie'
  | 'programme'
  | 'resultats'
  | 'direct';

interface Props {
  setPage: (p: Page) => void;
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function TextInput(props: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <label className={`grid gap-2 ${props.className ?? ''}`}>
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{props.label}</span>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
      />
    </label>
  );
}

function TextArea(props: { label: string; value: string; onChange: (v: string) => void; rows?: number; className?: string }) {
  return (
    <label className={`grid gap-2 ${props.className ?? ''}`}>
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{props.label}</span>
      <textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        rows={props.rows ?? 5}
        className="bg-bg-main border-2 border-border-main p-4 text-sm focus:outline-none focus:border-brand-primary"
      />
    </label>
  );
}

export const AdminContentPage = ({ setPage }: Props) => {
  const [tab, setTab] = useState<TabId>('accueil');
  const [content, setContent] = useState<AdminContent>(() => loadAdminContent());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  const tabs = useMemo(
    () =>
      [
        { id: 'accueil', label: 'Accueil' },
        { id: 'actualites', label: 'Actualités' },
        { id: 'feature', label: "Actu du jour" },
        { id: 'videos', label: 'Vidéos' },
        { id: 'athletes', label: 'Profils athlètes' },
        { id: 'competitions', label: 'Compétitions' },
        { id: 'billetterie', label: 'Billetterie' },
        { id: 'programme', label: 'Programme' },
        { id: 'resultats', label: 'Résultats' },
        { id: 'direct', label: 'Direct' },
      ] as Array<{ id: TabId; label: string }>,
    []
  );

  function save() {
    try {
      setError(null);
      saveAdminContent(content);
      setSavedAt(new Date().toLocaleString());
    } catch (e: any) {
      setError(e?.message ?? 'Erreur');
    }
  }

  function resetDefaults() {
    if (!confirm('Revenir aux valeurs par défaut ?')) return;
    const next = getDefaultAdminContent();
    setContent(next);
    saveAdminContent(next);
    setSavedAt(new Date().toLocaleString());
  }

  const allEvents = useMemo(() => {
    const out: Array<{ id: string; label: string }> = [];
    for (const g of content.competitions) {
      for (const s of g.subCompetitions) {
        out.push({
          id: s.id,
          label: `${g.category} · ${g.title} — ${s.title} (${s.date || 'date ?'})`,
        });
      }
    }
    return out;
  }, [content.competitions]);

  function ensureSelectedEvent() {
    if (selectedEventId) return selectedEventId;
    const first = allEvents[0]?.id ?? '';
    if (first) setSelectedEventId(first);
    return first;
  }

  function goToLinked(tabId: TabId, eventId: string) {
    setSelectedEventId(eventId);
    setTab(tabId);
    if (tabId === 'billetterie') ensureTicketing(eventId);
    if (tabId === 'programme') ensureProgramme(eventId);
    if (tabId === 'resultats') ensureResult(eventId);
  }

  // --- Accueil / hero backgrounds
  function setHeroBackground(index: number, v: string) {
    setContent((prev) => {
      const next = { ...prev, home: { ...prev.home, heroBackgrounds: prev.home.heroBackgrounds.slice() } };
      next.home.heroBackgrounds[index] = v;
      return next;
    });
  }
  function addHeroBackground() {
    setContent((prev) => ({ ...prev, home: { ...prev.home, heroBackgrounds: prev.home.heroBackgrounds.concat('/image/image%20(1).png') } }));
  }
  function deleteHeroBackground(index: number) {
    setContent((prev) => ({ ...prev, home: { ...prev.home, heroBackgrounds: prev.home.heroBackgrounds.filter((_, i) => i !== index) } }));
  }

  // --- Actualités
  function addNews() {
    const n: AdminNews = {
      id: uid('news'),
      date: new Date().toLocaleDateString('fr-FR'),
      category: 'Compétition',
      title: '',
      photo: '/image/image%20(1).png',
      hook: '',
      text: '',
    };
    setContent((prev) => ({ ...prev, news: [n, ...prev.news] }));
  }
  function patchNews(id: string, patch: Partial<AdminNews>) {
    setContent((prev) => ({ ...prev, news: prev.news.map((n) => (n.id === id ? { ...n, ...patch } : n)) }));
  }
  function deleteNews(id: string) {
    if (!confirm('Supprimer cette actualité ?')) return;
    setContent((prev) => ({ ...prev, news: prev.news.filter((n) => n.id !== id) }));
  }

  // --- Actu du jour / feature
  function patchFeature(patch: Partial<AdminContent['dailyFeature']>) {
    setContent((prev) => ({ ...prev, dailyFeature: { ...prev.dailyFeature, ...patch } }));
  }
  function addFeatureCard() {
    setContent((prev) => ({
      ...prev,
      dailyFeature: {
        ...prev.dailyFeature,
        cards: prev.dailyFeature.cards.concat({ id: uid('card'), title: 'Nouvelle card', text: '', accent: '' }),
      },
    }));
  }
  function patchFeatureCard(id: string, patch: Partial<AdminContent['dailyFeature']['cards'][number]>) {
    setContent((prev) => ({
      ...prev,
      dailyFeature: {
        ...prev.dailyFeature,
        cards: prev.dailyFeature.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    }));
  }
  function deleteFeatureCard(id: string) {
    setContent((prev) => ({ ...prev, dailyFeature: { ...prev.dailyFeature, cards: prev.dailyFeature.cards.filter((c) => c.id !== id) } }));
  }

  // --- Videos
  function addVideo() {
    const v: AdminVideo = { id: uid('vid'), title: 'Nouvelle vidéo', youtubeId: '', poster: '/image/image%20(1).png' };
    setContent((prev) => ({ ...prev, videos: [v, ...prev.videos] }));
  }
  function patchVideo(id: string, patch: Partial<AdminVideo>) {
    setContent((prev) => ({ ...prev, videos: prev.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)) }));
  }
  function deleteVideo(id: string) {
    if (!confirm('Supprimer cette vidéo ?')) return;
    setContent((prev) => ({ ...prev, videos: prev.videos.filter((v) => v.id !== id) }));
  }

  // --- Athlètes
  function addAthlete() {
    const a: AdminAthlete = {
      id: uid('ath'),
      name: '',
      country: 'Madagascar',
      flag: '🇲🇬',
      discipline: '',
      rank: 0,
      performance: '',
      image: '/image/image%20(1).png',
      bio: '',
    };
    setContent((prev) => ({ ...prev, athletes: [a, ...prev.athletes] }));
  }
  function patchAthlete(id: string, patch: Partial<AdminAthlete>) {
    setContent((prev) => ({ ...prev, athletes: prev.athletes.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
  }
  function deleteAthlete(id: string) {
    if (!confirm('Supprimer cet athlète ?')) return;
    setContent((prev) => ({ ...prev, athletes: prev.athletes.filter((a) => a.id !== id) }));
  }

  // --- Compétitions (groupe + sous-compétitions)
  function addCompetitionGroup() {
    const g: AdminCompetitionGroup = {
      id: uid('g'),
      category: 'National',
      title: 'Nouvelle compétition',
      date: '',
      location: '',
      status: 'À venir',
      image: '/image/image%20(1).png',
      subCompetitions: [],
    };
    setContent((prev) => ({ ...prev, competitions: [g, ...prev.competitions] }));
  }
  function patchCompetitionGroup(id: string, patch: Partial<AdminCompetitionGroup>) {
    setContent((prev) => ({ ...prev, competitions: prev.competitions.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
  }
  function deleteCompetitionGroup(id: string) {
    if (!confirm('Supprimer ce groupe ?')) return;
    setContent((prev) => ({ ...prev, competitions: prev.competitions.filter((g) => g.id !== id) }));
  }
  function addSubCompetition(groupId: string) {
    const s: AdminSubCompetition = { id: uid('sub'), title: 'Sous‑compétition', date: '', location: '', status: 'À venir' };
    setContent((prev) => ({
      ...prev,
      competitions: prev.competitions.map((g) => (g.id === groupId ? { ...g, subCompetitions: g.subCompetitions.concat(s) } : g)),
    }));
  }
  function patchSubCompetition(groupId: string, subId: string, patch: Partial<AdminSubCompetition>) {
    setContent((prev) => ({
      ...prev,
      competitions: prev.competitions.map((g) =>
        g.id === groupId ? { ...g, subCompetitions: g.subCompetitions.map((s) => (s.id === subId ? { ...s, ...patch } : s)) } : g
      ),
    }));
  }
  function deleteSubCompetition(groupId: string, subId: string) {
    if (!confirm('Supprimer cette sous‑compétition ?')) return;
    setContent((prev) => ({
      ...prev,
      competitions: prev.competitions.map((g) =>
        g.id === groupId ? { ...g, subCompetitions: g.subCompetitions.filter((s) => s.id !== subId) } : g
      ),
    }));
  }

  // --- Billetterie (liée à un évènement)
  function ensureTicketing(eventId: string) {
    setContent((prev) => {
      if (prev.ticketingByEventId[eventId]) return prev;
      return { ...prev, ticketingByEventId: { ...prev.ticketingByEventId, [eventId]: structuredClone(prev.ticketingTemplate) } };
    });
  }
  function patchTicketing(eventId: string, patch: Partial<TicketingConfig>) {
    setContent((prev) => ({
      ...prev,
      ticketingByEventId: {
        ...prev.ticketingByEventId,
        [eventId]: { ...(prev.ticketingByEventId[eventId] ?? prev.ticketingTemplate), ...patch },
      },
    }));
  }
  function addTier() {
    const t: TicketTier = { id: uid('tier'), type: 'Nouveau', price: '', features: [''] };
    const ev = ensureSelectedEvent();
    if (!ev) return;
    ensureTicketing(ev);
    setContent((prev) => ({
      ...prev,
      ticketingByEventId: {
        ...prev.ticketingByEventId,
        [ev]: {
          ...(prev.ticketingByEventId[ev] ?? prev.ticketingTemplate),
          tiers: (prev.ticketingByEventId[ev]?.tiers ?? prev.ticketingTemplate.tiers).concat(t),
        },
      },
    }));
  }
  function patchTier(id: string, patch: Partial<TicketTier>) {
    const ev = ensureSelectedEvent();
    if (!ev) return;
    setContent((prev) => {
      const cur = prev.ticketingByEventId[ev] ?? prev.ticketingTemplate;
      return {
        ...prev,
        ticketingByEventId: { ...prev.ticketingByEventId, [ev]: { ...cur, tiers: cur.tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)) } },
      };
    });
  }
  function deleteTier(id: string) {
    if (!confirm('Supprimer ce tarif ?')) return;
    const ev = ensureSelectedEvent();
    if (!ev) return;
    setContent((prev) => {
      const cur = prev.ticketingByEventId[ev] ?? prev.ticketingTemplate;
      return {
        ...prev,
        ticketingByEventId: { ...prev.ticketingByEventId, [ev]: { ...cur, tiers: cur.tiers.filter((t) => t.id !== id) } },
      };
    });
  }

  // --- Programme (lié à un évènement)
  function ensureProgramme(eventId: string) {
    setContent((prev) => {
      if (prev.programmeByEventId[eventId]) return prev;
      return { ...prev, programmeByEventId: { ...prev.programmeByEventId, [eventId]: structuredClone(prev.programmeTemplate) } };
    });
  }
  function patchProgramme(eventId: string, patch: Partial<ProgrammeConfig>) {
    setContent((prev) => ({
      ...prev,
      programmeByEventId: {
        ...prev.programmeByEventId,
        [eventId]: { ...(prev.programmeByEventId[eventId] ?? prev.programmeTemplate), ...patch },
      },
    }));
  }
  function addSession() {
    const s: ProgramSession = { id: uid('session'), session: 'Session', time: '', events: [] };
    const ev = ensureSelectedEvent();
    if (!ev) return;
    ensureProgramme(ev);
    setContent((prev) => {
      const cur = prev.programmeByEventId[ev] ?? prev.programmeTemplate;
      return {
        ...prev,
        programmeByEventId: { ...prev.programmeByEventId, [ev]: { ...cur, sessions: cur.sessions.concat(s) } },
      };
    });
  }
  function patchSession(id: string, patch: Partial<ProgramSession>) {
    const ev = ensureSelectedEvent();
    if (!ev) return;
    setContent((prev) => {
      const cur = prev.programmeByEventId[ev] ?? prev.programmeTemplate;
      return {
        ...prev,
        programmeByEventId: { ...prev.programmeByEventId, [ev]: { ...cur, sessions: cur.sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)) } },
      };
    });
  }
  function deleteSession(id: string) {
    if (!confirm('Supprimer cette session ?')) return;
    const ev = ensureSelectedEvent();
    if (!ev) return;
    setContent((prev) => {
      const cur = prev.programmeByEventId[ev] ?? prev.programmeTemplate;
      return {
        ...prev,
        programmeByEventId: { ...prev.programmeByEventId, [ev]: { ...cur, sessions: cur.sessions.filter((s) => s.id !== id) } },
      };
    });
  }
  function addProgramEvent(sessionId: string) {
    const e: ProgramEvent = { id: uid('evt'), time: '', title: '', category: '' };
    const ev = ensureSelectedEvent();
    if (!ev) return;
    setContent((prev) => {
      const cur = prev.programmeByEventId[ev] ?? prev.programmeTemplate;
      return {
        ...prev,
        programmeByEventId: {
          ...prev.programmeByEventId,
          [ev]: {
            ...cur,
            sessions: cur.sessions.map((s) => (s.id === sessionId ? { ...s, events: s.events.concat(e) } : s)),
          },
        },
      };
    });
  }
  function patchProgramEvent(sessionId: string, eventId: string, patch: Partial<ProgramEvent>) {
    const ev = ensureSelectedEvent();
    if (!ev) return;
    setContent((prev) => {
      const cur = prev.programmeByEventId[ev] ?? prev.programmeTemplate;
      return {
        ...prev,
        programmeByEventId: {
          ...prev.programmeByEventId,
          [ev]: {
            ...cur,
            sessions: cur.sessions.map((s) =>
              s.id === sessionId ? { ...s, events: s.events.map((e) => (e.id === eventId ? { ...e, ...patch } : e)) } : s
            ),
          },
        },
      };
    });
  }
  function deleteProgramEvent(sessionId: string, eventId: string) {
    if (!confirm('Supprimer cette épreuve ?')) return;
    const ev = ensureSelectedEvent();
    if (!ev) return;
    setContent((prev) => {
      const cur = prev.programmeByEventId[ev] ?? prev.programmeTemplate;
      return {
        ...prev,
        programmeByEventId: {
          ...prev.programmeByEventId,
          [ev]: {
            ...cur,
            sessions: cur.sessions.map((s) => (s.id === sessionId ? { ...s, events: s.events.filter((e) => e.id !== eventId) } : s)),
          },
        },
      };
    });
  }

  // --- Résultats (liés à un évènement)
  function ensureResult(eventId: string) {
    setContent((prev) => {
      if (prev.resultsByEventId[eventId]) return prev;
      const meta = {
        title: 'Résultat',
        date: '',
        location: '',
        category: '',
        status: 'Résultats',
        image: '/image/image%20(1).png',
      };
      return { ...prev, resultsByEventId: { ...prev.resultsByEventId, [eventId]: { meta, events: [] } } };
    });
  }
  function patchResultMeta(eventId: string, patch: Partial<ResultConfig['meta']>) {
    setContent((prev) => {
      const cur = prev.resultsByEventId[eventId] ?? { meta: { title: '', date: '', location: '', category: '', status: 'Résultats', image: '' }, events: [] };
      return { ...prev, resultsByEventId: { ...prev.resultsByEventId, [eventId]: { ...cur, meta: { ...cur.meta, ...patch } } } };
    });
  }
  function addResultEvent(eventId: string) {
    const ev: ResultEvent = { id: uid('rev'), epreuve: '', categorie: '', genre: '', rows: [] };
    setContent((prev) => {
      const cur = prev.resultsByEventId[eventId] ?? { meta: { title: '', date: '', location: '', category: '', status: 'Résultats', image: '' }, events: [] };
      return { ...prev, resultsByEventId: { ...prev.resultsByEventId, [eventId]: { ...cur, events: cur.events.concat(ev) } } };
    });
  }
  function patchResultEvent(eventId: string, eventBlockId: string, patch: Partial<ResultEvent>) {
    setContent((prev) => {
      const cur = prev.resultsByEventId[eventId];
      if (!cur) return prev;
      return { ...prev, resultsByEventId: { ...prev.resultsByEventId, [eventId]: { ...cur, events: cur.events.map((e) => (e.id === eventBlockId ? { ...e, ...patch } : e)) } } };
    });
  }
  function deleteResultEvent(eventId: string, eventBlockId: string) {
    if (!confirm('Supprimer cette épreuve ?')) return;
    setContent((prev) => {
      const cur = prev.resultsByEventId[eventId];
      if (!cur) return prev;
      return { ...prev, resultsByEventId: { ...prev.resultsByEventId, [eventId]: { ...cur, events: cur.events.filter((e) => e.id !== eventBlockId) } } };
    });
  }
  function addResultRow(eventId: string, eventBlockId: string) {
    const row: ResultRow = { id: uid('row'), dossard: '', rang: '', nomPrenoms: '', club: '', perf: '', points: '' };
    setContent((prev) => {
      const cur = prev.resultsByEventId[eventId];
      if (!cur) return prev;
      return {
        ...prev,
        resultsByEventId: {
          ...prev.resultsByEventId,
          [eventId]: {
            ...cur,
            events: cur.events.map((e) => (e.id === eventBlockId ? { ...e, rows: e.rows.concat(row) } : e)),
          },
        },
      };
    });
  }
  function patchResultRow(eventId: string, eventBlockId: string, rowId: string, patch: Partial<ResultRow>) {
    setContent((prev) => {
      const cur = prev.resultsByEventId[eventId];
      if (!cur) return prev;
      return {
        ...prev,
        resultsByEventId: {
          ...prev.resultsByEventId,
          [eventId]: {
            ...cur,
            events: cur.events.map((e) =>
              e.id === eventBlockId ? { ...e, rows: e.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)) } : e
            ),
          },
        },
      };
    });
  }
  function deleteResultRow(eventId: string, eventBlockId: string, rowId: string) {
    if (!confirm('Supprimer cette ligne ?')) return;
    setContent((prev) => {
      const cur = prev.resultsByEventId[eventId];
      if (!cur) return prev;
      return {
        ...prev,
        resultsByEventId: {
          ...prev.resultsByEventId,
          [eventId]: {
            ...cur,
            events: cur.events.map((e) => (e.id === eventBlockId ? { ...e, rows: e.rows.filter((r) => r.id !== rowId) } : e)),
          },
        },
      };
    });
  }

  // --- Direct
  function patchDirect(patch: Partial<AdminContent['direct']>) {
    setContent((prev) => ({ ...prev, direct: { ...prev.direct, ...patch } }));
  }
  function addDirectUpcoming() {
    const u: DirectUpcoming = { id: uid('up'), time: '', title: '', category: '' };
    setContent((prev) => ({ ...prev, direct: { ...prev.direct, upcoming: prev.direct.upcoming.concat(u) } }));
  }
  function patchDirectUpcoming(id: string, patch: Partial<DirectUpcoming>) {
    setContent((prev) => ({ ...prev, direct: { ...prev.direct, upcoming: prev.direct.upcoming.map((u) => (u.id === id ? { ...u, ...patch } : u)) } }));
  }
  function deleteDirectUpcoming(id: string) {
    if (!confirm('Supprimer ?')) return;
    setContent((prev) => ({ ...prev, direct: { ...prev.direct, upcoming: prev.direct.upcoming.filter((u) => u.id !== id) } }));
  }

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-6xl font-display font-black italic uppercase tracking-tighter mb-4">Back‑office</h1>
          <p className="text-text-muted text-base sm:text-lg max-w-3xl border-l-4 border-brand-primary pl-6">
            Interface admin <b>sans JSON</b>. Modifie les infos du site, puis clique sur <b>Enregistrer</b>.
          </p>
          {savedAt && <p className="text-xs text-text-muted mt-2">Dernière sauvegarde: {savedAt}</p>}
        </motion.div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => { setContent(loadAdminContent()); setError(null); }} className="btn-outline px-6 py-3 text-xs flex items-center gap-2">
            <RefreshCw size={16} /> Recharger
          </button>
          <button onClick={resetDefaults} className="btn-outline px-6 py-3 text-xs">Valeurs par défaut</button>
          <button onClick={save} className="btn-primary px-8 py-3 text-xs flex items-center gap-2">
            <Save size={16} /> Enregistrer
          </button>
          <button onClick={() => setPage('accueil')} className="btn-outline px-6 py-3 text-xs">Retour au site</button>
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
            <span className="skew-x-12 inline-block">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'accueil' && (
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-2xl font-display font-black italic uppercase tracking-tight mb-6">Accueil</h2>
          <p className="text-xs text-text-muted mb-6">Images de fond du premier écran (hero).</p>
          <div className="grid gap-4">
            {content.home.heroBackgrounds.map((src, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <img src={src} alt="" className="w-24 h-16 object-cover border border-border-main bg-bg-main" />
                <input
                  value={src}
                  onChange={(e) => setHeroBackground(i, e.target.value)}
                  className="flex-1 bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary font-mono"
                />
                <button onClick={() => deleteHeroBackground(i)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            ))}
            <button onClick={addHeroBackground} className="btn-outline px-6 py-3 text-xs flex items-center gap-2 w-fit">
              <Plus size={16} /> Ajouter une image
            </button>
          </div>
        </div>
      )}

      {tab === 'actualites' && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Actualités</h2>
              <button onClick={addNews} className="btn-primary px-8 py-3 text-xs flex items-center gap-2">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <p className="text-xs text-text-muted">Chaque actualité: grand titre, photo, hook, texte complet.</p>
          </div>

          {content.news.map((n) => (
            <div key={n.id} className="glass-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="text-xs text-text-muted font-mono">id: {n.id}</div>
                <button onClick={() => deleteNews(n.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TextInput label="Nature / catégorie" value={n.category} onChange={(v) => patchNews(n.id, { category: v })} />
                <TextInput label="Date" value={n.date} onChange={(v) => patchNews(n.id, { date: v })} />
                <TextInput className="lg:col-span-2" label="Grand titre" value={n.title} onChange={(v) => patchNews(n.id, { title: v })} />
                <TextInput className="lg:col-span-2" label="Photo (URL)" value={n.photo} onChange={(v) => patchNews(n.id, { photo: v })} />
                <TextArea className="lg:col-span-2" label="Hook" value={n.hook} onChange={(v) => patchNews(n.id, { hook: v })} rows={3} />
                <TextArea className="lg:col-span-2" label="Texte (complet)" value={n.text} onChange={(v) => patchNews(n.id, { text: v })} rows={10} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'feature' && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-black italic uppercase tracking-tight mb-6">Actu du jour (bloc vedette)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TextInput label="Nature" value={content.dailyFeature.nature} onChange={(v) => patchFeature({ nature: v })} />
              <TextInput label="Grand titre" value={content.dailyFeature.title} onChange={(v) => patchFeature({ title: v })} />
              <TextArea className="lg:col-span-2" label="Texte" value={content.dailyFeature.text} onChange={(v) => patchFeature({ text: v })} rows={6} />
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-display font-black italic uppercase tracking-tight">Cards</h3>
              <button onClick={addFeatureCard} className="btn-outline px-6 py-3 text-xs flex items-center gap-2">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content.dailyFeature.cards.map((c) => (
                <div key={c.id} className="border border-border-main bg-bg-surface/30 p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs text-text-muted font-mono">{c.id}</div>
                    <button onClick={() => deleteFeatureCard(c.id)} className="btn-outline px-3 py-2 text-xs flex items-center gap-2">
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                  <div className="grid gap-4">
                    <TextInput label="Titre" value={c.title} onChange={(v) => patchFeatureCard(c.id, { title: v })} />
                    <TextInput label="Texte" value={c.text} onChange={(v) => patchFeatureCard(c.id, { text: v })} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'videos' && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Vidéos (YouTube)</h2>
              <button onClick={addVideo} className="btn-primary px-8 py-3 text-xs flex items-center gap-2">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <p className="text-xs text-text-muted">L’admin colle juste le <b>youtubeId</b> + une image poster.</p>
          </div>
          {content.videos.map((v) => (
            <div key={v.id} className="glass-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="text-xs text-text-muted font-mono">id: {v.id}</div>
                <button onClick={() => deleteVideo(v.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TextInput label="Titre" value={v.title} onChange={(x) => patchVideo(v.id, { title: x })} />
                <TextInput label="YouTube ID" value={v.youtubeId} onChange={(x) => patchVideo(v.id, { youtubeId: x })} />
                <TextInput className="lg:col-span-2" label="Poster (URL)" value={v.poster} onChange={(x) => patchVideo(v.id, { poster: x })} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'athletes' && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Profils des athlètes</h2>
              <button onClick={addAthlete} className="btn-primary px-8 py-3 text-xs flex items-center gap-2">
                <Plus size={16} /> Ajouter
              </button>
            </div>
          </div>
          {content.athletes.map((a) => (
            <div key={a.id} className="glass-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="text-xs text-text-muted font-mono">id: {a.id}</div>
                <button onClick={() => deleteAthlete(a.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TextInput label="Nom" value={a.name} onChange={(v) => patchAthlete(a.id, { name: v })} />
                <TextInput label="Discipline" value={a.discipline} onChange={(v) => patchAthlete(a.id, { discipline: v })} />
                <TextInput label="Pays" value={a.country} onChange={(v) => patchAthlete(a.id, { country: v })} />
                <TextInput label="Drapeau" value={a.flag} onChange={(v) => patchAthlete(a.id, { flag: v })} />
                <TextInput label="Rang" value={String(a.rank)} onChange={(v) => patchAthlete(a.id, { rank: Number(v) || 0 })} />
                <TextInput label="Performance" value={a.performance} onChange={(v) => patchAthlete(a.id, { performance: v })} />
                <TextInput className="lg:col-span-2" label="Image (URL)" value={a.image} onChange={(v) => patchAthlete(a.id, { image: v })} />
                <TextArea className="lg:col-span-2" label="Bio" value={a.bio} onChange={(v) => patchAthlete(a.id, { bio: v })} rows={6} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'competitions' && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Compétitions (groupe + sous‑compétitions)</h2>
              <button onClick={addCompetitionGroup} className="btn-primary px-8 py-3 text-xs flex items-center gap-2">
                <Plus size={16} /> Ajouter un groupe
              </button>
            </div>
            <p className="text-xs text-text-muted">
              Exemple: “MADAGASCAR ATHLETICS FEDERATION CALENDAR 2026” (groupe) puis plusieurs sous‑compétitions dedans.
            </p>
          </div>

          {content.competitions.map((g) => (
            <div key={g.id} className="glass-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="text-xs text-text-muted font-mono">id: {g.id}</div>
                <div className="flex gap-3">
                  <button onClick={() => addSubCompetition(g.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                    <Plus size={14} /> Sous‑compétition
                  </button>
                  <button onClick={() => deleteCompetitionGroup(g.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TextInput label="Catégorie" value={g.category} onChange={(v) => patchCompetitionGroup(g.id, { category: v })} />
                <TextInput label="Statut" value={g.status} onChange={(v) => patchCompetitionGroup(g.id, { status: v })} />
                <TextInput className="lg:col-span-2" label="Titre du groupe" value={g.title} onChange={(v) => patchCompetitionGroup(g.id, { title: v })} />
                <TextInput label="Date (groupe)" value={g.date} onChange={(v) => patchCompetitionGroup(g.id, { date: v })} />
                <TextInput label="Lieu (groupe)" value={g.location} onChange={(v) => patchCompetitionGroup(g.id, { location: v })} />
                <TextInput className="lg:col-span-2" label="Image (URL)" value={g.image} onChange={(v) => patchCompetitionGroup(g.id, { image: v })} />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-text-main">Sous‑compétitions ({g.subCompetitions.length})</h3>
                {g.subCompetitions.map((s) => (
                  <div key={s.id} className="border border-border-main bg-bg-surface/30 p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xs text-text-muted font-mono">{s.id}</div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => goToLinked('billetterie', s.id)} className="btn-outline px-3 py-2 text-xs">Billetterie</button>
                        <button onClick={() => goToLinked('programme', s.id)} className="btn-outline px-3 py-2 text-xs">Programme</button>
                        <button onClick={() => goToLinked('resultats', s.id)} className="btn-outline px-3 py-2 text-xs">Résultats</button>
                        <button onClick={() => deleteSubCompetition(g.id, s.id)} className="btn-outline px-3 py-2 text-xs flex items-center gap-2">
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <TextInput label="Titre" value={s.title} onChange={(v) => patchSubCompetition(g.id, s.id, { title: v })} className="lg:col-span-2" />
                      <TextInput label="Date" value={s.date} onChange={(v) => patchSubCompetition(g.id, s.id, { date: v })} />
                      <TextInput label="Statut" value={s.status} onChange={(v) => patchSubCompetition(g.id, s.id, { status: v })} />
                      <TextInput label="Lieu" value={s.location} onChange={(v) => patchSubCompetition(g.id, s.id, { location: v })} className="lg:col-span-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'billetterie' && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-black italic uppercase tracking-tight mb-6">Billetterie</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Évènement</span>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    ensureTicketing(e.target.value);
                  }}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                >
                  <option value="">— Choisir —</option>
                  {allEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {selectedEventId && !content.ticketingByEventId[selectedEventId] && (
              <button onClick={() => ensureTicketing(selectedEventId)} className="btn-outline px-6 py-3 text-xs mb-6">
                Créer la billetterie pour cet évènement
              </button>
            )}
            {!selectedEventId && <p className="text-xs text-text-muted mb-6">Commence par choisir une sous‑compétition.</p>}
            {selectedEventId && content.ticketingByEventId[selectedEventId] && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TextInput label="Badge (titre)" value={content.ticketingByEventId[selectedEventId].eliteBadgeTitle} onChange={(v) => patchTicketing(selectedEventId, { eliteBadgeTitle: v })} />
              <TextInput label="Badge (sous‑titre)" value={content.ticketingByEventId[selectedEventId].eliteBadgeSubtitle} onChange={(v) => patchTicketing(selectedEventId, { eliteBadgeSubtitle: v })} />
              <TextArea className="lg:col-span-2" label="Phrase (citation)" value={content.ticketingByEventId[selectedEventId].quote} onChange={(v) => patchTicketing(selectedEventId, { quote: v })} rows={4} />
            </div>
            )}
          </div>
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-display font-black italic uppercase tracking-tight">Tarifs</h3>
              <button onClick={addTier} className="btn-outline px-6 py-3 text-xs flex items-center gap-2">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-6">
              {(selectedEventId ? content.ticketingByEventId[selectedEventId]?.tiers ?? [] : []).map((t) => (
                <div key={t.id} className="border border-border-main bg-bg-surface/30 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs text-text-muted font-mono">{t.id}</div>
                    <button onClick={() => deleteTier(t.id)} className="btn-outline px-3 py-2 text-xs flex items-center gap-2">
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                    <TextInput label="Type" value={t.type} onChange={(v) => patchTier(t.id, { type: v })} />
                    <TextInput label="Prix" value={t.price} onChange={(v) => patchTier(t.id, { price: v })} />
                  </div>
                  <TextArea
                    label="Features (une par ligne)"
                    value={t.features.join('\n')}
                    onChange={(v) => patchTier(t.id, { features: v.split('\n').map((x) => x.trim()).filter(Boolean) })}
                    rows={5}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'programme' && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-black italic uppercase tracking-tight mb-6">Programme</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Évènement</span>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    ensureProgramme(e.target.value);
                  }}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                >
                  <option value="">— Choisir —</option>
                  {allEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {selectedEventId && !content.programmeByEventId[selectedEventId] && (
              <button onClick={() => ensureProgramme(selectedEventId)} className="btn-outline px-6 py-3 text-xs mb-6">
                Créer le programme pour cet évènement
              </button>
            )}
            {!selectedEventId && <p className="text-xs text-text-muted mb-6">Commence par choisir une sous‑compétition.</p>}
            {selectedEventId && content.programmeByEventId[selectedEventId] && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TextInput label="Badge (titre)" value={content.programmeByEventId[selectedEventId].badgeTitle} onChange={(v) => patchProgramme(selectedEventId, { badgeTitle: v })} />
              <TextInput label="Badge (sous‑titre)" value={content.programmeByEventId[selectedEventId].badgeSubtitle} onChange={(v) => patchProgramme(selectedEventId, { badgeSubtitle: v })} />
              <TextArea className="lg:col-span-2" label="Phrase (citation)" value={content.programmeByEventId[selectedEventId].quote} onChange={(v) => patchProgramme(selectedEventId, { quote: v })} rows={4} />
            </div>
            )}
          </div>
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-display font-black italic uppercase tracking-tight">Sessions</h3>
              <button onClick={addSession} className="btn-outline px-6 py-3 text-xs flex items-center gap-2">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-8">
              {(selectedEventId ? content.programmeByEventId[selectedEventId]?.sessions ?? [] : []).map((s) => (
                <div key={s.id} className="border border-border-main bg-bg-surface/30 p-6">
                  <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                    <div className="text-xs text-text-muted font-mono">{s.id}</div>
                    <div className="flex gap-3">
                      <button onClick={() => addProgramEvent(s.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                        <Plus size={14} /> Épreuve
                      </button>
                      <button onClick={() => deleteSession(s.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <TextInput label="Nom session" value={s.session} onChange={(v) => patchSession(s.id, { session: v })} />
                    <TextInput label="Plage horaire" value={s.time} onChange={(v) => patchSession(s.id, { time: v })} />
                  </div>
                  <div className="space-y-4">
                    {s.events.map((e) => (
                      <div key={e.id} className="border border-border-main/80 bg-bg-main/30 p-5">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-xs text-text-muted font-mono">{e.id}</div>
                          <button onClick={() => deleteProgramEvent(s.id, e.id)} className="btn-outline px-3 py-2 text-xs flex items-center gap-2">
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <TextInput label="Heure" value={e.time} onChange={(v) => patchProgramEvent(s.id, e.id, { time: v })} />
                          <TextInput label="Catégorie" value={e.category} onChange={(v) => patchProgramEvent(s.id, e.id, { category: v })} />
                          <TextInput label="Titre" value={e.title} onChange={(v) => patchProgramEvent(s.id, e.id, { title: v })} className="lg:col-span-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'resultats' && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Résultats</h2>
            </div>
            <p className="text-xs text-text-muted">
              Les résultats sont liés à une sous‑compétition (évènement). Choisis l’évènement puis ajoute les épreuves + lignes.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <label className="grid gap-2 lg:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Évènement</span>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    ensureResult(e.target.value);
                  }}
                  className="bg-bg-main border-2 border-border-main py-2 px-4 text-sm focus:outline-none focus:border-brand-primary"
                >
                  <option value="">— Choisir —</option>
                  {allEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {selectedEventId && !content.resultsByEventId[selectedEventId] && (
              <button onClick={() => ensureResult(selectedEventId)} className="btn-outline px-6 py-3 text-xs mt-6">
                Créer les résultats pour cet évènement
              </button>
            )}
          </div>

          {selectedEventId && content.resultsByEventId[selectedEventId] && (
            <div className="glass-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="text-xs text-text-muted font-mono">{selectedEventId}</div>
                <button onClick={() => addResultEvent(selectedEventId)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                  <Plus size={14} /> Épreuve
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TextInput label="Titre" value={content.resultsByEventId[selectedEventId].meta.title} onChange={(v) => patchResultMeta(selectedEventId, { title: v })} className="lg:col-span-2" />
                <TextInput label="Date" value={content.resultsByEventId[selectedEventId].meta.date} onChange={(v) => patchResultMeta(selectedEventId, { date: v })} />
                <TextInput label="Lieu" value={content.resultsByEventId[selectedEventId].meta.location} onChange={(v) => patchResultMeta(selectedEventId, { location: v })} />
                <TextInput label="Catégorie" value={content.resultsByEventId[selectedEventId].meta.category} onChange={(v) => patchResultMeta(selectedEventId, { category: v })} />
                <TextInput label="Statut" value={content.resultsByEventId[selectedEventId].meta.status} onChange={(v) => patchResultMeta(selectedEventId, { status: v })} />
                <TextInput label="Image" value={content.resultsByEventId[selectedEventId].meta.image} onChange={(v) => patchResultMeta(selectedEventId, { image: v })} className="lg:col-span-2" />
              </div>

              <div className="space-y-6">
                {(content.resultsByEventId[selectedEventId].events ?? []).map((ev) => (
                  <div key={ev.id} className="border border-border-main bg-bg-surface/30 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="text-xs text-text-muted font-mono">{ev.id}</div>
                      <div className="flex gap-3">
                        <button onClick={() => addResultRow(selectedEventId, ev.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                          <Plus size={14} /> Ligne
                        </button>
                        <button onClick={() => deleteResultEvent(selectedEventId, ev.id)} className="btn-outline px-4 py-2 text-xs flex items-center gap-2">
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <TextInput label="Épreuve" value={ev.epreuve} onChange={(v) => patchResultEvent(selectedEventId, ev.id, { epreuve: v })} />
                      <TextInput label="Catégorie" value={ev.categorie} onChange={(v) => patchResultEvent(selectedEventId, ev.id, { categorie: v })} />
                      <TextInput label="Genre" value={ev.genre} onChange={(v) => patchResultEvent(selectedEventId, ev.id, { genre: v })} />
                    </div>
                    <div className="space-y-3">
                      {ev.rows.map((row) => (
                        <div key={row.id} className="border border-border-main/70 bg-bg-main/30 p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-xs text-text-muted font-mono">{row.id}</div>
                            <button onClick={() => deleteResultRow(selectedEventId, ev.id, row.id)} className="btn-outline px-3 py-2 text-xs flex items-center gap-2">
                              <Trash2 size={14} /> Supprimer
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            <TextInput label="Dossard" value={row.dossard} onChange={(v) => patchResultRow(selectedEventId, ev.id, row.id, { dossard: v })} />
                            <TextInput label="Rang" value={row.rang} onChange={(v) => patchResultRow(selectedEventId, ev.id, row.id, { rang: v })} />
                            <TextInput label="Nom & Prénoms" value={row.nomPrenoms} onChange={(v) => patchResultRow(selectedEventId, ev.id, row.id, { nomPrenoms: v })} className="md:col-span-2" />
                            <TextInput label="Club" value={row.club} onChange={(v) => patchResultRow(selectedEventId, ev.id, row.id, { club: v })} />
                            <TextInput label="Perf" value={row.perf} onChange={(v) => patchResultRow(selectedEventId, ev.id, row.id, { perf: v })} />
                            <TextInput label="Points" value={row.points} onChange={(v) => patchResultRow(selectedEventId, ev.id, row.id, { points: v })} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'direct' && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-black italic uppercase tracking-tight mb-6">Direct</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TextInput label="Titre page" value={content.direct.title} onChange={(v) => patchDirect({ title: v })} />
              <TextInput label="Label spectateurs" value={content.direct.viewerCountLabel} onChange={(v) => patchDirect({ viewerCountLabel: v })} />
              <TextArea className="lg:col-span-2" label="Sous‑titre" value={content.direct.subtitle} onChange={(v) => patchDirect({ subtitle: v })} rows={3} />
              <TextInput className="lg:col-span-2" label="Image fond (URL)" value={content.direct.heroImage} onChange={(v) => patchDirect({ heroImage: v })} />
              <TextInput label="Titre live" value={content.direct.liveTitle} onChange={(v) => patchDirect({ liveTitle: v })} />
              <TextInput label="Lieu live" value={content.direct.liveLocation} onChange={(v) => patchDirect({ liveLocation: v })} />
              <TextArea className="lg:col-span-2" label="Phrase promo" value={content.direct.promoQuote} onChange={(v) => patchDirect({ promoQuote: v })} rows={3} />
              <TextInput label="Label bouton CTA" value={content.direct.ctaLabel} onChange={(v) => patchDirect({ ctaLabel: v })} />
            </div>
          </div>
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-display font-black italic uppercase tracking-tight">Prochainement</h3>
              <button onClick={addDirectUpcoming} className="btn-outline px-6 py-3 text-xs flex items-center gap-2">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {content.direct.upcoming.map((u) => (
                <div key={u.id} className="border border-border-main bg-bg-surface/30 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs text-text-muted font-mono">{u.id}</div>
                    <button onClick={() => deleteDirectUpcoming(u.id)} className="btn-outline px-3 py-2 text-xs flex items-center gap-2">
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <TextInput label="Heure" value={u.time} onChange={(v) => patchDirectUpcoming(u.id, { time: v })} />
                    <TextInput label="Catégorie" value={u.category} onChange={(v) => patchDirectUpcoming(u.id, { category: v })} />
                    <TextInput label="Titre" value={u.title} onChange={(v) => patchDirectUpcoming(u.id, { title: v })} className="lg:col-span-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

