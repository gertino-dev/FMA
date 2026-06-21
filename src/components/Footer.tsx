import { motion } from 'motion/react';
import { Instagram, Twitter, Facebook, Youtube, Mail, ArrowRight, Check } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Page } from '../types';
import { getPublicDb, SponsorPublic } from '../lib/publicDb';

interface FooterProps {
  setPage: (p: Page, opts?: { athleteFilter?: string }) => void;
  setAthleteFilter: (f: string) => void;
}

export const Footer = ({ setPage, setAthleteFilter }: FooterProps) => {
  const [sponsors, setSponsors] = useState<SponsorPublic[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    getPublicDb()
      .then((db) => setSponsors((db.sponsors ?? []).slice().sort((a, b) => a.order - b.order)))
      .catch(() => setSponsors([]));
  }, []);

  const sponsorLogos = useMemo(() => sponsors.map((s) => s.logo), [sponsors]);
  const sponsorStrip = useMemo(() => {
    if (sponsorLogos.length === 0) return [];
    return [...sponsorLogos, ...sponsorLogos, ...sponsorLogos];
  }, [sponsorLogos]);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-[#0f172a] pt-16 sm:pt-20 pb-8 sm:pb-10 safe-bottom"
    >
      <div className="mb-16 sm:mb-20 py-8 sm:py-10 relative sponsor-marquee">
        <div className="sponsor-track motion-reduce:animate-none">
          {sponsorStrip.length === 0 && (
            <div className="text-xs font-black uppercase tracking-widest text-white/30 px-12">Nos partenaires</div>
          )}
          {[...sponsorStrip, ...sponsorStrip].map((src, i) => (
            <img
              key={`s-${i}`}
              src={src}
              alt=""
              className="h-10 sm:h-16 w-auto object-contain opacity-80"
              loading="lazy"
              referrerPolicy="no-referrer"
              draggable={false}
            />
          ))}
        </div>
        <div className="sponsor-fade-left" />
        <div className="sponsor-fade-right" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16 sm:mb-20">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 overflow-hidden flex items-center justify-center">
                <img src="/logo fma.png" alt="FMA" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-black tracking-tighter uppercase italic leading-none text-white">FMA</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-primary leading-none">Madagascar</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              La destination officielle pour suivre l'athlétisme malagasy — athlètes, compétitions, classements et actualités.
            </p>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25 italic mb-6">
              « Ny atao no miverina »
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: 'https://instagram.com' },
                { Icon: Facebook, href: 'https://facebook.com' },
                { Icon: Youtube, href: 'https://youtube.com' },
                { Icon: Twitter, href: 'https://twitter.com' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Réseau social FMA"
                  className="w-11 h-11 bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors text-white/60"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-white/60">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Actualités', id: 'actualites' as Page },
                { label: 'Athlètes', id: 'athletes' as Page },
                { label: 'Compétitions', id: 'competitions' as Page },
                { label: 'Classements', id: 'classements' as Page },
                { label: 'Résultats', id: 'resultats' as Page },
                { label: 'Direct Live', id: 'direct' as Page },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      if (link.id === 'athletes') setAthleteFilter('Tous');
                      setPage(link.id);
                    }}
                    className="text-white/45 hover:text-brand-primary transition-colors text-sm flex items-center gap-2 group py-1"
                  >
                    <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-white/60">Disciplines</h4>
            <ul className="space-y-3">
              {['Sprints', 'Sauts', 'Lancers', 'Demi-fond', 'Combinés'].map((discipline) => (
                <li key={discipline}>
                  <button
                    onClick={() => {
                      setAthleteFilter(discipline);
                      setPage('athletes', { athleteFilter: discipline });
                    }}
                    className="text-white/45 hover:text-brand-primary transition-colors text-sm py-1"
                  >
                    {discipline}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-white/60">Newsletter</h4>
            <p className="text-white/45 text-sm mb-4">Recevez les dernières actus et résultats.</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-brand-primary text-sm font-medium py-3">
                <Check size={18} />
                Merci ! Vous serez informé(e).
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.mg"
                  required
                  aria-label="Adresse email newsletter"
                  className="w-full bg-white/5 border border-white/10 py-3.5 px-4 pr-12 text-sm focus:outline-none focus:border-brand-primary text-white placeholder:text-white/30"
                />
                <button type="submit" aria-label="S'inscrire" className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary p-2">
                  <Mail size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex gap-0.5 mb-6">
          <div className="flex-1 h-px bg-brand-primary opacity-40" />
          <div className="flex-1 h-px bg-white opacity-20" />
          <div className="flex-1 h-px bg-brand-secondary opacity-40" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs text-center sm:text-left">© 2026 Fédération Malagasy d'Athlétisme. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-white/25 text-xs">
            <button onClick={() => setPage('mentions')} className="hover:text-white/60 transition-colors py-2">Mentions légales</button>
            <button onClick={() => setPage('confidentialite')} className="hover:text-white/60 transition-colors py-2">Confidentialité</button>
            <button onClick={() => setPage('cookies')} className="hover:text-white/60 transition-colors py-2">Cookies</button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
