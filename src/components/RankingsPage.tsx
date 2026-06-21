import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { Page, Athlete } from '../types';
import { RANKINGS } from '../constants';
import { getPublicDb } from '../lib/publicDb';
import { AthleteAvatar } from './AthleteAvatar';
import { PageHeader } from './ui/SectionHeader';

interface RankingsPageProps {
  setSelectedAthlete: (a: Athlete) => void;
  setPage: (p: Page, opts?: { athleteId?: number }) => void;
}

export const RankingsPage = ({ setSelectedAthlete, setPage }: RankingsPageProps) => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [rankingsRows, setRankingsRows] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    const rows = RANKINGS.tables?.flatMap((t) => t.rows ?? []) ?? [];
    setRankingsRows(rows);
  }, []);

  useEffect(() => {
    getPublicDb()
      .then((db) => setAthletes((db.athletes as Athlete[]) ?? []))
      .catch(() => setAthletes([]));
  }, []);

  const groupedMap = rankingsRows.reduce<Record<string, any[]>>((acc, row) => {
    const key = `${row.category ?? 'Catégorie'} ${row.discipline}`.trim();
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  const grouped = Object.entries(groupedMap)
    .map(([label, rows]) => ({
      label,
      rows: rows.slice().sort((a, b) => b.points - a.points),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));

  const qCategory = categoryFilter.trim().toLowerCase();
  const filteredGroups = qCategory
    ? grouped
        .filter((g) => g.label.toLowerCase().includes(qCategory))
        .map((g) => ({ ...g, rows: g.rows.slice(0, 3) }))
    : grouped;
  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <PageHeader
          eyebrow="Performances"
          title="Classements Elite"
          description="Classements par catégorie et épreuve — Senior Hommes, Senior Dames, U18, U20…"
        />
        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Filtrer une catégorie…"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-modern"
            />
          </div>
          {qCategory && (
            <p className="text-xs text-brand-primary font-semibold uppercase tracking-widest mt-3">
              Filtre actif · top 3 par catégorie
            </p>
          )}
        </div>
      </motion.div>

      {/* Rankings List */}
      <div className="space-y-10">
        {filteredGroups.map((group) => (
          <div key={group.label} className="space-y-4">
            <h3 className="text-lg font-display font-bold uppercase tracking-tight flex items-center gap-3">
              <span className="w-1 h-6 bg-brand-primary shrink-0" />
              {group.label}
            </h3>
            {/* Desktop table header */}
            <div className="hidden md:grid grid-cols-12 px-6 lg:px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              <div className="col-span-1">Rang</div>
              <div className="col-span-5">Athlète</div>
              <div className="col-span-2 text-center">Épreuve</div>
              <div className="col-span-2 text-center">Points</div>
              <div className="col-span-2 text-right">Tendance</div>
            </div>

            {group.rows.map((row, i) => {
              const openProfile = () => {
                const athlete = athletes.find((a) => a.name === row.athlete);
                if (athlete) {
                  setSelectedAthlete(athlete);
                  setPage('athlete-profile', { athleteId: athlete.id });
                }
              };

              const trendEl =
                row.trend === 'up' ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <TrendingUp size={14} aria-hidden />
                    <span className="text-[10px] font-black">+12</span>
                  </div>
                ) : row.trend === 'down' ? (
                  <div className="flex items-center gap-1 text-brand-primary">
                    <TrendingDown size={14} aria-hidden />
                    <span className="text-[10px] font-black">-4</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-text-muted">
                    <Minus size={14} aria-hidden />
                    <span className="text-[10px] font-black">0</span>
                  </div>
                );

              return (
                <motion.button
                  key={`${group.label}-${row.id}-${i}`}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  onClick={openProfile}
                  className="group w-full text-left cursor-pointer card card-hover active:scale-[0.99]"
                >
                  {/* Mobile card */}
                  <div className="md:hidden p-4 flex items-center gap-4">
                    <div className="shrink-0 w-10 text-center">
                      <span className={`text-2xl font-display font-black italic ${i === 0 ? 'text-brand-primary' : 'text-text-muted'}`}>
                        #{i + 1}
                      </span>
                    </div>
                    <div className="w-14 h-14 shrink-0 overflow-hidden border border-border-main">
                      <AthleteAvatar name={row.athlete} alt={row.athlete} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold uppercase tracking-tight text-sm text-text-main group-hover:text-brand-primary transition-colors truncate">
                        {row.athlete}
                      </h4>
                      <p className="text-[9px] text-text-muted uppercase tracking-widest mt-0.5">{row.discipline}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-base font-mono font-black text-text-main">{row.points} pts</span>
                        {trendEl}
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-text-muted shrink-0 group-hover:text-brand-primary transition-colors" />
                  </div>

                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-12 items-center px-6 lg:px-8 py-4 bg-bg-main/50 group-hover:bg-bg-surface transition-colors">
                    <div className="col-span-1">
                      <span className="text-2xl font-display font-black italic text-text-muted group-hover:text-brand-primary transition-colors">#{i + 1}</span>
                    </div>
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-bg-surface overflow-hidden border border-border-main shrink-0">
                        <AthleteAvatar name={row.athlete} alt={row.athlete} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black uppercase tracking-tight text-text-main group-hover:text-brand-primary transition-colors truncate">{row.athlete}</h4>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">{row.country}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-block px-3 py-1 bg-bg-surface border border-border-main text-[9px] font-bold uppercase tracking-widest">
                        {row.discipline}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-lg font-mono font-black text-text-main">{row.points}</span>
                    </div>
                    <div className="col-span-2 flex justify-end items-center gap-3">
                      {trendEl}
                      <ChevronRight size={16} className="text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-20 p-12 bg-brand-primary relative overflow-hidden group cursor-pointer"
        onClick={() => setPage('direct')}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black italic uppercase tracking-tighter text-white mb-4">Prêt pour la prochaine compétition ?</h2>
            <p className="text-white/80 text-lg">Suivez les épreuves en direct et voyez le classement évoluer en temps réel.</p>
          </div>
          <button className="bg-white text-brand-primary px-10 py-4 font-black uppercase tracking-widest hover:bg-bg-main transition-colors -skew-x-12">
            <span className="skew-x-12 inline-block">Voir le Direct</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
