import { motion } from 'motion/react';
import { ChevronLeft, Trophy, Medal, Timer, Users } from 'lucide-react';
import { Page, Competition } from '../types';

interface ResultsDetailPageProps {
  competition: Competition | null;
  setPage: (p: Page) => void;
}

export const ResultsDetailPage = ({ competition, setPage }: ResultsDetailPageProps) => {
  if (!competition) return null;

  const results = [
    {
      event: "100m Hommes",
      podium: [
        { rank: 1, name: "Franck Todisoa", performance: "10.42s", club: "COSFA" },
        { rank: 2, name: "Jean-Louis Ravelo", performance: "10.58s", club: "Tana Athletics" },
        { rank: 3, name: "Tsiry Manampisoa", performance: "10.65s", club: "ASUT" }
      ]
    },
    {
      event: "100m Femmes",
      podium: [
        { rank: 1, name: "Claudine Nomenjanahary", performance: "11.42s", club: "COSFA" },
        { rank: 2, name: "Sidonie Fiadanantsoa", performance: "11.58s", club: "Tana Athletics" },
        { rank: 3, name: "Lorrie Haoniriana", performance: "11.75s", club: "ASUT" }
      ]
    },
    {
      event: "400m Hommes",
      podium: [
        { rank: 1, name: "Tsiry Manampisoa", performance: "46.90s", club: "ASUT" },
        { rank: 2, name: "Patrice Rakoto", performance: "47.25s", club: "COSFA" },
        { rank: 3, name: "Andry Lalaina", performance: "47.80s", club: "Tana Athletics" }
      ]
    },
    {
      event: "Saut en Longueur Femmes",
      podium: [
        { rank: 1, name: "Vanessa Embony", performance: "6.15m", club: "COSFA" },
        { rank: 2, name: "Miora Raharimalala", performance: "5.98m", club: "ASUT" },
        { rank: 3, name: "Lalao Razafy", performance: "5.85m", club: "Tana Athletics" }
      ]
    }
  ];

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setPage('resultats')}
        className="flex items-center gap-2 text-brand-primary font-black uppercase tracking-widest text-xs mb-12 hover:gap-4 transition-all"
      >
        <ChevronLeft size={16} /> Retour aux résultats
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 -skew-x-12">
              Résultats Officiels
            </span>
            <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              ID: #FMA-2025-{competition.id}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black italic uppercase tracking-tighter mb-8 leading-none">
            {competition.title}
          </h1>
          <div className="flex flex-wrap gap-8 p-8 bg-bg-surface border-l-8 border-brand-primary shadow-2xl -skew-x-2">
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Lieu</p>
              <p className="text-xl font-display font-bold italic">{competition.location}</p>
            </div>
            <div className="w-px h-12 bg-border-main hidden sm:block" />
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Date</p>
              <p className="text-xl font-display font-bold italic">{competition.date}</p>
            </div>
            <div className="w-px h-12 bg-border-main hidden sm:block" />
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Catégorie</p>
              <p className="text-xl font-display font-bold italic">{competition.category}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square lg:aspect-auto border-4 border-border-main shadow-2xl overflow-hidden"
        >
          <img 
            src={competition.image} 
            alt={competition.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>
      </div>

      <div className="space-y-20">
        {results.map((category, idx) => (
          <motion.section 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-3xl font-display font-black italic uppercase tracking-tight">{category.event}</h2>
              <div className="h-px flex-1 bg-border-main" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {category.podium.map((athlete, i) => (
                <div 
                  key={i} 
                  className={`relative p-8 border-2 transition-all ${
                    i === 0 
                    ? 'bg-brand-primary border-brand-primary text-white shadow-[20px_20px_0px_0px_rgba(225,29,72,0.1)]' 
                    : 'bg-bg-surface border-border-main hover:border-brand-primary'
                  }`}
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 flex items-center justify-center text-2xl font-display font-black italic border-4 border-inherit bg-inherit">
                    {i + 1}
                  </div>
                  
                  <div className="mb-6">
                    {i === 0 ? <Trophy size={32} className="mb-4" /> : <Medal size={32} className={`mb-4 ${i === 1 ? 'text-gray-400' : 'text-amber-700'}`} />}
                    <h3 className="text-2xl font-display font-black italic uppercase tracking-tight leading-none mb-2">
                      {athlete.name}
                    </h3>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-white/70' : 'text-text-muted'}`}>
                      {athlete.club}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-current/10">
                    <div className="flex items-center gap-2">
                      <Timer size={16} className={i === 0 ? 'text-white/60' : 'text-brand-primary'} />
                      <span className="text-xl font-display font-bold italic">{athlete.performance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className={i === 0 ? 'text-white/60' : 'text-brand-primary'} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Finaliste</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <div className="mt-20 p-12 bg-bg-surface border border-border-main text-center">
        <h3 className="text-2xl font-display font-black italic uppercase tracking-tight mb-4">Télécharger les résultats complets</h3>
        <p className="text-text-muted mb-8 max-w-xl mx-auto">Accédez à l'intégralité des résultats de toutes les séries, qualifications et finales au format PDF certifié par la FMA.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn-primary px-12">Format PDF (.pdf)</button>
          <button className="btn-outline px-12">Format Excel (.xlsx)</button>
        </div>
      </div>
    </div>
  );
};
