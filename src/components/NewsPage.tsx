import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Page, NewsItem } from '../types';
import { NEWS } from '../constants';

interface NewsPageProps {
  setSelectedArticle: (a: NewsItem) => void;
  setPage: (p: Page) => void;
}

export const NewsPage = ({ setSelectedArticle, setPage }: NewsPageProps) => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const categories = ['Tous', 'Compétition', 'Portrait', 'Fédération', 'International'];

  const filteredNews = activeCategory === 'Tous' 
    ? NEWS 
    : NEWS.filter(item => item.category === activeCategory);

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl sm:text-6xl font-display font-black italic uppercase tracking-tighter mb-6">Actualités</h1>
        <p className="text-text-muted text-lg max-w-2xl border-l-4 border-brand-primary pl-6">
          Restez informé de toute l'actualité de l'athlétisme malagasy : records, compétitions et portraits d'athlètes.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-4 mb-16">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all -skew-x-12 border-2 ${
              activeCategory === cat 
              ? 'bg-brand-primary border-brand-primary text-white' 
              : 'bg-bg-surface border-border-main text-text-muted hover:border-brand-primary hover:text-brand-primary'
            }`}
          >
            <span className="skew-x-12 inline-block">{cat}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredNews.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
            onClick={() => {
              setSelectedArticle(item);
              setPage('article');
            }}
          >
            <div className="aspect-[16/10] overflow-hidden mb-6 border border-border-main relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
                  {item.category}
                </span>
              </div>
            </div>
            <p className="text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-2">{item.date}</p>
            <h3 className="text-xl font-display font-bold group-hover:text-brand-primary transition-colors leading-tight mb-4">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase tracking-widest">
              Lire la suite <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
