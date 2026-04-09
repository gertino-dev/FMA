import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ArrowRight, 
  Medal, 
  Timer, 
  Globe, 
  Trophy, 
  Users, 
  Calendar, 
  BarChart3, 
  Play, 
  Mail,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Page, NewsItem, Competition, Athlete } from '../types';
import { ATHLETES, COMPETITIONS, RANKINGS, NEWS } from '../constants';

interface HomePageProps {
  setPage: (p: Page) => void;
  setSelectedArticle: (a: NewsItem) => void;
  setSelectedCompetition: (c: Competition) => void;
  setSelectedAthlete: (a: Athlete) => void;
}

export const HomePage = ({ setPage, setSelectedArticle, setSelectedCompetition, setSelectedAthlete }: HomePageProps) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroImages = [
    "/image/image%20(6).png",
    "/image/image%20(1).png",
    "/image/image%20(3).png",
    "/image/image%20(2).png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="space-y-32 pb-20 pt-32">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:h-[80vh] flex items-center overflow-hidden py-20 lg:py-0">
        <div className="absolute inset-0 z-0">
          {/* Floating Decorative Elements */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-10 w-32 h-32 border-2 border-brand-primary/20 hidden lg:block"
          />
          <motion.div 
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-48 h-48 border-2 border-brand-primary/10 -rotate-12 hidden lg:block"
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.1, x: -20 }}
              animate={{ 
                opacity: 0.6, 
                scale: 1.2, 
                x: 20,
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 2 },
                scale: { duration: 10, ease: "linear" },
                x: { duration: 10, ease: "linear" }
              }}
              className="absolute inset-0"
            >
              <img 
                src={heroImages[heroIndex]} 
                alt="Athlétisme Hero" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-main/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="badge-sport">
                Saison 2026
              </span>
              <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                Fédération Malagasy d'Athlétisme
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 40, skewX: -5 }}
              animate={{ opacity: 1, y: 0, skewX: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-[0.9] mb-8 italic uppercase tracking-tighter"
            >
              Dépassez les <br />
              <motion.span 
                initial={{ color: 'inherit' }}
                animate={{ color: 'var(--color-brand-primary)' }}
                transition={{ delay: 1.2, duration: 1 }}
                className="text-brand-primary"
              >
                Limites.
              </motion.span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-text-muted mb-10 leading-relaxed max-w-lg"
            >
              Plongez au cœur de l'excellence athlétique malagasy. Suivez les records, les athlètes et les compétitions qui marquent l'histoire de la Grande Île.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <button onClick={() => setPage('competitions')} className="btn-primary group flex items-center gap-2">
                Voir le calendrier <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setPage('athletes')} className="btn-outline">Découvrir les athlètes</button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Stats Overlay */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-10 right-6 hidden lg:block"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-bg-surface border-l-8 border-brand-primary p-8 shadow-2xl -skew-x-6"
          >
            <div className="flex gap-12">
              <div>
                <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Athlètes</p>
                <p className="text-3xl font-display font-black italic">2,500+</p>
              </div>
              <div className="w-px h-12 bg-border-main" />
              <div>
                <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Records</p>
                <p className="text-3xl font-display font-black italic">156</p>
              </div>
              <div className="w-px h-12 bg-border-main" />
              <div>
                <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">Ligues</p>
                <p className="text-3xl font-display font-black italic">22</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* News Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-[1920px] mx-auto px-6"
      >
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display font-black uppercase italic tracking-tight mb-2">Actualités</h2>
            <p className="text-text-muted">Les dernières nouvelles de l'athlétisme à Madagascar.</p>
          </div>
          <button 
            onClick={() => setPage('actualites')}
            className="text-brand-primary font-bold flex items-center gap-2 hover:underline"
          >
            Tout voir <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12">
          {NEWS.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -10 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: i * 0.1 
              }}
              viewport={{ once: true }}
              className="group cursor-pointer relative"
              onClick={() => {
                setSelectedArticle(item);
                setPage('article');
              }}
            >
              <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden mb-6 shadow-2xl border border-border-main/10 bg-bg-surface">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                
                {/* Number Indicator */}
                <div className="absolute top-6 right-6 overflow-hidden">
                  <motion.span 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 0.15 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-display font-black italic text-white block leading-none"
                  >
                    0{i + 1}
                  </motion.span>
                </div>

                {/* Content Area */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10 flex flex-col justify-end min-h-[60%]">
                  {/* Category Badge - Moved here to avoid overlap with top elements */}
                  <div className="mb-4">
                    <span className="inline-block bg-brand-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 -skew-x-12 shadow-lg">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-brand-primary text-[9px] font-black uppercase tracking-[0.15em] mb-3">
                    <div className="w-6 h-[1px] bg-brand-primary" />
                    {item.date}
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-lg 2xl:text-2xl font-display font-black leading-[1.1] text-white uppercase italic tracking-tight group-hover:text-brand-primary transition-colors duration-300 line-clamp-4 break-words hyphens-auto">
                    {item.title}
                  </h3>
                  
                  {/* Read More Reveal */}
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/70">Lire l'article</span>
                    <ArrowRight size={12} className="text-brand-primary" />
                  </div>
                </div>

                {/* Hover Reveal Arrow Button */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 hidden sm:block">
                  <div className="w-10 h-10 bg-white flex items-center justify-center text-brand-primary shadow-2xl">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Athlete */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-bg-surface py-24 relative overflow-hidden"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none"
        >
          <BarChart3 size={600} className="text-text-main" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mb-12 lg:mb-0"
          >
            <div className="aspect-square overflow-hidden border-4 border-border-main shadow-2xl">
              <img 
                src={ATHLETES[0].image} 
                alt={ATHLETES[0].name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 glass-card p-4 sm:p-8 shadow-2xl skew-x-1 max-w-[200px] sm:max-w-none">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-brand-primary flex items-center justify-center text-white -rotate-6 shrink-0">
                  <Medal size={16} className="sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-text-muted text-[8px] sm:text-[10px] uppercase tracking-widest">Discipline</p>
                  <p className="text-sm sm:text-lg font-display font-bold truncate">{ATHLETES[0].discipline}</p>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-8">
                <div>
                  <p className="text-text-muted text-[8px] sm:text-[10px] uppercase tracking-widest">Record</p>
                  <p className="text-sm sm:text-xl font-display font-bold">{ATHLETES[0].performance}</p>
                </div>
                <div>
                  <p className="text-text-muted text-[8px] sm:text-[10px] uppercase tracking-widest">Rang</p>
                  <p className="text-sm sm:text-xl font-display font-bold">#1 Nat.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-brand-primary text-xs sm:text-sm font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4">Athlète en vedette</h2>
              <h3 className="text-4xl sm:text-5xl md:text-7xl font-display font-black italic uppercase tracking-tighter mb-4 sm:mb-6">
                {ATHLETES[0].name}
              </h3>
              <p className="text-text-muted text-base sm:text-lg leading-relaxed">
                La championne de Madagascar du 100m haies continue de porter haut les couleurs nationales sur la scène internationale. Découvrez son parcours et ses prochains défis.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-bg-surface border border-border-main">
                <Timer className="text-brand-primary mb-2 sm:mb-3 sm:w-6 sm:h-6" size={20} />
                <p className="text-xs sm:text-sm text-text-muted uppercase tracking-widest mb-1">Vitesse Max</p>
                <p className="text-xl sm:text-2xl font-display font-bold">38.4 km/h</p>
              </div>
              <div className="p-4 sm:p-6 bg-bg-surface border border-border-main min-w-0">
                <Globe className="text-brand-primary mb-2 sm:mb-3 sm:w-6 sm:h-6" size={20} />
                <p className="text-xs sm:text-sm text-text-muted uppercase tracking-widest mb-1">Pays</p>
                <p className="text-xl sm:text-2xl font-display font-bold truncate">{ATHLETES[0].country}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedAthlete(ATHLETES[0]);
                setPage('athlete-profile');
              }}
              className="btn-primary"
            >
              Voir le profil complet
            </button>
          </div>
        </div>
      </motion.section>

      {/* Rankings & Results */}
      <section className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-20 mb-32">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-display font-black italic uppercase tracking-tight mb-2">Classement National</h2>
              <p className="text-text-muted">Les athlètes les plus performants de la saison.</p>
            </div>
          </div>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-main">
                  <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-text-muted">Rang</th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-text-muted">Athlète</th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-text-muted">Perf</th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-text-muted">Tendance</th>
                </tr>
              </thead>
              <tbody>
                {RANKINGS.slice(0, 5).map((row, i) => (
                  <tr 
                    key={i} 
                    onClick={() => {
                      const athlete = ATHLETES.find(a => a.name === row.athlete);
                      if (athlete) {
                        setSelectedAthlete(athlete);
                        setPage('athlete-profile');
                      }
                    }}
                    className="border-b border-border-main/50 hover:bg-bg-surface transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6 font-display font-bold text-2xl italic">#{i + 1}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold group-hover:text-brand-primary transition-colors">{row.athlete}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">{row.discipline}</p>
                    </td>
                    <td className="px-8 py-6 font-mono font-bold">{row.points} pts</td>
                    <td className="px-8 py-6">
                      {row.trend === 'up' ? <TrendingUp className="text-green-500" size={18} /> : 
                       row.trend === 'down' ? <TrendingDown className="text-brand-primary" size={18} /> : 
                       <Minus className="text-text-muted" size={18} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 bg-bg-surface/50 border-t border-border-main text-center">
              <button 
                onClick={() => setPage('classements')}
                className="text-xs font-black uppercase tracking-[0.3em] text-text-muted hover:text-brand-primary transition-colors"
              >
                Voir le classement complet
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display font-black italic uppercase tracking-tight">Événements</h2>
            <button 
              onClick={() => setPage('competitions')}
              className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline"
            >
              Calendrier
            </button>
          </div>
          <div className="space-y-4">
            {(showAllEvents ? COMPETITIONS : COMPETITIONS.slice(0, 5)).map((comp) => (
              <div 
                key={comp.id} 
                onClick={() => {
                  setSelectedCompetition(comp);
                  setPage('programme');
                }}
                className="group cursor-pointer bg-bg-surface border border-border-main p-4 hover:border-brand-primary transition-all"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-bg-main overflow-hidden flex-shrink-0">
                    <img src={comp.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest mb-1">{comp.date}</p>
                    <h4 className="text-sm font-bold leading-tight line-clamp-2 uppercase">{comp.title}</h4>
                    <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1"><Globe size={10} /> {comp.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMPETITIONS.length > 5 && (
              <button
                onClick={() => setShowAllEvents((v) => !v)}
                className="w-full btn-outline py-3 text-sm"
              >
                {showAllEvents ? 'Voir moins' : 'Voir plus'}
              </button>
            )}
            <button onClick={() => setPage('competitions')} className="w-full btn-outline py-3 text-sm">
              Voir tout le calendrier
            </button>
          </div>
        </div>
      </section>

      {/* New Full-Width Video Carousel Section */}
      <section className="py-20 md:py-32 bg-bg-surface/30 border-y border-border-main overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-7xl font-display font-black uppercase italic tracking-tighter mb-4">
                Action <span className="text-brand-primary">Live</span>
              </h2>
              <p className="text-text-muted text-base md:text-lg max-w-xl">
                Revivez les moments les plus intenses de l'athlétisme malagasy en haute définition.
              </p>
            </div>
            {/* Desktop Navigation (Hidden on small mobile) */}
            <div className="hidden md:flex gap-4">
              <button 
                onClick={() => setVideoIndex(prev => (prev - 1 + 5) % 5)}
                className="w-14 h-14 bg-bg-main border border-border-main flex items-center justify-center hover:bg-brand-primary transition-all text-text-main cursor-pointer z-20"
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <button 
                onClick={() => setVideoIndex(prev => (prev + 1) % 5)}
                className="w-14 h-14 bg-bg-main border border-border-main flex items-center justify-center hover:bg-brand-primary transition-all text-text-main cursor-pointer z-20"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center items-center h-[350px] md:h-[700px] group/carousel">
          {/* Floating Navigation Buttons (Visible on Mobile/Tablet, Hidden on Desktop) */}
          <button 
            onClick={() => setVideoIndex(prev => (prev - 1 + 5) % 5)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary/90 text-white flex items-center justify-center z-40 md:hidden hover:bg-brand-primary transition-all shadow-xl"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <button 
            onClick={() => setVideoIndex(prev => (prev + 1) % 5)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary/90 text-white flex items-center justify-center z-40 md:hidden hover:bg-brand-primary transition-all shadow-xl"
          >
            <ChevronRight size={20} />
          </button>

          <div 
            className="flex items-center gap-4 md:gap-8 transition-all duration-700 ease-[0.16, 1, 0.3, 1]" 
            style={{ 
              transform: `translateX(calc(50% - ${isMobile ? (videoIndex * 85) + 42.5 : (videoIndex * 70) + 35}vw))` 
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => {
              const isActive = i === videoIndex;
              return (
                <motion.div
                  key={i}
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0.3,
                    filter: isActive ? 'blur(0px)' : 'blur(10px)',
                  }}
                  transition={{ duration: 0.6 }}
                  className="relative flex-shrink-0 w-[85vw] md:w-[70vw] aspect-video border border-border-main overflow-hidden cursor-pointer group"
                  onClick={() => setVideoIndex(i)}
                >
                  <img 
                    src={`/image/image%20(${(i % 15) + 1}).png`} 
                    alt="Video" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className="w-14 h-14 md:w-20 md:h-20 bg-brand-primary flex items-center justify-center text-white shadow-[0_0_50px_rgba(225,29,72,0.5)]"
                      >
                        <Play size={isActive ? 32 : 24} className="md:w-8 md:h-8 w-6 h-6" fill="currentColor" />
                      </motion.div>
                    </div>
                  )}

                  <div className={`absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-[8px] md:text-xs">Highlights 2026</p>
                    <h3 className="text-xl md:text-5xl font-display font-black italic uppercase text-white tracking-tighter leading-none">Performance Exceptionnelle #{i + 1}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-center gap-3 mt-8 md:mt-12">
          {[0, 1, 2, 3, 4].map((i) => (
            <button 
              key={i}
              onClick={() => setVideoIndex(i)}
              className={`h-1 transition-all duration-500 ${videoIndex === i ? 'bg-brand-primary w-8 md:w-12' : 'bg-border-main w-4 md:w-6'}`}
            />
          ))}
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Records du Monde", value: "142", icon: Trophy },
            { label: "Nations Affiliées", value: "214", icon: Globe },
            { label: "Compétitions / An", value: "350+", icon: Calendar },
            { label: "Athlètes Élite", value: "5000+", icon: Users },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8 glass-card border border-border-main"
            >
              <stat.icon className="mx-auto mb-4 text-brand-primary" size={32} />
              <p className="text-4xl font-display font-black mb-2">{stat.value}</p>
              <p className="text-text-muted text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display font-black uppercase italic tracking-tight mb-2">Prochaines Compétitions</h2>
            <p className="text-text-muted">Ne manquez aucun événement majeur de la saison.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(showAllUpcoming ? COMPETITIONS : COMPETITIONS.slice(0, 6)).map((comp, i) => (
            <motion.div 
              key={comp.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden group hover:border-brand-primary/50 transition-colors"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={comp.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-bg-surface/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest border border-border-main text-text-main">
                  {comp.status}
                </div>
              </div>
              <div className="p-8">
                <p className="text-brand-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{comp.category}</p>
                <h3 className="text-xl font-display font-bold mb-6 leading-tight">{comp.title}</h3>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-text-muted text-sm">
                    <Calendar size={16} className="text-brand-primary" />
                    <span>{comp.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-muted text-sm">
                    <Globe size={16} className="text-brand-primary" />
                    <span>{comp.location}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCompetition(comp);
                    setPage('billetterie');
                  }}
                  className="w-full py-3 bg-bg-surface hover:bg-brand-primary transition-colors text-sm font-bold border border-border-main hover:border-transparent text-text-main hover:text-white"
                >
                  Détails de l'événement
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {COMPETITIONS.length > 6 && (
          <div className="mt-10 flex justify-center">
            <button onClick={() => setShowAllUpcoming((v) => !v)} className="btn-outline py-3 px-10 text-sm">
              {showAllUpcoming ? 'Voir moins' : 'Voir plus'}
            </button>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-brand-primary py-20 mb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <BarChart3 size={800} className="text-white -translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Mail className="mx-auto mb-8 text-white/80" size={48} />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-black italic uppercase tracking-tighter mb-8 text-white">
              Rejoignez la <br />Communauté FMA
            </h2>
            <p className="text-white/80 text-lg mb-12">
              Inscrivez-vous pour recevoir les alertes records, les résultats en direct et des contenus exclusifs sur vos athlètes préférés.
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-1 bg-white/20 border border-white/30 py-4 px-8 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30 transition-all"
              />
              <button className="bg-white text-brand-primary font-black uppercase tracking-widest px-8 py-4 hover:bg-gray-100 transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
