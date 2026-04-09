import { motion } from 'motion/react';
import { Search, Calendar, Globe, ChevronRight } from 'lucide-react';
import { RESULTS_COMPETITIONS } from '../constants';

import { Page, Competition } from '../types';

interface ResultsPageProps {
  setPage: (p: Page) => void;
  setSelectedCompetition: (c: Competition) => void;
}

export const ResultsPage = ({ setPage, setSelectedCompetition }: ResultsPageProps) => (
  <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16"
    >
      <h1 className="text-6xl font-display font-black italic uppercase tracking-tighter mb-6">Résultats</h1>
      <p className="text-text-muted text-lg max-w-2xl border-l-4 border-brand-primary pl-6">Consultez les résultats officiels de toutes les compétitions passées.</p>
    </motion.div>

    <div className="flex flex-col lg:flex-row gap-8 mb-16 items-stretch lg:items-center justify-between">
      <div className="relative lg:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted z-10" size={16} />
        <input type="text" placeholder="Rechercher un résultat..." className="w-full bg-bg-surface border-2 border-border-main py-3 pl-12 pr-6 focus:outline-none focus:border-brand-primary transition-colors text-text-main -skew-x-12 shadow-sm text-sm" />
      </div>
      <div className="flex gap-4">
        {['2026', '2025', '2024'].map(year => (
          <button key={year} className="px-6 py-3 bg-bg-surface border-2 border-border-main text-xs font-black uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all text-text-main -skew-x-12">
            <span className="skew-x-12 inline-block">{year}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {RESULTS_COMPETITIONS.map((comp, i) => (
        <motion.div 
          key={comp.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-brand-primary/30 transition-colors cursor-pointer group"
          onClick={() => {
            setSelectedCompetition(comp);
            setPage('resultats-detail');
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full md:w-auto">
            <div className="w-20 h-20 bg-bg-surface overflow-hidden flex-shrink-0 border border-border-main">
              <img src={comp.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest mb-1">{comp.date}</p>
              <h3 className="text-xl font-display font-bold uppercase italic tracking-tight break-words hyphens-auto whitespace-pre-line">{comp.title}</h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
                <span className="text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-1"><Globe size={10} /> {comp.location}</span>
                <span className="text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-1"><Calendar size={10} /> {comp.category}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCompetition(comp);
              setPage('resultats-detail');
            }}
            className="w-full md:w-auto btn-outline py-3 px-8 text-xs flex items-center justify-center gap-2 group-hover:bg-brand-primary group-hover:text-white group-hover:border-transparent transition-all"
          >
            Consulter les résultats <ChevronRight size={16} />
          </button>
        </motion.div>
      ))}
    </div>
  </div>
);
