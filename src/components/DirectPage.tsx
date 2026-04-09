import { motion } from 'motion/react';
import { Play, Users, MessageSquare, Share2 } from 'lucide-react';

export const DirectPage = () => (
  <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12"
    >
      <div className="flex items-center gap-4 mb-6">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
        </span>
        <h1 className="text-4xl sm:text-6xl font-display font-black italic uppercase tracking-tighter">Direct Live</h1>
      </div>
      <p className="text-text-muted text-lg max-w-2xl border-l-4 border-brand-primary pl-6">Suivez en temps réel les compétitions majeures de l'athlétisme malagasy.</p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <div className="aspect-video bg-black relative group overflow-hidden border-4 border-border-main shadow-2xl">
          <img 
            src="/image/WhatsApp Image 2026-04-08 at 19.31.22 (1).jpeg" 
            alt="Live Stream" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-24 h-24 bg-brand-primary flex items-center justify-center text-white shadow-[0_0_50px_rgba(225,29,72,0.5)]"
            >
              <Play size={40} fill="currentColor" />
            </motion.button>
          </div>
          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-wrap gap-2 md:gap-3">
            <span className="bg-brand-primary text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-3 py-1 shadow-lg">En Direct</span>
            <span className="bg-black/50 backdrop-blur-md text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-3 py-1 flex items-center gap-1 md:gap-2 border border-white/20 shadow-lg">
              <Users size={10} className="md:w-3 md:h-3" /> 1,245 spectateurs
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-display font-black italic uppercase tracking-tight text-white mb-1 md:mb-2 line-clamp-2">Championnats de Madagascar - Jour 2</h2>
            <p className="text-white/70 text-[10px] sm:text-xs md:text-sm">Stade d'Alarobia, Antananarivo</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted hover:text-brand-primary transition-colors">
              <Share2 size={16} /> Partager
            </button>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted hover:text-brand-primary transition-colors">
              <MessageSquare size={16} /> Chat
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Qualité :</span>
            <select className="bg-bg-surface border border-border-main text-[10px] font-black uppercase tracking-widest px-3 py-1 focus:outline-none focus:border-brand-primary text-text-main">
              <option>1080p HD</option>
              <option>720p</option>
              <option>480p</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-display font-black italic uppercase tracking-tight">Prochainement</h3>
        {[
          { title: "Finale 100m Hommes", time: "14:30", category: "Sprint" },
          { title: "Saut en Longueur Femmes", time: "15:15", category: "Saut" },
          { title: "Relais 4x400m", time: "16:45", category: "Relais" },
        ].map((event, i) => (
          <div key={i} className="glass-card p-6 border-l-4 border-border-main hover:border-brand-primary transition-colors">
            <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest mb-1">{event.time}</p>
            <h4 className="font-bold text-text-main mb-1">{event.title}</h4>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">{event.category}</p>
          </div>
        ))}
        <div className="bg-bg-surface p-8 border border-border-main text-center">
          <p className="text-text-muted text-sm mb-6 italic">"Suivez l'excellence, vivez l'émotion de l'athlétisme malagasy en direct."</p>
          <button className="w-full btn-outline py-3 text-xs">S'abonner aux alertes</button>
        </div>
      </div>
    </div>
  </div>
);
