import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  ChevronRight,
  ArrowRight,
  Medal,
  Timer,
  Globe,
  Trophy,
  Users,
  Calendar,
  Play,
  Mail,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  ChevronLeft,
  ExternalLink,
  Zap,
  Clock,
  BookOpen,
  Radio,
} from 'lucide-react';
import { Page, NewsItem, Competition, Athlete } from '../types';
import { LOCAL_MEDIA_IMAGES, RANKINGS, HOME } from '../constants';
import { getPublicDb } from '../lib/publicDb';
import { AthleteAvatar } from './AthleteAvatar';
import { CompetitionImage } from './CompetitionImage';
import { SectionHeader } from './ui/SectionHeader';

interface HomePageProps {
  setPage: (p: Page) => void;
  setSelectedArticle: (a: NewsItem) => void;
  setSelectedCompetition: (c: Competition) => void;
  setSelectedAthlete: (a: Athlete) => void;
}

/* ─── Marquee strip ─── */
const MARQUEE_ITEMS = [
  'Athlétisme Malagasy',
  'Saison 2026',
  'Championnats Nationaux',
  'Records en Cours',
  'FMA',
  'Madagascar',
  'Tanindrazana',
  'Fahafahana',
  'Fandrosoana',
];

const MarqueeStrip = () => (
  <div className="overflow-hidden bg-text-main py-3.5 select-none">
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
      className="flex whitespace-nowrap motion-reduce:animate-none"
    >
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-5 px-10 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
          {item}
          <span className="w-1 h-1 rounded-full bg-brand-primary inline-block" />
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─── Actualités helpers ─── */
const getArticleExcerpt = (item: NewsItem, maxLen = 150): string => {
  if (!item.description) return '';
  let text = item.description;
  if (text.includes('|MAIN|')) {
    const [highlight, rest] = text.split('|MAIN|');
    text = `${highlight} ${rest.split('|CARDS|')[0]}`;
  }
  text = text.replace(/\|[^|]*\|/g, '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
};

const openArticle = (item: NewsItem, setSelectedArticle: (a: NewsItem) => void) => {
  setSelectedArticle(item);
};

/* ─── Records nationaux ─── */
const NATIONAL_RECORDS = [
  { event: '100m', time: '10.54', athlete: 'Andriamihaja R.', gender: 'H' },
  { event: '200m', time: '21.12', athlete: 'Andriantsoa L.', gender: 'H' },
  { event: '400m', time: '46.78', athlete: 'Rakotoarisoa J.', gender: 'H' },
  { event: '800m', time: '1:49.3', athlete: 'Ratsimbazafy M.', gender: 'H' },
  { event: '100m', time: '11.89', athlete: 'Rakotondrabe H.', gender: 'F' },
  { event: '200m', time: '23.41', athlete: 'Razafindrabe S.', gender: 'F' },
  { event: 'Long.', time: '7.89m', athlete: 'Andriamanantena T.', gender: 'H' },
  { event: 'Poids', time: '17.45m', athlete: 'Rasolofoson F.', gender: 'H' },
];

export const HomePage = ({
  setPage,
  setSelectedArticle,
  setSelectedCompetition,
  setSelectedAthlete,
}: HomePageProps) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [rankingsRows, setRankingsRows] = useState<any[]>([]);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroImages = LOCAL_MEDIA_IMAGES.slice(0, 4);
  const videoItems = [
    {
      id: 'v1',
      title: 'Vidéo officielle FMA',
      src: '/video/WhatsApp%20Video%202026-04-08%20at%2019.31.25.mp4',
      poster: LOCAL_MEDIA_IMAGES[0],
    },
  ];
  const videoCount = videoItems.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    getPublicDb()
      .then((db) => {
        setNews((db.news as NewsItem[]) ?? []);
        setAthletes((db.athletes as Athlete[]) ?? []);
        setCompetitions((db.competitions as Competition[]) ?? []);
      })
      .catch(() => {
        setNews([]);
        setAthletes([]);
        setCompetitions([]);
      });
  }, []);

  useEffect(() => {
    setRankingsRows(RANKINGS.tables.flatMap((t: any) => t.rows ?? []));
  }, []);

  return (
    <div className="pb-20 pt-36 overflow-x-hidden">

      {/* ════════════════════════════════ HERO ════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden -mt-36">
        {/* Background image with parallax */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 0.6, scale: 1.12 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.8 }, scale: { duration: 10, ease: 'linear' } }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[heroIndex]}
                alt="Hero"
                className="w-full h-full object-cover"
                fetchPriority={heroIndex === 0 ? 'high' : undefined}
                loading={heroIndex === 0 ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-bg-main/40" />

          {/* Diagonal accent */}
          <div
            className="absolute inset-0 pointer-events-none hidden lg:block"
            style={{
              background:
                'linear-gradient(105deg, transparent 55%, var(--color-brand-primary, #c8102e) 55.1%, var(--color-brand-primary, #c8102e) 55.4%, transparent 55.5%)',
              opacity: 0.07,
            }}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 w-full py-32 lg:pt-36 lg:pb-0"
        >
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="w-8 h-[2px] bg-brand-primary" />
              <span className="text-brand-primary text-[10px] font-medium uppercase tracking-[0.3em]">
                Fédération Malagasy d'Athlétisme
              </span>
            </motion.div>

            {/* Main headline */}
            <div className="overflow-hidden mb-6">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.75rem,10vw,8.5rem)] font-display font-black leading-[0.9] uppercase italic tracking-tighter"
              >
                Dépassez<br />
                les{' '}
                <motion.span
                  initial={{ color: 'currentColor' }}
                  animate={{ color: 'var(--color-brand-primary)' }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="text-brand-primary"
                >
                  Limites.
                </motion.span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-base md:text-lg text-text-muted leading-relaxed max-w-lg mb-8"
            >
              Plongez au cœur de l'excellence athlétique malagasy. Suivez les records, les athlètes et les compétitions qui marquent l'histoire de la Grande Île.
            </motion.p>

            {/* ── Devise nationale — touche personnalisée FMA ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="flex h-[3px] w-12 gap-[1px]">
                <div className="flex-1 bg-brand-primary" />
                <div className="flex-1 bg-white/50" />
                <div className="flex-1 bg-brand-secondary" />
              </div>
              <span className="text-[9px] font-light uppercase tracking-[0.35em] text-text-muted/50">
                Tanindrazana · Fahafahana · Fandrosoana
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <button
                onClick={() => setPage('competitions')}
                className="btn-primary group flex items-center gap-2 text-sm px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto justify-center"
              >
                Voir le calendrier
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setPage('athletes')}
                className="btn-outline text-sm px-6 sm:px-8 py-3.5 sm:py-4 w-full sm:w-auto justify-center"
              >
                Découvrir les athlètes
              </button>
            </motion.div>

            {/* Stats — mobile & tablet */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="mt-8 lg:hidden grid grid-cols-3 gap-2 sm:gap-3"
            >
              {HOME.hero.stats.map((s) => (
                <div key={s.id} className="bg-bg-surface/80 backdrop-blur-sm border border-border-main p-3 sm:p-4 text-center" style={{ borderTop: '2px solid var(--color-brand-primary)' }}>
                  <p className="text-lg sm:text-xl font-display font-bold">{s.value}</p>
                  <p className="text-[9px] sm:text-[9px] font-medium uppercase tracking-widest text-text-muted mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Floating stats card — desktop */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-12 right-6 hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-bg-surface/90 backdrop-blur-xl border border-border-main shadow-2xl p-6 motion-reduce:animate-none"
              style={{ borderLeft: '3px solid var(--color-brand-primary)' }}
            >
              <div className="flex gap-10">
                {HOME.hero.stats.map((s) => (
                  <div key={s.id}>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-text-muted mb-1">{s.label}</p>
                    <p className="text-2xl font-display font-bold">{s.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero dot navigation */}
        <div className="absolute bottom-8 left-6 z-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`transition-all duration-500 ${heroIndex === i ? 'w-8 h-1 bg-brand-primary' : 'w-2 h-1 bg-border-main hover:bg-text-muted'}`}
            />
          ))}
        </div>
      </section>

      {/* Marquee */}
      <MarqueeStrip />

      {/* ════════════════════════════════ ACCÈS RAPIDES ════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { n: '01', label: 'Calendrier', icon: Calendar, page: 'competitions' as Page, tone: 'primary' as const },
            { n: '02', label: 'Classements', icon: Trophy, page: 'classements' as Page, tone: 'dark' as const },
            { n: '03', label: 'Résultats', icon: Medal, page: 'resultats' as Page, tone: 'secondary' as const },
            { n: '04', label: 'Direct Live', icon: Radio, page: 'direct' as Page, tone: 'dark' as const },
          ].map((cta, i) => (
            <motion.button
              key={cta.page}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              viewport={{ once: true }}
              onClick={() => setPage(cta.page)}
              className={`group relative overflow-hidden flex flex-col justify-between p-5 sm:p-7 min-h-[120px] sm:min-h-[150px] text-left transition-transform duration-300 active:scale-[0.98] hover:-translate-y-1 ${
                cta.tone === 'primary'
                  ? 'bg-brand-primary text-white'
                  : cta.tone === 'secondary'
                  ? 'bg-brand-secondary text-white'
                  : 'bg-text-main text-bg-main'
              }`}
            >
              <div className="flex items-center justify-between">
                <cta.icon size={22} className="opacity-90" />
                <span className="text-[10px] font-mono opacity-50 tabular-nums">{cta.n}</span>
              </div>
              <span className="font-display font-black uppercase text-lg sm:text-2xl tracking-tight leading-none mt-4 flex items-center gap-2">
                {cta.label}
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════ STATS ════════════════════════════════ */}
      <section className="section-wrap section-pad">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Athlètes licenciés', value: '2 500', icon: Users, suffix: '+' },
            { label: 'Compétitions 2026', value: '22', icon: Calendar, suffix: '' },
            { label: 'Ligues régionales', value: '22', icon: Globe, suffix: '' },
            { label: 'Records nationaux', value: '156', icon: Trophy, suffix: '' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="stat-card group"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 flex items-center justify-center bg-brand-primary/8 text-brand-primary">
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted/50">FMA</span>
              </div>
              <p className="text-3xl md:text-4xl font-display font-bold mb-1 tabular-nums">
                {stat.value}<span className="text-brand-primary">{stat.suffix}</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest font-medium text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════ RECORDS NATIONAUX ════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-br from-[#3d1a24] via-[#2a1520] to-[#1e2433]">
        {/* Ambient brand glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-72 h-72 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ghost watermark */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13rem] font-display font-black italic text-white/[0.04] leading-none select-none pointer-events-none hidden lg:block">
          REC
        </span>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <span className="w-5 h-[2px] bg-brand-primary" />
              <span className="text-brand-primary text-[9px] font-medium uppercase tracking-[0.3em]">Records Nationaux</span>
            </div>
            <span className="text-[9px] font-medium uppercase tracking-widest text-white/50 bg-white/8 px-3 py-1 border border-white/15">
              Saison 2026
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Zap size={12} className="text-brand-secondary" />
              <span className="text-[9px] font-medium uppercase tracking-widest text-brand-secondary">Malagasy</span>
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-display font-black uppercase italic text-white mb-10 leading-none">
            Meilleurs <span className="text-brand-primary">Temps</span>
          </h2>
          <p className="text-white/40 text-sm uppercase tracking-[0.5em] font-light -mt-8 mb-10">
            An'i Madagasikara
          </p>

          {/* Records grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {NATIONAL_RECORDS.map((r) => (
              <motion.div
                key={`${r.event}-${r.gender}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.06] backdrop-blur-sm border border-white/10 p-5 hover:bg-brand-primary/25 hover:border-brand-primary/30 transition-all group cursor-default"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-medium uppercase tracking-widest text-white/45">{r.event}</span>
                  <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 ${r.gender === 'H' ? 'bg-brand-primary/25 text-brand-primary' : 'bg-brand-secondary/25 text-brand-secondary'}`}>
                    {r.gender}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-display font-black text-white group-hover:text-brand-primary transition-colors leading-none mb-2">{r.time}</p>
                <p className="text-[9px] text-white/50 truncate">{r.athlete}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setPage('classements')}
              className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-brand-primary transition-colors"
            >
              Tous les records →
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ ACTUALITÉS ════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-16 mb-4">
        <SectionHeader
          label="Éditorial"
          title={<>Actualités</>}
          sub="Articles, résultats et portraits de l'athlétisme malagasy."
          action="Tout voir"
          onAction={() => setPage('actualites')}
        />

        {news.length > 0 && (
          <div className="space-y-10">
            {/* Article à la une — mise en page magazine */}
            {news[0] && (
              <motion.article
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => openArticle(news[0], setSelectedArticle)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 card card-hover overflow-hidden">
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden">
                    <img
                      src={news[0].image}
                      alt={news[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-5 left-5">
                      <span className="inline-flex items-center gap-1.5 bg-brand-primary text-white text-[9px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5">
                        <Star size={9} fill="white" />
                        À la une
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-center p-7 md:p-10 border-t lg:border-t-0 lg:border-l border-border-main">
                    <div className="flex items-center gap-2 mb-5 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={11} className="text-text-muted" />
                      <span className="text-text-muted">{news[0].date}</span>
                      <span className="text-text-muted/40">·</span>
                      <span className="text-brand-primary">{news[0].category}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-display font-bold leading-tight tracking-tight mb-4 group-hover:text-brand-primary transition-colors">
                      {news[0].title}
                    </h3>

                    {getArticleExcerpt(news[0], 200) && (
                      <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-4">
                        {getArticleExcerpt(news[0], 200)}
                      </p>
                    )}

                    <div className="mt-auto flex items-center gap-2 text-brand-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                      <BookOpen size={13} />
                      <span>Lire l'article complet</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Liste dense — façon "Dernières actualités" */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-7 border-t border-border-main pt-8">
              {news.slice(1, 7).map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onClick={() => openArticle(item, setSelectedArticle)}
                >
                  <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest mb-2.5">
                    <span className="text-text-muted">{item.date}</span>
                    <span className="text-text-muted/40">·</span>
                    <span className="text-brand-primary">{item.category}</span>
                  </p>
                  <h3 className="text-sm sm:text-base font-display font-bold leading-snug group-hover:text-brand-primary transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                </motion.article>
              ))}
            </div>

            {news.length > 7 && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setPage('actualites')}
                  className="group inline-flex items-center gap-3 px-8 py-3.5 border-2 border-border-main bg-bg-surface text-[10px] font-black uppercase tracking-[0.2em] hover:border-brand-primary hover:text-brand-primary transition-all"
                >
                  Voir toutes les actualités
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ════════════════════════════════ ATHLÈTE EN VEDETTE ════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-bg-surface px-6 py-20 md:py-28 lg:pr-12 flex items-center"
          >
            <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="aspect-[4/5] overflow-hidden border border-border-main shadow-2xl relative">
                <AthleteAvatar
                  name={athletes[0]?.name || 'athlete'}
                  alt={athletes[0]?.name || 'Athlète'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute left-0 inset-y-0 w-1 bg-brand-primary" />
              </div>

              <div
                className="absolute -bottom-5 -right-4 md:-right-8 bg-bg-main border border-border-main shadow-2xl p-5 md:p-7"
                style={{ borderLeft: '3px solid var(--color-brand-primary)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-brand-primary flex items-center justify-center text-white">
                    <Medal size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-text-muted uppercase tracking-widest">Discipline</p>
                    <p className="text-sm font-display font-bold">{athletes[0]?.discipline || '—'}</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  {[
                    { label: 'Record', value: athletes[0]?.performance || '—' },
                    { label: 'Rang', value: '#1 Nat.' },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-[9px] text-text-muted uppercase tracking-widest">{s.label}</p>
                      <p className="text-lg font-display font-bold">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bloc de couleur plein */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-brand-primary text-white px-6 py-16 md:py-20 lg:pl-14 flex flex-col justify-center"
          >
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/70 border-l-2 border-white/40 pl-3 block mb-4">
              Athlète en vedette
            </span>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-tight leading-[0.93] mb-5">
              {athletes[0]?.name || 'Athlète FMA'}
            </h3>
            <p className="text-white/75 text-base leading-relaxed max-w-md">
              La championne de Madagascar du 100m haies continue de porter haut les couleurs nationales sur la scène internationale. Découvrez son parcours et ses prochains défis.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon: Timer, label: 'Vitesse Max', value: '38.4 km/h' },
                { icon: Globe, label: 'Pays', value: athletes[0]?.country || 'Madagascar' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-5 bg-white/10 border border-white/15 hover:bg-white/15 transition-colors">
                  <Icon className="text-white mb-3" size={18} />
                  <p className="text-[9px] text-white/60 uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-xl font-display font-bold truncate">{value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => { if (athletes[0]) setSelectedAthlete(athletes[0]); }}
              className="group inline-flex items-center gap-2 bg-white text-brand-primary font-black uppercase tracking-[0.15em] px-7 py-3.5 text-xs hover:bg-white/90 transition-colors w-fit mt-8"
            >
              Voir le profil complet
              <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* ════════════════════════════════ STATEMENT ════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0c0c0e] py-16 sm:py-24">
        <div className="absolute inset-y-0 -right-1/4 w-2/3 bg-brand-primary/10 -skew-x-12 pointer-events-none hidden lg:block" aria-hidden="true" />
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-64 h-64 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto px-6 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8"
        >
          <h2 className="font-display font-black italic uppercase text-white leading-[0.92] text-4xl sm:text-6xl lg:text-7xl tracking-tighter">
            Vous êtes un<br />
            vrai fan ?{' '}
            <span className="text-brand-primary">Prouvez-le.</span>
          </h2>
          <button
            onClick={() => setPage('direct')}
            className="btn-primary shrink-0 flex items-center gap-2 text-sm px-8 py-4 w-full sm:w-auto justify-center"
          >
            <Radio size={16} />
            Suivre le direct
          </button>
        </motion.div>
      </section>

      {/* ════════════════════════════════ CLASSEMENTS + ÉVÉNEMENTS ════════════════════════════════ */}
      <section className="bg-brand-primary/[0.07] dark:bg-brand-primary/[0.1] border-y border-brand-primary/15 py-20 sm:py-24">
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2">
          <SectionHeader
            label="Performances"
            title="Classement National"
            sub="Les athlètes les plus performants de la saison."
          />

          {/* Top performers — cartes photo + score */}
          <div className="space-y-2.5">
            {rankingsRows.slice(0, 5).map((row, i) => {
              const athlete = athletes.find((a) => a.name === row.athlete);
              const maxPoints = Math.max(...rankingsRows.slice(0, 5).map((r) => r.points), 1);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 4 }}
                  onClick={() => { if (athlete) setSelectedAthlete(athlete); }}
                  className="group flex items-center gap-3 sm:gap-5 bg-bg-surface border border-border-main p-3.5 sm:p-5 cursor-pointer hover:border-brand-primary/40 transition-all"
                >
                  <span className={`font-display font-black text-2xl sm:text-3xl italic w-8 sm:w-10 text-center shrink-0 ${i === 0 ? 'text-brand-primary' : 'text-text-muted/50'}`}>
                    {i + 1}
                  </span>
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-border-main group-hover:border-brand-primary/50 transition-colors">
                    <AthleteAvatar name={row.athlete} image={athlete?.image} alt={row.athlete} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm sm:text-base group-hover:text-brand-primary transition-colors truncate">{row.athlete}</p>
                    <p className="text-[9px] text-text-muted uppercase tracking-widest mt-0.5 truncate">{row.discipline} · {row.category}</p>
                    <div className="mt-2 h-[3px] bg-border-main w-full max-w-[160px] overflow-hidden">
                      <div className="h-full bg-brand-primary" style={{ width: `${Math.min((row.points / maxPoints) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-base sm:text-lg tabular-nums">{row.points}</p>
                    <p className="text-[8px] text-text-muted uppercase tracking-widest">pts</p>
                  </div>
                  <div className="shrink-0 hidden sm:block">
                    {row.trend === 'up' ? (
                      <TrendingUp className="text-brand-secondary" size={16} />
                    ) : row.trend === 'down' ? (
                      <TrendingDown className="text-brand-primary" size={16} />
                    ) : (
                      <Minus className="text-text-muted" size={16} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4">
            <button
              onClick={() => setPage('classements')}
              className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-brand-primary transition-colors"
            >
              Voir le classement complet →
            </button>
          </div>
        </div>

        <div>
          <SectionHeader
            label="Agenda"
            title="Événements"
            action="Calendrier"
            onAction={() => setPage('competitions')}
          />

          <div className="space-y-3">
            {(showAllEvents ? competitions : competitions.slice(0, 5)).map((comp) => (
              <motion.div
                key={comp.id}
                whileHover={{ x: 4 }}
                onClick={() => { setSelectedCompetition(comp); setPage('programme'); }}
                className="group cursor-pointer bg-bg-surface border border-border-main p-4 hover:border-brand-primary/50 transition-all"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 overflow-hidden flex-shrink-0 border border-border-main/40">
                    <CompetitionImage
                      title={comp.title}
                      alt={comp.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-brand-primary text-[9px] font-medium uppercase tracking-widest mb-1">{comp.date}</p>
                    <h4 className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">{comp.title}</h4>
                    <p className="text-[9px] text-text-muted mt-1 flex items-center gap-1">
                      <Globe size={9} /> {comp.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {competitions.length > 5 && (
              <button onClick={() => setShowAllEvents((v) => !v)} className="btn-outline py-2.5 text-xs">
                {showAllEvents ? 'Moins' : 'Plus'}
              </button>
            )}
            <button onClick={() => setPage('competitions')} className="btn-outline py-2.5 text-xs col-span-full sm:col-span-1">
              Tout le calendrier
            </button>
          </div>
        </div>
      </div>
      </section>

      {/* ════════════════════════════════ PROCHAINES COMPÉTITIONS ════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <SectionHeader
          label="Calendrier"
          title="Prochaines Compétitions"
          sub="Ne manquez aucun événement majeur de la saison."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAllUpcoming ? competitions : competitions.slice(0, 6)).map((comp, i) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="card card-hover overflow-hidden group"
            >
              <div className="h-44 overflow-hidden relative">
                <CompetitionImage
                  title={comp.title}
                  alt={comp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest bg-bg-surface/80 backdrop-blur border border-border-main px-2.5 py-1 text-text-main">
                  {comp.status}
                </span>
              </div>

              <div className="p-6">
                <p className="text-brand-primary text-[9px] font-medium uppercase tracking-[0.2em] mb-2">{comp.category}</p>
                <h3 className="text-base font-display font-semibold mb-4 leading-snug">{comp.title}</h3>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-text-muted text-xs">
                    <Calendar size={13} className="text-brand-primary shrink-0" />
                    <span>{comp.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted text-xs">
                    <Globe size={13} className="text-brand-primary shrink-0" />
                    <span>{comp.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCompetition(comp)}
                  className="w-full py-3 bg-bg-surface hover:bg-brand-primary transition-colors text-xs font-bold border border-border-main hover:border-transparent text-text-main hover:text-white uppercase tracking-widest active:scale-[0.98]"
                >
                  Voir le programme
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {competitions.length > 6 && (
          <div className="mt-8 flex justify-center">
            <button onClick={() => setShowAllUpcoming((v) => !v)} className="btn-outline px-10 py-3 text-sm">
              {showAllUpcoming ? 'Voir moins' : 'Voir plus'}
            </button>
          </div>
        )}
      </section>

      {/* ════════════════════════════════ VIDEO ════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-bg-surface/30 border-y border-border-main overflow-hidden relative mt-16">
        <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-brand-primary border-l-2 border-brand-primary pl-3 block mb-4">
                Contenu Exclusif
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight leading-none">
                Action <span className="text-brand-primary">Live</span>
              </h2>
              <p className="text-text-muted mt-3 text-sm max-w-md">
                Revivez les moments les plus intenses de l'athlétisme malagasy en haute définition.
              </p>
            </div>
            <div className="hidden md:flex gap-3">
              {[ChevronLeft, ChevronRight].map((Icon, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setVideoIndex((prev) =>
                      idx === 0
                        ? (prev - 1 + videoCount) % videoCount
                        : (prev + 1) % videoCount
                    )
                  }
                  className="w-12 h-12 bg-bg-main border border-border-main flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all text-text-main"
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex justify-center items-center h-[320px] md:h-[650px]">
          {[
            { dir: 'left', Icon: ChevronLeft, offset: 'left-4' },
            { dir: 'right', Icon: ChevronRight, offset: 'right-4' },
          ].map(({ dir, Icon, offset }) => (
            <button
              key={dir}
              onClick={() =>
                setVideoIndex((prev) =>
                  dir === 'left'
                    ? (prev - 1 + videoCount) % videoCount
                    : (prev + 1) % videoCount
                )
              }
              className={`absolute ${offset} top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary/90 text-white flex items-center justify-center z-40 md:hidden hover:bg-brand-primary transition-all shadow-xl`}
            >
              <Icon size={18} />
            </button>
          ))}

          <div
            className="flex items-center gap-4 md:gap-8 transition-all duration-700"
            style={{
              transform: `translateX(calc(50% - ${isMobile ? videoIndex * 85 + 42.5 : videoIndex * 70 + 35}vw))`,
            }}
          >
            {videoItems.map((item, i) => {
              const isActive = i === videoIndex;
              return (
                <motion.div
                  key={item.id}
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0.3,
                    filter: isActive ? 'blur(0px)' : 'blur(8px)',
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative flex-shrink-0 w-[85vw] md:w-[70vw] aspect-video border border-border-main overflow-hidden cursor-pointer"
                  onClick={() => setVideoIndex(i)}
                >
                  {isActive ? (
                    <video className="w-full h-full object-cover" controls playsInline preload="metadata">
                      <source src={item.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={item.poster} alt="Video" className="w-full h-full object-cover" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                  )}
                  {!isActive && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />}
                  <div
                    className={`absolute top-6 md:top-10 left-6 md:left-10 pointer-events-none transition-all duration-500 ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
                    }`}
                  >
                    <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-[9px] md:text-[10px]">
                      Highlights 2026
                    </p>
                    <h3 className="text-xl md:text-5xl font-display font-black italic uppercase text-white tracking-tighter leading-none">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {videoItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setVideoIndex(i)}
              className={`h-0.5 transition-all duration-500 ${videoIndex === i ? 'bg-brand-primary w-10' : 'bg-border-main w-4 hover:bg-text-muted'}`}
            />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════ NEWSLETTER ════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-primary py-20 md:py-28 mt-16">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
            backgroundSize: '18px 18px',
          }}
        />
        {/* ── Touche perso : devise malagasy en filigrane ── */}
        <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-[8rem] md:text-[14rem] font-display font-black italic text-white/[0.04] leading-none select-none pointer-events-none hidden lg:block whitespace-nowrap">
          AN'I MADAGASIKARA
        </span>

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-14 h-14 bg-white/15 border border-white/20 mb-8"
          >
            <Mail className="text-white" size={24} />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-6 text-white leading-tight">
            Rejoignez la<br />Communauté FMA
          </h2>
          <p className="text-white/65 text-sm md:text-base mb-10 max-w-md mx-auto leading-relaxed font-light">
            Recevez les alertes records, résultats en direct et contenus exclusifs sur vos athlètes préférés.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 bg-white/15 border border-white/25 py-3.5 px-6 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/25 transition-all text-sm"
            />
            <button className="bg-white text-brand-primary font-black uppercase tracking-[0.15em] px-7 py-3.5 text-xs hover:bg-white/90 transition-colors whitespace-nowrap">
              S'inscrire
            </button>
          </div>

          {/* Tricolore sous le formulaire */}
          <div className="flex justify-center mt-10 gap-[2px]">
            <div className="w-16 h-[2px] bg-brand-primary opacity-60" />
            <div className="w-16 h-[2px] bg-white opacity-40" />
            <div className="w-16 h-[2px] bg-brand-secondary opacity-60" />
          </div>
        </div>
      </section>

    </div>
  );
};
