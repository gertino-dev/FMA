import { motion } from 'motion/react';
import { Calendar, Globe, ArrowRight, Trophy, Users, Star } from 'lucide-react';
import { Page, Competition } from '../types';

interface TicketingPageProps {
  competition: Competition | null;
  setPage: (p: Page) => void;
}

export const TicketingPage = ({ competition, setPage }: TicketingPageProps) => {
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
              <Star className="text-brand-primary fill-brand-primary" size={24} />
              <p className="text-2xl font-display font-black italic uppercase tracking-tight">Événement Élite</p>
            </div>
            <p className="text-text-muted text-xs uppercase tracking-widest leading-relaxed">Places limitées pour la tribune officielle.</p>
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
            "Vivez l'intensité de l'athlétisme malagasy au plus près de l'action. Réservez vos places dès maintenant pour cet événement exceptionnel."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { type: 'Pelouse', price: '5,000 Ar', icon: Users, features: ['Accès zone debout', 'Proximité piste', 'Ambiance populaire'] },
          { type: 'Tribune', price: '15,000 Ar', icon: Trophy, features: ['Siège numéroté', 'Vue d\'ensemble', 'Accès buvette'] },
          { type: 'VIP', price: '50,000 Ar', icon: Star, features: ['Espace climatisé', 'Cocktail inclus', 'Rencontre athlètes'] },
        ].map((tier, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-10 border-t-8 border-border-main hover:border-brand-primary transition-all group"
          >
            <tier.icon className="text-brand-primary mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-2xl font-display font-black italic uppercase tracking-tight mb-2">{tier.type}</h3>
            <p className="text-3xl font-display font-black text-brand-primary mb-8">{tier.price}</p>
            <ul className="space-y-4 mb-10">
              {tier.features.map((f, j) => (
                <li key={j} className="text-sm text-text-muted flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full btn-primary py-4 text-xs">Réserver maintenant</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
