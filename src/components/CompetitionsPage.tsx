import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Globe } from 'lucide-react';
import { Page, Competition } from '../types';
import { getPublicDb } from '../lib/publicDb';

interface CompetitionsPageProps {
  setPage: (p: Page) => void;
  setSelectedCompetition: (c: Competition) => void;
}

export const CompetitionsPage = ({ setPage, setSelectedCompetition }: CompetitionsPageProps) => (
  <CompetitionsPageInner setPage={setPage} setSelectedCompetition={setSelectedCompetition} />
);

const CompetitionsPageInner = ({ setPage, setSelectedCompetition }: CompetitionsPageProps) => {
  const [items, setItems] = useState<Competition[]>([]);

  useEffect(() => {
    getPublicDb()
      .then((db) => setItems(db.competitions ?? []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12 sm:mb-16"
    >
      <h1 className="text-4xl sm:text-6xl font-display font-black italic uppercase tracking-tighter mb-4 sm:mb-6">Compétitions</h1>
      <p className="text-text-muted text-base sm:text-lg max-w-2xl">Calendrier complet des événements nationaux, championnats de Madagascar et meetings internationaux à Tana.</p>
    </motion.div>

    <div className="grid grid-cols-1 gap-8 sm:gap-12">
      {items.map((comp, i) => (
        <motion.div 
          key={comp.id}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{ x: 10 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col lg:flex-row glass-card overflow-hidden group border border-border-main hover:border-brand-primary/50 transition-all"
        >
          <div className="lg:w-1/3 h-48 sm:h-64 lg:h-auto overflow-hidden">
            <img src={comp.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <span className="badge-sport">
              {comp.category}
            </span>
            <span className="badge-muted">
              {comp.status}
            </span>
          </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-6 sm:mb-8 break-words">{comp.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-bg-surface flex items-center justify-center text-brand-primary border border-border-main">
                  <Calendar size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-text-muted text-[8px] sm:text-[10px] uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm sm:text-base font-bold">{comp.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-bg-surface flex items-center justify-center text-brand-primary border border-border-main">
                  <Globe size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-text-muted text-[8px] sm:text-[10px] uppercase tracking-widest mb-1">Lieu</p>
                  <p className="text-sm sm:text-base font-bold">{comp.location}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  setSelectedCompetition(comp);
                  setPage('billetterie');
                }}
                className="btn-primary px-8 py-3 text-sm"
              >
                Billetterie
              </button>
              <button 
                onClick={() => {
                  setSelectedCompetition(comp);
                  setPage('programme');
                }}
                className="btn-outline px-8 py-3 text-sm"
              >
                Programme
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
  );
};
