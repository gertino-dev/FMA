import { motion } from 'motion/react';
import { Instagram, Twitter, Facebook, Youtube, Mail, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Page } from '../types';
import { getPublicDb, SponsorPublic } from '../lib/publicDb';

interface FooterProps {
  setPage: (p: Page) => void;
  setAthleteFilter: (f: string) => void;
}

export const Footer = ({ setPage, setAthleteFilter }: FooterProps) => {
  const [sponsors, setSponsors] = useState<SponsorPublic[]>([]);

  useEffect(() => {
    getPublicDb()
      .then((db) => setSponsors((db.sponsors ?? []).slice().sort((a, b) => a.order - b.order)))
      .catch(() => setSponsors([]));
  }, []);

  const sponsorLogos = useMemo(() => sponsors.map((s) => s.logo), [sponsors]);
  const sponsorStrip = useMemo(() => {
    if (sponsorLogos.length === 0) return [];
    return [
      ...sponsorLogos,
      ...sponsorLogos,
      ...sponsorLogos,
      ...sponsorLogos,
      ...sponsorLogos,
      ...sponsorLogos,
    ];
  }, [sponsorLogos]);

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-bg-main pt-20 pb-10"
    >
    {/* Sponsors Section - Full Width Infinite Carousel */}
    <div className="mb-20 py-10 relative sponsor-marquee">
      <div className="sponsor-track">
        {sponsorStrip.length === 0 && (
          <div className="text-xs font-black uppercase tracking-widest text-text-muted px-12">
            Sponsors
          </div>
        )}
        {[...sponsorStrip, ...sponsorStrip].map((src, i) => (
          <img
            key={`s-${i}`}
            src={src}
            alt={`Sponsor ${sponsorLogos.length ? ((i % sponsorStrip.length) % sponsorLogos.length) + 1 : ''}`}
            className="h-12 md:h-20 w-auto object-contain"
            referrerPolicy="no-referrer"
            draggable={false}
          />
        ))}
      </div>
      <div className="sponsor-fade-left" />
      <div className="sponsor-fade-right" />
    </div>

    <div className="max-w-7xl mx-auto px-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 overflow-hidden flex items-center justify-center">
              <img src="/logo fma.png" alt="FMA Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-2xl font-display font-black tracking-tighter uppercase italic leading-none">FMA</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-primary leading-none">Madagascar</span>
            </div>
          </div>
          <p className="text-text-muted text-sm leading-relaxed mb-6">
            La destination ultime pour les passionnés d'athlétisme à Madagascar. Suivez l'élite malagasy et restez au cœur de l'action.
          </p>
          <div className="flex gap-4 mb-6">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <motion.a 
                key={i} 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ delay: i * 0.1 }}
                href="#" 
                className="w-10 h-10 bg-bg-surface flex items-center justify-center hover:bg-brand-primary transition-colors text-text-main"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
          <div className="space-y-2 border-t border-border-main/30 pt-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-main mb-3">Contact</p>
            <p className="text-xs text-text-muted flex items-center gap-2">
              <Mail size={14} className="text-brand-primary" /> contact@fma.mg
            </p>
            <p className="text-xs text-text-muted flex items-center gap-2">
              <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px] font-bold text-brand-primary">T</span> +261 20 22 000 00
            </p>
            <p className="text-xs text-text-muted flex items-center gap-2">
              <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px] font-bold text-brand-primary">A</span> Alarobia, Antananarivo
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-text-main">Navigation</h4>
          <ul className="space-y-4">
            {[
              { label: 'Athlètes', id: 'athletes' as Page },
              { label: 'Compétitions', id: 'competitions' as Page },
              { label: 'Classements', id: 'classements' as Page },
              { label: 'Résultats', id: 'resultats' as Page },
              { label: 'Direct Live', id: 'direct' as Page }
            ].map((link) => (
              <li key={link.id}>
                <button 
                  onClick={() => {
                    if (link.id === 'athletes') setAthleteFilter('Tous');
                    setPage(link.id);
                  }}
                  className="text-text-muted hover:text-brand-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-text-main">Disciplines</h4>
          <ul className="space-y-4">
            {['Sprints', 'Sauts', 'Lancers', 'Demi-fond', 'Combinés'].map((discipline) => (
              <li key={discipline}>
                <button 
                  onClick={() => {
                    setAthleteFilter(discipline);
                    setPage('athletes');
                  }}
                  className="text-text-muted hover:text-brand-primary transition-colors text-sm"
                >
                  {discipline}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-text-main">Newsletter</h4>
          <p className="text-text-muted text-sm mb-6">Recevez les dernières actus et résultats.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-bg-surface border border-border-main py-3 px-4 text-sm focus:outline-none focus:border-brand-primary text-text-main"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary">
              <Mail size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-border-main flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-text-muted text-xs">© 2026 FMA. Tous droits réservés.</p>
        <div className="flex gap-8 text-text-muted text-xs">
          <button onClick={() => setPage('mentions')} className="hover:text-text-main">Mentions Légales</button>
          <button onClick={() => setPage('admin-login')} className="hover:text-text-main">Log in</button>
          <button onClick={() => setPage('confidentialite')} className="hover:text-text-main">Confidentialité</button>
          <button onClick={() => setPage('cookies')} className="hover:text-text-main">Cookies</button>
        </div>
      </div>
    </div>
    </motion.footer>
  );
};
