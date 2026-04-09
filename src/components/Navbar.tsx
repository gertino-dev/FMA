import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, Search } from 'lucide-react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  setPage: (p: Page) => void;
  setAthleteFilter: (f: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navbar = ({ currentPage, setPage, setAthleteFilter, theme, toggleTheme }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string, id: Page }[] = [
    { label: 'Accueil', id: 'accueil' },
    { label: 'Athlètes', id: 'athletes' },
    { label: 'Compétitions', id: 'competitions' },
    { label: 'Classements', id: 'classements' },
    { label: 'Résultats', id: 'resultats' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-bg-main/80 backdrop-blur-xl py-3 lg:py-4 border-border-main/20' : 'bg-transparent py-4 lg:py-6 border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setPage('accueil')}
        >
          <div className="w-14 h-14 lg:w-20 lg:h-20 overflow-hidden flex items-center justify-center">
            <img src="/logo fma.png" alt="FMA Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-xl lg:text-3xl font-display font-black tracking-tighter uppercase italic leading-none">FMA</span>
            <span className="text-[7px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary leading-none">Madagascar</span>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:flex items-center gap-6 xl:gap-8"
        >
          {/* Global Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-bg-surface/50 border border-border-main py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-brand-primary focus:bg-bg-surface transition-all w-40 focus:w-64 -skew-x-12"
            />
          </div>

          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (item.id === 'athletes') setAthleteFilter('Tous');
                setPage(item.id);
              }}
              className={`text-sm font-semibold uppercase tracking-widest transition-colors hover:text-brand-primary ${currentPage === item.id ? 'text-brand-primary' : 'text-text-muted'}`}
            >
              {item.label}
            </motion.button>
          ))}
          
          <motion.button 
            whileHover={{ rotate: 15 }}
            onClick={toggleTheme}
            className="p-2 text-text-main"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage('direct')}
            className="btn-primary py-2 px-8 text-xs"
          >
            Direct
          </motion.button>

        </motion.div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <motion.button 
            whileHover={{ rotate: 15 }}
            onClick={toggleTheme}
            className="p-2 text-text-main"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
          <button className="text-text-main" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-bg-main border-b border-border-main p-6 lg:hidden"
          >
          <div className="flex flex-col gap-6">
            {/* Mobile Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher sur FMA..." 
                className="w-full bg-bg-surface border-2 border-border-main py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary -skew-x-12"
              />
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setIsMobileMenuOpen(false); }}
                className={`text-2xl font-display font-black italic uppercase tracking-tighter text-left ${currentPage === item.id ? 'text-brand-primary' : 'text-text-main'}`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={() => { setPage('direct'); setIsMobileMenuOpen(false); }} className="btn-primary w-full">Direct</button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
