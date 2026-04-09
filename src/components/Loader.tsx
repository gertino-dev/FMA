import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const Loader = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[999] bg-bg-main flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden flex items-center justify-center">
              <img 
                src="/logo fma.png" 
                alt="FMA Logo" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase italic leading-none">FMA</span>
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] text-brand-primary leading-none">Madagascar</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-brand-primary/30" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted">Chargement</span>
            <div className="h-px w-12 bg-brand-primary/30" />
          </div>
        </motion.div>
        
        <div className="relative h-[2px] w-full bg-border-main overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-brand-primary"
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <span className="text-[10px] font-black font-mono text-brand-primary">{progress}%</span>
          <span className="text-[10px] font-black font-mono text-text-muted">2026</span>
        </div>
      </div>
    </motion.div>
  );
};
