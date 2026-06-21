import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Search, Radio } from 'lucide-react';
import { Page } from '../types';
import { useAppNavigation } from '../lib/navigation';

interface NavbarProps {
  setPage: (p: Page, opts?: { athleteFilter?: string; search?: string; athleteId?: number }) => void;
  setAthleteFilter: (f: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const TICKER_ITEMS = [
  { type: 'live', text: 'Championnats Nationaux · Antananarivo · Saison 2026' },
  { type: 'news', text: 'Résultats des Championnats d\'Afrique SACA — 3 médailles pour Madagascar' },
  { type: 'news', text: 'Calendrier 2026 — 22 compétitions officielles confirmées' },
  { type: 'live', text: 'Inscriptions ouvertes — 1000 premiers inscrits offerts' },
  { type: 'news', text: 'FMA · Athlétisme Malagasy · Tanindrazana · Fahafahana · Fandrosoana' },
];

export const Navbar = ({ setPage, setAthleteFilter, theme, toggleTheme }: NavbarProps) => {
  const { currentPage } = useAppNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(64);

  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, [isScrolled]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blocage du scroll + préservation de la position pendant que le menu est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMobileMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const navItems: { label: string; id: Page }[] = [
    { label: 'Accueil', id: 'accueil' },
    { label: 'Actualités', id: 'actualites' },
    { label: 'Athlètes', id: 'athletes' },
    { label: 'Compétitions', id: 'competitions' },
    { label: 'Classements', id: 'classements' },
    { label: 'Résultats', id: 'resultats' },
  ];

  const handleSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setAthleteFilter('Tous');
    setPage('athletes', { search: trimmed, athleteFilter: 'Tous' });
    setIsMobileMenuOpen(false);
    setSearchQuery('');
  };

  const navigate = (id: Page) => {
    if (id === 'athletes') setAthleteFilter('Tous');
    setPage(id);
    setIsMobileMenuOpen(false);
  };

  const isActive = (id: Page) => currentPage === id;

  const BurgerButton = ({ className = '' }: { className?: string }) => (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={() => setIsMobileMenuOpen((v) => !v)}
      className={`relative w-11 h-11 flex flex-col items-center justify-center gap-[5px] border-2 transition-colors ${className} ${
        isMobileMenuOpen
          ? 'bg-brand-primary border-brand-primary text-white'
          : 'bg-bg-surface/90 border-border-main text-text-main hover:border-brand-primary'
      }`}
      aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      aria-expanded={isMobileMenuOpen}
      aria-controls="fullscreen-menu"
    >
      <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
      <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
      <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
    </motion.button>
  );

  const mobileMenu = createPortal(
    <div
      id="fullscreen-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      className={`fixed inset-0 bg-bg-main z-[200] xl:hidden transition-opacity duration-500 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Grille de points */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
          color: 'var(--color-brand-primary)',
        }}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-surface/80 to-transparent pointer-events-none" aria-hidden="true" />

      <div
        className="h-full flex flex-col overflow-y-auto relative px-6 safe-bottom"
        style={{ paddingTop: `${navHeight + 24}px`, paddingBottom: '2rem' }}
      >
        {/* Recherche */}
        <form
          className="relative mb-8 shrink-0"
          onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un athlète…"
            aria-label="Rechercher"
            className="w-full bg-bg-surface border border-border-main py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary"
          />
        </form>

        {/* Zone centrale — liens numérotés */}
        <div className="flex-1 flex flex-col justify-center">
          <nav aria-label="Menu principal" className="space-y-0 mb-8">
            {navItems.map((item, index) => (
              <div
                key={item.id}
                className={`transform transition-all duration-700 ease-out ${
                  isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${80 + index * 70}ms` : '0ms' }}
              >
                <button
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={`group w-full flex items-baseline gap-4 text-3xl sm:text-4xl font-display font-bold uppercase tracking-tight py-2.5 transition-all duration-300 relative overflow-hidden text-left ${
                    isActive(item.id) ? 'text-brand-primary' : 'text-text-main hover:text-brand-primary'
                  }`}
                  aria-current={isActive(item.id) ? 'page' : undefined}
                >
                  <span className="text-xs font-mono text-text-muted/40 tabular-nums w-5 text-right shrink-0 transition-colors duration-300 group-hover:text-brand-primary/60">
                    0{index + 1}
                  </span>
                  <span className="relative">
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                      {item.label}
                    </span>
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-brand-primary transition-all duration-500 ease-out ${
                        isActive(item.id) ? 'w-14 sm:w-16' : 'w-0 group-hover:w-14 sm:group-hover:w-16'
                      }`}
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </div>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => { setPage('direct'); setIsMobileMenuOpen(false); }}
            className={`btn-primary w-full flex items-center justify-center gap-2 text-sm py-4 transition-all duration-700 ease-out ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? `${80 + navItems.length * 70}ms` : '0ms' }}
          >
            <Radio size={14} />
            Direct Live
          </button>
        </div>

        {/* Footer */}
        <div
          className={`shrink-0 border-t border-border-main/60 pt-5 transition-all duration-700 ease-out ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? '500ms' : '0ms' }}
        >
          <div className="grid grid-cols-2 gap-4 text-xs text-text-muted">
            <div className="space-y-1">
              <p className="font-display font-bold text-text-main tracking-wide text-sm mb-1.5">FMA</p>
              <p className="text-text-muted/70 text-xs">Stade d'Alarobia</p>
              <p className="text-text-muted/70 text-xs">Antananarivo, Madagascar</p>
            </div>
            <div className="space-y-1">
              <p className="font-display font-bold text-text-main tracking-wide text-sm mb-1.5">CONTACT</p>
              <a
                href="mailto:contact@fma.mg"
                className="text-text-muted/70 hover:text-brand-primary transition-colors duration-300 inline-block text-xs underline-offset-4 hover:underline"
              >
                contact@fma.mg
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-210 transition-all duration-500 border-b safe-top ${
        isScrolled || isMobileMenuOpen
          ? 'bg-bg-surface/90 backdrop-blur-xl border-border-main/60'
          : 'bg-bg-surface/75 backdrop-blur-lg border-border-main/40 lg:bg-bg-surface/60'
      }`}
      style={isScrolled ? { boxShadow: 'var(--shadow-nav)' } : undefined}
    >
      {/* Ticker */}
      <div className={`overflow-hidden transition-all duration-500 motion-reduce:transition-none ${isScrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'}`}>
        <div className="bg-brand-primary h-8 flex items-center relative overflow-hidden">
          <div className="flex items-center gap-2 px-4 shrink-0 border-r border-white/20 h-full">
            <span className="relative flex h-1.5 w-1.5 motion-reduce:hidden">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/90">FMA</span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
              className="flex whitespace-nowrap motion-reduce:animate-none"
            >
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-5 px-8 text-[9px] font-medium tracking-wider text-white/85">
                  {item.text}
                  <span className="w-px h-3 bg-white/20 inline-block" />
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'py-2 lg:py-3' : 'py-3 lg:py-5'}`}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex flex-col text-left relative z-50"
          onClick={() => setPage('accueil')}
          aria-label="Accueil FMA"
        >
          <div className={`overflow-hidden flex items-center justify-center transition-all duration-500 ${isScrolled ? 'h-8 lg:h-9' : 'h-9 lg:h-12'}`} style={{ aspectRatio: '2.5 / 1' }}>
            <img src="/logo fma.png" alt="FMA" className="w-full h-full object-cover object-top scale-[1.15] origin-top" referrerPolicy="no-referrer" />
          </div>
          <div className="flex mt-1 gap-px">
            <div className="flex-1 h-px bg-brand-primary" />
            <div className="flex-1 h-px bg-current opacity-20" />
            <div className="flex-1 h-px bg-brand-secondary" />
          </div>
        </motion.button>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-5">
          <form
            className="relative group"
            onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary transition-colors" size={13} />
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un athlète…"
              aria-label="Rechercher un athlète"
              className="bg-bg-surface/40 border border-border-main py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-brand-primary focus:bg-bg-surface transition-all w-36 focus:w-52 rounded-none"
            />
          </form>

          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.id)}
              className={`relative px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap rounded-full ${
                currentPage === item.id
                  ? 'text-white bg-brand-primary shadow-sm'
                  : 'text-text-muted hover:text-brand-primary hover:bg-brand-primary/5'
              }`}
            >
              {item.label}
            </motion.button>
          ))}

          <motion.button whileHover={{ rotate: 15 }} onClick={toggleTheme} className="p-2 text-text-main" aria-label="Changer le thème">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setPage('direct')} className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2">
            <Radio size={13} />
            Direct
          </motion.button>
        </div>

        {/* Tablet + Mobile */}
        <div className="flex xl:hidden items-center gap-2 relative z-50">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="w-11 h-11 flex items-center justify-center border border-border-main/60 bg-bg-surface/80 text-text-main"
            aria-label="Changer le thème"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          <BurgerButton />
        </div>
      </div>

      {mobileMenu}
    </nav>
  );
};
