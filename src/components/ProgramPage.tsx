import { motion } from 'motion/react';
import { Calendar, Globe, ArrowRight, Timer, Medal, Trophy } from 'lucide-react';
import { Page, Competition } from '../types';

interface ProgramPageProps {
  competition: Competition | null;
  setPage: (p: Page) => void;
}

export const ProgramPage = ({ competition, setPage }: ProgramPageProps) => {
  if (!competition) return null;

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setPage('competitions')}
        className="inline-flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-xs mb-12 hover:gap-4 transition-all"
      >
        <ArrowRight size={16} className="rotate-180" /> Retour au calendrier
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="aspect-[4/3] overflow-hidden border-8 border-border-main shadow-2xl">
            <img 
              src={competition.image} 
              alt={competition.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 glass-card p-8 shadow-2xl border-l-8 border-brand-primary">
            <div className="flex items-center gap-4 mb-4">
              <Timer className="text-brand-primary" size={24} />
              <p className="text-2xl font-display font-black italic uppercase tracking-tight">Programme Officiel</p>
            </div>
            <p className="text-text-muted text-xs uppercase tracking-widest leading-relaxed">Horaires sujets à modification.</p>
          </div>
        </motion.div>

        <div>
          <span className="badge-sport mb-6">{competition.category}</span>
          <h1 className="text-4xl md:text-6xl font-display font-black italic uppercase tracking-tighter leading-[0.9] mb-8">
            {competition.title}
          </h1>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="flex items-center gap-4">
              <Calendar className="text-brand-primary" size={24} />
              <div>
                <p className="text-text-muted text-[10px] uppercase tracking-widest">Date</p>
                <p className="font-bold">{competition.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Globe className="text-brand-primary" size={24} />
              <div>
                <p className="text-text-muted text-[10px] uppercase tracking-widest">Lieu</p>
                <p className="font-bold">{competition.location}</p>
              </div>
            </div>
          </div>

          <p className="text-text-muted text-lg leading-relaxed mb-12 border-l-4 border-border-main pl-6 italic">
            "Découvrez le déroulement détaillé de la compétition. Des séries aux finales, ne manquez aucun moment fort."
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {[
          { session: 'Matinée', time: '08:00 - 12:00', events: [
            { time: '08:30', title: '100m Haies Femmes - Séries', icon: Timer },
            { time: '09:15', title: 'Saut en Hauteur Hommes - Qualifications', icon: Medal },
            { time: '10:30', title: '400m Hommes - Séries', icon: Timer },
            { time: '11:45', title: 'Lancer du Javelot Femmes - Finale', icon: Trophy },
          ]},
          { session: 'Après-midi', time: '14:00 - 18:00', events: [
            { time: '14:30', title: '100m Femmes - Finale', icon: Trophy },
            { time: '15:15', title: 'Saut en Longueur Hommes - Finale', icon: Trophy },
            { time: '16:00', title: '800m Hommes - Finale', icon: Trophy },
            { time: '17:30', title: 'Relais 4x100m Mixte - Finale', icon: Trophy },
          ]},
        ].map((session, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-10 border-t-8 border-border-main hover:border-brand-primary transition-all group"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-display font-black italic uppercase tracking-tight">{session.session}</h3>
              <span className="text-brand-primary font-display font-black italic text-xl">{session.time}</span>
            </div>
            <div className="space-y-6">
              {session.events.map((event, j) => (
                <div key={j} className="flex items-center justify-between p-6 bg-bg-surface/50 border border-border-main hover:border-brand-primary/30 transition-colors">
                  <div className="flex items-center gap-6">
                    <span className="text-brand-primary font-display font-black italic text-xl">{event.time}</span>
                    <div>
                      <p className="font-bold text-text-main">{event.title}</p>
                    </div>
                  </div>
                  <event.icon className="text-text-muted" size={24} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
