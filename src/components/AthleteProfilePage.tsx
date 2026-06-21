import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Medal, Globe, Timer, User, MapPin } from 'lucide-react';
import { Page, Athlete } from '../types';
import { AthleteAvatar } from './AthleteAvatar';

interface AthleteProfilePageProps {
  athlete: Athlete | null;
  setPage: (p: Page) => void;
}

const isFemale = (name: string) =>
  ['Sidonie', 'Claudine', 'Lorrie', 'Eliane', 'Vanessa', 'Rosa', 'Doris', 'Marie', 'Sarah', 'Hanta', 'Noro'].some(n =>
    name.includes(n)
  );

export const AthleteProfilePage = ({ athlete, setPage }: AthleteProfilePageProps) => {
  if (!athlete) return null;

  const pronoun = isFemale(athlete.name) ? 'elle' : 'il';
  const nameParts = athlete.name.split(' ');

  return (
    <div className="min-h-screen pb-24">

      {/* ════ HERO ════ */}
      <div className="relative overflow-hidden pt-40 md:pt-48 pb-0">

        {/* Blurred background */}
        <div className="absolute inset-0 z-0">
          <AthleteAvatar
            name={athlete.name}
            alt=""
            className="w-full h-full object-cover opacity-20 blur-3xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/85 to-bg-main/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setPage('athletes')}
            className="inline-flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-xs font-medium uppercase tracking-widest mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Tous les athlètes
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-end pb-16">

            {/* Left — Name & Stats */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Discipline + country */}
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-brand-primary text-white text-[9px] font-semibold uppercase tracking-[0.2em] px-3 py-1.5">
                  {athlete.discipline}
                </span>
                <span className="text-2xl">{athlete.flag}</span>
                <span className="text-text-muted text-[10px] font-medium uppercase tracking-widest">{athlete.country}</span>
              </div>

              {/* Name */}
              <h1 className="font-display font-bold uppercase tracking-tight leading-[0.88] mb-8">
                {nameParts.map((part, i) => (
                  <span
                    key={i}
                    className={`block text-[clamp(3rem,8vw,6.5rem)] ${i > 0 ? 'text-brand-primary' : ''}`}
                  >
                    {part}
                  </span>
                ))}
              </h1>

              {/* Key stats */}
              <div className="flex items-stretch gap-0 border border-border-main divide-x divide-border-main">
                {[
                  { label: 'Rang national', value: `#${athlete.rank}`, highlight: true },
                  { label: 'Record personnel', value: athlete.performance, highlight: false },
                  { label: 'Pays', value: athlete.country, highlight: false },
                ].map((s, i) => (
                  <div key={i} className="flex-1 px-6 py-5">
                    <p className="text-[9px] font-medium uppercase tracking-widest text-text-muted mb-1.5">{s.label}</p>
                    <p className={`text-xl md:text-2xl font-display font-bold ${s.highlight ? 'text-brand-primary' : ''}`}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Portrait */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative max-w-xs mx-auto lg:mx-0 lg:ml-auto">
                <div className="aspect-[3/4] overflow-hidden border border-border-main/40 shadow-2xl">
                  <AthleteAvatar
                    name={athlete.name}
                    alt={athlete.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Red left accent */}
                  <div className="absolute left-0 inset-y-0 w-1 bg-brand-primary" />
                </div>
                {/* Floating rank badge */}
                <div
                  className="absolute -bottom-4 -right-4 bg-bg-surface border border-border-main shadow-xl px-5 py-4"
                  style={{ borderLeft: '3px solid var(--color-brand-primary)' }}
                >
                  <p className="text-[9px] font-medium uppercase tracking-widest text-text-muted mb-0.5">Classement</p>
                  <p className="text-2xl font-display font-bold text-brand-primary">#{athlete.rank}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-48 h-px bg-brand-primary opacity-60" />
      </div>

      {/* ════ CONTENT ════ */}
      <div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left col: Bio + Palmarès ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Bio */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-surface border border-border-main p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 bg-brand-primary flex items-center justify-center">
                <User size={13} className="text-white" />
              </div>
              <h2 className="text-xl font-display font-bold uppercase tracking-tight">Biographie</h2>
            </div>

            {/* Pull quote */}
            <blockquote className="border-l-2 border-brand-primary pl-5 mb-6 italic text-text-muted text-base leading-relaxed">
              « Chaque course est une nouvelle chance de repousser ses propres limites. »
            </blockquote>

            <div className="space-y-4 text-text-muted text-sm leading-relaxed font-light">
              <p>
                {athlete.name} est l'un des fers de lance de l'athlétisme malgache. Spécialiste du{' '}
                <span className="text-text-main font-medium">{athlete.discipline}</span>, {pronoun} s'est imposé{isFemale(athlete.name) ? 'e' : ''} comme une référence sur le continent africain grâce à une détermination sans faille.
              </p>
              <p>
                Portant fièrement les couleurs de Madagascar, {pronoun} s'entraîne avec une rigueur exemplaire pour les prochaines échéances internationales, avec pour objectif de porter haut le drapeau de la Grande Île.
              </p>
            </div>
          </motion.section>

          {/* Palmarès — timeline */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-surface border border-border-main p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-7 h-7 bg-brand-primary flex items-center justify-center">
                <Medal size={13} className="text-white" />
              </div>
              <h2 className="text-xl font-display font-bold uppercase tracking-tight">Palmarès</h2>
            </div>

            <div className="relative pl-6 space-y-0">
              {/* Timeline line */}
              <div className="absolute left-0 top-2 bottom-2 w-px bg-border-main" />

              {[
                { year: '2025', event: 'Championnats de Madagascar', result: 'Médaille d\'Or', medal: '🥇' },
                { year: '2024', event: 'Meeting International de Tana', result: 'Record National', medal: '📍' },
                { year: '2024', event: 'Jeux Africains', result: 'Finaliste', medal: '🏅' },
                { year: '2023', event: 'Championnats de Madagascar', result: 'Médaille d\'Argent', medal: '🥈' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex gap-6 pb-6 group"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-7 top-1 w-3 h-3 rounded-full border-2 border-brand-primary bg-bg-surface group-hover:bg-brand-primary transition-colors" />

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-border-main/40 last:border-0">
                    <div className="flex items-center gap-4">
                      <span className="text-brand-primary font-display font-bold text-lg w-12 shrink-0">{item.year}</span>
                      <div>
                        <p className="text-sm font-semibold text-text-main">{item.event}</p>
                        <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest mt-0.5">{item.result}</p>
                      </div>
                    </div>
                    <span className="text-xl shrink-0">{item.medal}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* ── Right col: Fiche + Suivi ── */}
        <div className="space-y-8">

          {/* Fiche technique */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-surface border border-border-main border-t-2"
            style={{ borderTopColor: 'var(--color-brand-primary)' }}
          >
            <div className="px-6 pt-6 pb-2 flex items-center gap-3 border-b border-border-main mb-2">
              <Trophy size={14} className="text-brand-primary" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Fiche Technique</h3>
            </div>

            <div className="p-6 space-y-0">
              {[
                { label: 'Âge', value: '24 ans', icon: User },
                { label: 'Taille', value: '1.72 m', icon: Timer },
                { label: 'Club', value: 'Alarobia Athletics', icon: Trophy },
                { label: 'Entraîneur', value: 'Jean-Louis R.', icon: User },
                { label: 'Région', value: 'Antananarivo', icon: MapPin },
                { label: 'Sponsors', value: 'Telma, FMA', icon: Globe },
              ].map(({ label, value, icon: Icon }, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-border-main/30 last:border-0 group">
                  <div className="flex items-center gap-2.5">
                    <Icon size={12} className="text-brand-primary opacity-60" />
                    <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-text-main">{value}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Performance visuelle */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-surface border border-border-main p-6"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-brand-primary inline-block" />
              Progression
            </h3>
            {[
              { label: 'Vitesse', pct: 88 },
              { label: 'Endurance', pct: 65 },
              { label: 'Technique', pct: 92 },
              { label: 'Régularité', pct: 78 },
            ].map(({ label, pct }) => (
              <div key={label} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">{label}</span>
                  <span className="text-[10px] font-bold text-text-main">{pct}%</span>
                </div>
                <div className="h-1 bg-border-main overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </motion.section>

          {/* Social */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-surface border border-border-main p-6"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-brand-primary inline-block" />
              Suivre l'athlète
            </h3>
            <div className="flex gap-3">
              {['Instagram', 'Facebook', 'Twitter'].map((s) => (
                <button
                  key={s}
                  className="flex-1 py-3 bg-transparent border border-border-main hover:border-brand-primary hover:text-brand-primary transition-all text-[9px] font-semibold uppercase tracking-widest text-text-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
};
