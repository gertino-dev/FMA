import { motion } from 'motion/react';

interface LegalPageProps {
  title: string;
  content: string;
}

export const LegalPage = ({ title, content }: LegalPageProps) => (
  <div className="pt-40 md:pt-48 pb-20 max-w-4xl mx-auto px-6 min-h-screen">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl md:text-6xl font-display font-black italic uppercase tracking-tighter mb-12">{title}</h1>
      <div className="prose prose-invert max-w-none text-text-muted leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </motion.div>
  </div>
);
