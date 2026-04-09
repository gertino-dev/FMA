import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight } from 'lucide-react';
import { Page, Athlete } from '../types';
import { getPublicDb } from '../lib/publicDb';
import { AthleteAvatar } from './AthleteAvatar';

interface AthletesPageProps {
  setSelectedAthlete: (a: Athlete) => void;
  setPage: (p: Page) => void;
  initialFilter?: string;
}

export const AthletesPage = ({ setSelectedAthlete, setPage, initialFilter = 'Tous' }: AthletesPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    getPublicDb()
      .then((db) => setAthletes((db.athletes as Athlete[]) ?? []))
      .catch(() => setAthletes([]));
  }, []);

  const filters = ['Tous', 'Sprints', 'Sauts', 'Lancers', 'Demi-fond', 'Combinés'];

  const filteredAthletes = athletes.filter(a => 
    (a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     a.discipline.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeFilter === 'Tous' || 
     a.discipline.toLowerCase().includes(activeFilter.toLowerCase().replace('s', '')) ||
     (activeFilter === 'Sprints' && (a.discipline.includes('100m') || a.discipline.includes('200m') || a.discipline.includes('400m'))))
  );

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-[1800px] mx-auto px-6 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 sm:mb-16"
      >
        <h1 className="text-4xl sm:text-6xl font-display font-black italic uppercase tracking-tighter mb-4 sm:mb-6">Athlètes</h1>
        <p className="text-text-muted text-base sm:text-lg max-w-2xl">Découvrez les profils des meilleurs athlètes malagasy, leurs performances et leurs statistiques détaillées.</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-12 sm:mb-16 items-stretch lg:items-center justify-between"
      >
        <div className="relative lg:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted z-10" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-bg-surface border-2 border-border-main py-3 pl-14 pr-6 focus:outline-none focus:border-brand-primary transition-colors text-text-main -skew-x-12 shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Dropdown (All screens) */}
        <div className="relative lg:w-72">
          <button 
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="w-full flex items-center justify-between px-6 py-4 bg-bg-surface border-2 border-border-main text-xs font-black uppercase tracking-widest -skew-x-12 hover:border-brand-primary transition-colors"
          >
            <span className="skew-x-12">Discipline: {activeFilter}</span>
            <ChevronRight className={`skew-x-12 transition-transform duration-300 ${isFilterMenuOpen ? 'rotate-90' : ''}`} size={16} />
          </button>
          <AnimatePresence>
            {isFilterMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 z-50 mt-2 bg-bg-surface border-2 border-border-main shadow-2xl p-2"
              >
                {filters.map((f) => (
                  <button 
                    key={f}
                    onClick={() => {
                      setActiveFilter(f);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors ${activeFilter === f ? 'text-brand-primary' : 'text-text-muted'}`}
                  >
                    {f}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {filteredAthletes.map((athlete, i) => (
          <motion.div 
            key={athlete.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden group cursor-pointer hover:border-brand-primary/50 transition-all"
            onClick={() => {
              setSelectedAthlete(athlete);
              setPage('athlete-profile');
            }}
          >
            <div className="aspect-[4/5] overflow-hidden relative">
              <AthleteAvatar
                name={athlete.name}
                alt={athlete.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest border border-border-main text-white">
                {athlete.flag} {athlete.country}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/40 to-transparent">
                <p className="text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-1">{athlete.discipline}</p>
                <h3 className="text-xl font-display font-bold leading-tight text-white">{athlete.name}</h3>
              </div>
            </div>
            <div className="p-6 flex justify-between items-center bg-bg-surface/50">
              <div>
                <p className="text-text-muted text-[10px] uppercase tracking-widest mb-1">Record</p>
                <p className="text-sm font-bold">{athlete.performance}</p>
              </div>
              <div className="text-right">
                <p className="text-text-muted text-[10px] uppercase tracking-widest mb-1">Rang</p>
                <p className="text-sm font-bold text-brand-primary">#{athlete.rank}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
