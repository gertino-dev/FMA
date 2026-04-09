import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, TrendingUp, TrendingDown, Minus, ChevronRight, Trophy, Medal, Star } from 'lucide-react';
import { Page, Athlete } from '../types';
import { ATHLETES, RANKINGS } from '../constants';

interface RankingsPageProps {
  setSelectedAthlete: (a: Athlete) => void;
  setPage: (p: Page) => void;
}

export const RankingsPage = ({ setSelectedAthlete, setPage }: RankingsPageProps) => {
  const [activeTab, setActiveTab] = useState<'hommes' | 'femmes'>('hommes');
  const [searchQuery, setSearchQuery] = useState('');

  const topThree = RANKINGS.slice(0, 3);
  const others = RANKINGS.slice(3);

  const getAthleteData = (name: string) => ATHLETES.find(a => a.name === name);

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
            Découvrez les performances exceptionnelles des athlètes malagasy. Le classement officiel mis à jour en temps réel.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un athlète..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-surface border border-border-main py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary text-text-main rounded-none -skew-x-12"
            />
          </div>
          <div className="flex bg-bg-surface p-1 border border-border-main -skew-x-12">
            <button 
              onClick={() => setActiveTab('hommes')}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all skew-x-12 ${activeTab === 'hommes' ? 'bg-brand-primary text-white' : 'text-text-muted hover:text-text-main'}`}
            >
              Hommes
            </button>
            <button 
              onClick={() => setActiveTab('femmes')}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all skew-x-12 ${activeTab === 'femmes' ? 'bg-brand-primary text-white' : 'text-text-muted hover:text-text-main'}`}
            >
              Femmes
            </button>
          </div>
        </div>
      </motion.div>

      {/* Podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
        {/* 2nd Place */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="order-2 md:order-1"
        >
          <div 
            onClick={() => {
              const a = getAthleteData(topThree[1].athlete);
              if (a) { setSelectedAthlete(a); setPage('athlete-profile'); }
            }}
            className="group cursor-pointer relative bg-bg-surface border-t-4 border-slate-400 p-8 pt-16 text-center hover:bg-bg-surface/80 transition-all"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-slate-400 overflow-hidden bg-bg-main">
              <img src="/image/image%20(2).png" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute top-4 right-4 text-slate-400 opacity-20"><Medal size={48} /></div>
            <span className="text-4xl font-display font-black italic text-slate-400 mb-2 block">#2</span>
            <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-brand-primary transition-colors">{topThree[1].athlete}</h3>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-4">{topThree[1].discipline}</p>
            <div className="text-2xl font-mono font-black text-text-main">{topThree[1].points} pts</div>
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="order-1 md:order-2"
        >
          <div 
            onClick={() => {
              const a = getAthleteData(topThree[0].athlete);
              if (a) { setSelectedAthlete(a); setPage('athlete-profile'); }
            }}
            className="group cursor-pointer relative bg-bg-surface border-t-8 border-brand-primary p-10 pt-20 text-center shadow-2xl shadow-brand-primary/10 hover:bg-bg-surface/80 transition-all scale-105 z-10"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-brand-primary overflow-hidden bg-bg-main shadow-xl">
              <img src="/image/image%20(1).png" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute top-6 right-6 text-brand-primary animate-pulse"><Trophy size={56} /></div>
            <span className="text-6xl font-display font-black italic text-brand-primary mb-2 block">#1</span>
            <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-brand-primary transition-colors">{topThree[0].athlete}</h3>
            <p className="text-sm text-text-muted uppercase tracking-widest mb-6">{topThree[0].discipline}</p>
            <div className="inline-block bg-brand-primary/10 px-6 py-2 rounded-full">
              <div className="text-3xl font-mono font-black text-brand-primary">{topThree[0].points} pts</div>
            </div>
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="order-3"
        >
          <div 
            onClick={() => {
              const a = getAthleteData(topThree[2].athlete);
              if (a) { setSelectedAthlete(a); setPage('athlete-profile'); }
            }}
            className="group cursor-pointer relative bg-bg-surface border-t-4 border-amber-700 p-8 pt-16 text-center hover:bg-bg-surface/80 transition-all"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-amber-700 overflow-hidden bg-bg-main">
              <img src="/image/image%20(3).png" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute top-4 right-4 text-amber-700 opacity-20"><Medal size={48} /></div>
            <span className="text-4xl font-display font-black italic text-amber-700 mb-2 block">#3</span>
            <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-brand-primary transition-colors">{topThree[2].athlete}</h3>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-4">{topThree[2].discipline}</p>
            <div className="text-2xl font-mono font-black text-text-main">{topThree[2].points} pts</div>
          </div>
        </motion.div>
      </div>

      {/* Rankings List */}
      <div className="space-y-4">
        <div className="grid grid-cols-12 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
          <div className="col-span-1">Rang</div>
          <div className="col-span-5">Athlète</div>
          <div className="col-span-2 text-center">Discipline</div>
          <div className="col-span-2 text-center">Points</div>
          <div className="col-span-2 text-right">Tendance</div>
        </div>

        {[...others, ...others].map((row, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => {
              const athlete = ATHLETES.find(a => a.name === row.athlete);
              if (athlete) { setSelectedAthlete(athlete); setPage('athlete-profile'); }
            }}
            className="group cursor-pointer bg-bg-surface border border-border-main hover:border-brand-primary transition-all p-1"
          >
            <div className="grid grid-cols-12 items-center px-8 py-4 bg-bg-main/50 group-hover:bg-bg-surface transition-colors">
              <div className="col-span-1">
                <span className="text-2xl font-display font-black italic text-text-muted group-hover:text-brand-primary transition-colors">#{i + 4}</span>
              </div>
              <div className="col-span-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-surface overflow-hidden border border-border-main">
                  <img src={`/image/image%20(${(i % 15) + 1}).png`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-text-main group-hover:text-brand-primary transition-colors">{row.athlete}</h4>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest">{row.country}</p>
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
                <ChevronRight size={16} className="text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.div>
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
