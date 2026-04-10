import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { Page, Athlete } from '../types';
import { apiFetch } from '../lib/api';
import { getPublicDb } from '../lib/publicDb';
import { AthleteAvatar } from './AthleteAvatar';

/* ✅ Type complet d'une ligne de classement */
interface RankingRow {
  id: string | number;
  athlete: string;
  country: string;
  discipline: string;
  points: number;
  trend?: 'up' | 'down' | 'same' | null;
  category?: string;
}

interface RankingsPageProps {
  setSelectedAthlete: (a: Athlete) => void;
  setPage: (p: Page) => void;
}

export const RankingsPage = ({ setSelectedAthlete, setPage }: RankingsPageProps) => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [rankingsRows, setRankingsRows] = useState<RankingRow[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  /* ✅ Récupération du ranking */
  useEffect(() => {
    apiFetch<{ tables?: Array<{ rows?: RankingRow[] }> }>('/api/public/rankings')
      .then((r) => {
        const rows = r?.tables?.flatMap((t) => t.rows ?? []) ?? [];
        setRankingsRows(rows);
      })
      .catch(() => setRankingsRows([]));
  }, []);

  /* ✅ Récupération des athlètes */
  useEffect(() => {
    getPublicDb()
      .then((db) => setAthletes((db.athletes as Athlete[]) ?? []))
      .catch(() => setAthletes([]));
  }, []);

  /* ✅ Groupement */
  const groupedMap = rankingsRows.reduce<Record<string, RankingRow[]>>((acc, row) => {
    const key = `${row.category ?? 'Catégorie'} ${row.discipline}`.trim();
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  /* ✅ Tri des groupes (fix définitif ici) */
  const grouped = Object.entries(groupedMap)
    .map(([label, rows]) => {
      const r = rows as RankingRow[]; // ✅ Fix : TypeScript sait maintenant que c’est un tableau
      return {
        label,
        rows: r.slice().sort((a, b) => b.points - a.points),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));

  /* ✅ Filtre */
  const qCategory = categoryFilter.trim().toLowerCase();
  const filteredGroups = qCategory
    ? grouped
        .filter((g) => g.label.toLowerCase().includes(qCategory))
        .map((g) => ({ ...g, rows: g.rows.slice(0, 3) }))
    : grouped;

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 flex flex-col lg:row justify-between items-start lg:items-end gap-8"
      >
        <div className="relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            className="h-1 bg-brand-primary mb-4"
          />
          <h1 className="text-5xl sm:text-7xl font-display font-black italic uppercase tracking-tighter mb-4 leading-none">
            Classements <span className="text-brand-primary">Elite</span>
          </h1>
          <p className="text-text-muted text-lg max-w-xl">
            Classements par catégorie + épreuve (ex: Senior Hommes 400m Plat, Senior Dames 100m).
          </p>
          {qCategory && (
            <p className="text-xs text-brand-primary font-black uppercase tracking-widest mt-3">
              Filtre actif: top 3 par catégorie
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Filtrer une catégorie (ex: senior hommes 400m)"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-bg-surface border border-border-main py-3 pl-12 pr-4 text-sm 
                focus:outline-none focus:border-brand-primary text-text-main rounded-none -skew-x-12"
            />
          </div>
        </div>
      </motion.div>

      {/* Rankings List */}
      <div className="space-y-10">
        {filteredGroups.map((group) => (
          <div key={group.label} className="space-y-4">
            <h3 className="text-xl font-display font-black italic uppercase tracking-tight border-l-4 border-brand-primary pl-4">
              {group.label}
            </h3>

            <div className="grid grid-cols-12 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              <div className="col-span-1">Rang</div>
              <div className="col-span-5">Athlète</div>
              <div className="col-span-2 text-center">Épreuve</div>
              <div className="col-span-2 text-center">Points</div>
              <div className="col-span-2 text-right">Tendance</div>
            </div>

            {group.rows.map((row, i) => (
              <motion.div
                key={`${group.label}-${row.id}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  const athlete = athletes.find(a => a.name === row.athlete);
                  if (athlete) {
                    setSelectedAthlete(athlete);
                    setPage('athlete-profile');
                  }
                }}
                className="group cursor-pointer bg-bg-surface border border-border-main hover:border-brand-primary transition-all p-1"
              >
                <div className="grid grid-cols-12 items-center px-8 py-4 bg-bg-main/50 group-hover:bg-bg-surface transition-colors">
                  <div className="col-span-1">
                    <span className="text-2xl font-display font-black italic text-text-muted group-hover:text-brand-primary transition-colors">
                      #{i + 1}
                    </span>
                  </div>

                  <div className="col-span-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-bg-surface overflow-hidden border border-border-main">
                      <AthleteAvatar name={row.athlete} alt={row.athlete} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight text-text-main group-hover:text-brand-primary transition-colors">
                        {row.athlete}
                      </h4>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">
                        {row.country}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="inline-block px-3 py-1 bg-bg-surface border border-border-main text-[9px] font-bold uppercase tracking-widest -skew-x-12">
                      <span className="skew-x-12 inline-block">{row.discipline}</span>
                    </span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="text-lg font-mono font-black text-text-main">{row.points}</span>
                  </div>

                  <div className="col-span-2 flex justify-end items-center gap-3">
                    <div className="flex flex-col items-end">
                      {row.trend === 'up' ? (
                        <div className="flex items-center gap-1 text-green-500">
                          <TrendingUp size={14} />
                          <span className="text-[10px] font-black">+12</span>
                        </div>
                      ) : row.trend === 'down' ? (
                        <div className="flex items-center gap-1 text-brand-primary">
                          <TrendingDown size={14} />
                          <span className="text-[10px] font-black">-4</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-text-muted">
                          <Minus size={14} />
                          <span className="text-[10px] font-black">0</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
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
            <h2 className="text-3xl md:text-5xl font-display font-black italic uppercase tracking-tighter text-white mb-4">
              Prêt pour la prochaine compétition ?
            </h2>
            <p className="text-white/80 text-lg">
              Suivez les épreuves en direct et voyez le classement évoluer en temps réel.
            </p>
          </div>
          <button className="bg-white text-brand-primary px-10 py-4 font-black uppercase tracking-widest hover:bg-bg-main transition-colors -skew-x-12">
            <span className="skew-x-12 inline-block">Voir le Direct</span>
          </button>
        </div>
      </motion.div>

    </div>
  );
};