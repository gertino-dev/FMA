import { useEffect } from 'react';
import { motion } from 'motion/react';

export const Loader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[999] bg-bg-main flex flex-col items-center justify-center p-6 safe-top"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden flex items-center justify-center mb-5">
          <img src="/logo fma.png" alt="FMA" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-display font-black tracking-tighter uppercase italic">FMA</span>
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-brand-primary">Madagascar</span>
        </div>
        <div className="w-32 h-0.5 bg-border-main overflow-hidden rounded-full">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="h-full w-1/2 bg-brand-primary"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
