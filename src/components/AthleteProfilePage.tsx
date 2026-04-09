import { motion } from 'motion/react';
import { ArrowRight, Trophy, Medal } from 'lucide-react';
import { Page, Athlete } from '../types';

interface AthleteProfilePageProps {
  athlete: Athlete | null;
  setPage: (p: Page) => void;
}

export const AthleteProfilePage = ({ athlete, setPage }: AthleteProfilePageProps) => {
  if (!athlete) return null;

  return (
    <div className="pt-40 md:pt-48 pb-20 min-h-screen">
      {/* Hero Profile */}
      <div className="relative h-auto lg:h-[80vh] overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={athlete.image} 
            alt={athlete.name} 
            className="w-full h-full object-cover opacity-30 blur-2xl scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-start lg:justify-start gap-12 lg:gap-24 py-12 lg:py-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-64 h-64 lg:w-[450px] lg:h-[450px] shrink-0 border-8 border-border-main shadow-2xl overflow-hidden -rotate-3"
          >
            <img 
              src={athlete.image} 
              alt={athlete.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button 
                onClick={() => setPage('athletes')}
                className="inline-flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-xs mb-8 hover:gap-4 transition-all"
              >
                <ArrowRight size={16} className="rotate-180" /> Retour aux athlètes
              </button>

              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <span className="badge-sport px-4 py-2">{athlete.discipline}</span>
                <span className="text-4xl">{athlete.flag}</span>
                <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">{athlete.country}</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
                {athlete.name.split(' ').map((part, i) => (
                  <span key={i} className={i === 1 ? 'text-brand-primary block' : 'block'}>{part}</span>
                ))}
              </h1>

              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-text-muted text-[10px] uppercase tracking-widest mb-1">Rang Mondial</p>
                  <p className="text-3xl font-display font-black italic text-brand-primary">#{athlete.rank}</p>
                </div>
                <div className="w-px h-12 bg-border-main self-center" />
                <div>
                  <p className="text-text-muted text-[10px] uppercase tracking-widest mb-1">Record Personnel</p>
                  <p className="text-3xl font-display font-black italic">{athlete.performance}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats & Info Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Bio & Achievements */}
        <div className="lg:col-span-2 space-y-12">
          <section className="glass-card p-10">
            <h2 className="text-3xl font-display font-black italic uppercase tracking-tight mb-8 flex items-center gap-4">
              <Trophy className="text-brand-primary" /> Biographie
            </h2>
            <div className="prose prose-invert max-w-none text-text-muted leading-relaxed text-lg">
              <p>
                {athlete.name} est l'un des fers de lance de l'athlétisme malgache. Spécialiste du {athlete.discipline}, 
                {athlete.name.includes('Sidonie') || athlete.name.includes('Claudine') || athlete.name.includes('Lorrie') || athlete.name.includes('Eliane') || athlete.name.includes('Vanessa') || athlete.name.includes('Rosa') || athlete.name.includes('Doris') ? 'elle' : 'il'} a su s'imposer comme une référence sur le continent africain 
                grâce à une détermination sans faille et un talent exceptionnel.
              </p>
              <p className="mt-4">
                Portant fièrement les couleurs de Madagascar, {athlete.name.includes('Sidonie') || athlete.name.includes('Claudine') || athlete.name.includes('Lorrie') || athlete.name.includes('Eliane') || athlete.name.includes('Vanessa') || athlete.name.includes('Rosa') || athlete.name.includes('Doris') ? 'elle' : 'il'} s'entraîne avec une rigueur exemplaire pour les prochaines 
                échéances internationales, avec pour objectif de porter haut le drapeau de la Grande Île sur les podiums mondiaux.
              </p>
            </div>
          </section>

          <section className="glass-card p-10">
            <h2 className="text-3xl font-display font-black italic uppercase tracking-tight mb-8 flex items-center gap-4">
              <Medal className="text-brand-primary" /> Palmarès Récent
            </h2>
            <div className="space-y-4">
              {[
                { year: '2025', event: 'Championnats de Madagascar', result: 'Médaille d\'Or', pos: '1er' },
                { year: '2024', event: 'Meeting International de Tana', result: 'Record National', pos: '1er' },
                { year: '2024', event: 'Jeux Africains', result: 'Finale', pos: '5ème' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-bg-surface/50 border border-border-main hover:border-brand-primary/30 transition-colors">
                  <div className="flex items-center gap-6">
                    <span className="text-brand-primary font-display font-black italic text-xl">{item.year}</span>
                    <div>
                      <p className="font-bold text-text-main">{item.event}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">{item.result}</p>
                    </div>
                  </div>
                  <span className="font-display font-black italic text-2xl text-text-muted">{item.pos}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Physical Stats & Social */}
        <div className="space-y-12">
          <section className="glass-card p-10 border-t-4 border-brand-primary">
            <h3 className="text-xl font-display font-black italic uppercase tracking-tight mb-8">Fiche Technique</h3>
            <div className="space-y-6">
              {[
                { label: "Âge", value: "24 ans" },
                { label: "Taille", value: "1.72 m" },
                { label: "Club", value: "Alarobia Athletics" },
                { label: "Entraîneur", value: "Jean-Louis R." },
                { label: "Sponsors", value: "Telma, FMA" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-border-main/50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{stat.label}</span>
                  <span className="font-bold text-text-main">{stat.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-10">
            <h3 className="text-xl font-display font-black italic uppercase tracking-tight mb-8">Suivre l'athlète</h3>
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-bg-surface border border-border-main hover:border-brand-primary transition-colors text-xs font-bold uppercase tracking-widest">Instagram</button>
              <button className="flex-1 py-4 bg-bg-surface border border-border-main hover:border-brand-primary transition-colors text-xs font-bold uppercase tracking-widest">Facebook</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
