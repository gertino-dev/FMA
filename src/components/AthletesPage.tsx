import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Page, Athlete } from '../types';
import { getPublicDb } from '../lib/publicDb';
import { AthleteAvatar } from './AthleteAvatar';
import { PageHeader } from './ui/SectionHeader';

interface AthletesPageProps {
  setSelectedAthlete: (a: Athlete) => void;
  setPage: (p: Page) => void;
  initialFilter?: string;
  initialSearch?: string;
}

const FILTERS = ['Tous', 'Sprints', 'Sauts', 'Lancers', 'Demi-fond', 'Combinés'];
const PER_PAGE = 5;

export const AthletesPage = ({ setSelectedAthlete, setPage, initialFilter = 'Tous', initialSearch = '' }: AthletesPageProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setActiveFilter(initialFilter); setCurrentPage(1); }, [initialFilter]);
  useEffect(() => { setSearchTerm(initialSearch); setCurrentPage(1); }, [initialSearch]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeFilter]);

  useEffect(() => {
    getPublicDb()
      .then((db) => setAthletes((db.athletes as Athlete[]) ?? []))
      .catch(() => setAthletes([]));
  }, []);

  const filtered = athletes.filter(a =>
    (a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.discipline.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeFilter === 'Tous' ||
      a.discipline.toLowerCase().includes(activeFilter.toLowerCase().replace(/s$/, '')) ||
      (activeFilter === 'Sprints' && (a.discipline.includes('100m') || a.discipline.includes('200m') || a.discipline.includes('400m'))))
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const goTo = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build visible page numbers (max 5, centered around current)
  const pageNumbers = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return Array.from({ length: 5 }, (_, i) => start + i);
  })();

  return (
    <div className="pt-40 md:pt-48 pb-24 min-h-screen">

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <PageHeader
            eyebrow="FMA · Saison 2026"
            title="Athlètes"
            description="Découvrez les profils des meilleurs athlètes malagasy, leurs performances et leurs statistiques détaillées."
            meta={
              <>
                <span className="text-text-main font-semibold">{filtered.length}</span> athlète{filtered.length > 1 ? 's' : ''}
                {activeFilter !== 'Tous' && ` · ${activeFilter}`}
                {totalPages > 1 && <span className="text-text-muted/60"> — p. {currentPage}/{totalPages}</span>}
              </>
            }
          />
        </motion.div>
      </div>

      {/* ── Athlètes à la une — portraits ronds ── */}
      {athletes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="max-w-[1800px] mx-auto mb-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-muted mb-4 px-4 sm:px-6">À la une</p>
          <div className="flex gap-5 sm:gap-7 overflow-x-auto pb-2 px-4 sm:px-6 no-scrollbar">
            {athletes.slice(0, 10).map((athlete) => (
              <button
                key={athlete.id}
                type="button"
                onClick={() => { setSelectedAthlete(athlete); setPage('athlete-profile'); }}
                className="group flex flex-col items-center gap-2.5 shrink-0 w-20 sm:w-24 text-center"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-border-main group-hover:border-brand-primary transition-colors">
                  <AthleteAvatar name={athlete.name} image={athlete.image} alt={athlete.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-bold leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">{athlete.name}</p>
                <p className="text-[8px] text-text-muted uppercase tracking-widest truncate w-full">{athlete.discipline}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Filters + Search ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="max-w-[1800px] mx-auto px-6 mb-12"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={13} className="text-text-muted shrink-0" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`filter-pill ${activeFilter === f ? 'filter-pill-active' : 'filter-pill-inactive'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input
              type="text"
              placeholder="Rechercher un athlète..."
              className="input-modern pl-11 pr-10 py-2.5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Active filter indicator */}
        <div className="mt-3 h-px bg-border-main relative">
          <motion.div
            className="absolute left-0 top-0 h-full bg-brand-primary"
            animate={{ width: filtered.length > 0 ? `${Math.min((filtered.length / Math.max(athletes.length, 1)) * 100, 100)}%` : '0%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* ── Athletes Grid ── */}
      <div className="max-w-[1800px] mx-auto px-6">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <p className="text-text-muted text-sm">Aucun athlète trouvé pour « {searchTerm} »</p>
              <button onClick={() => { setSearchTerm(''); setActiveFilter('Tous'); }} className="mt-4 text-brand-primary text-xs font-medium uppercase tracking-widest hover:underline">
                Réinitialiser
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-p${currentPage}`}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5"
            >
              {paginated.map((athlete, i) => (
                <motion.div
                  key={athlete.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                  className="group cursor-pointer"
                  onClick={() => { setSelectedAthlete(athlete); setPage('athlete-profile'); }}
                >
                  <div className="relative overflow-hidden aspect-[2/3] card card-hover">
                    {/* Photo */}
                    <AthleteAvatar
                      name={athlete.name}
                      image={athlete.image}
                      alt={athlete.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Country badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-bg-main/75 backdrop-blur-sm px-2.5 py-1 border border-border-main/30">
                      <span className="text-xs leading-none">{athlete.flag}</span>
                      <span className="text-[9px] font-medium uppercase tracking-widest text-text-muted hidden sm:block">{athlete.country}</span>
                    </div>

                    {/* Ghost rank */}
                    <span className="absolute -top-1 right-3 text-[5.5rem] font-display font-black text-white/[0.06] leading-none select-none pointer-events-none">
                      {String(athlete.rank).padStart(2, '0')}
                    </span>

                    {/* Gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                    {/* Bottom info */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-brand-primary text-[9px] font-medium uppercase tracking-[0.2em] mb-1">{athlete.discipline}</p>
                      <h3 className="text-sm md:text-base font-display font-bold text-white leading-tight mb-2.5">{athlete.name}</h3>

                      <div className="flex items-center justify-between mt-1 opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-white/70 text-[10px] font-medium">{athlete.performance}</span>
                        <span className="text-brand-primary text-[10px] font-bold bg-brand-primary/10 px-2 py-0.5">#{athlete.rank}</span>
                      </div>
                    </div>

                    {/* Left accent — appears on hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />

                    {/* Border overlay */}
                    <div className="absolute inset-0 border border-border-main/20 group-hover:border-brand-primary/30 transition-colors duration-300 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            {/* Info */}
            <p className="text-text-muted text-xs font-light order-2 sm:order-1">
              Athlètes{' '}
              <span className="text-text-main font-medium">
                {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)}
              </span>
              {' '}sur <span className="text-text-main font-medium">{filtered.length}</span>
            </p>

            {/* Controls */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
              {/* Prev */}
              <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border border-border-main text-text-muted hover:border-brand-primary hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={15} />
              </button>

              {/* First page + ellipsis */}
              {pageNumbers[0] > 1 && (
                <>
                  <button onClick={() => goTo(1)} className="w-9 h-9 flex items-center justify-center border border-border-main text-xs font-medium text-text-muted hover:border-brand-primary hover:text-brand-primary transition-all">1</button>
                  {pageNumbers[0] > 2 && <span className="w-9 h-9 flex items-center justify-center text-text-muted text-xs">…</span>}
                </>
              )}

              {/* Page numbers */}
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`w-9 h-9 flex items-center justify-center border text-xs font-medium transition-all ${
                    p === currentPage
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'border-border-main text-text-muted hover:border-brand-primary hover:text-brand-primary'
                  }`}
                >
                  {p}
                </button>
              ))}

              {/* Last page + ellipsis */}
              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="w-9 h-9 flex items-center justify-center text-text-muted text-xs">…</span>}
                  <button onClick={() => goTo(totalPages)} className="w-9 h-9 flex items-center justify-center border border-border-main text-xs font-medium text-text-muted hover:border-brand-primary hover:text-brand-primary transition-all">{totalPages}</button>
                </>
              )}

              {/* Next */}
              <button
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border border-border-main text-text-muted hover:border-brand-primary hover:text-brand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
