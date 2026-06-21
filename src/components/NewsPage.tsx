import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Page, NewsItem } from '../types';
import { getPublicDb } from '../lib/publicDb';
import { PageHeader } from './ui/SectionHeader';

interface NewsPageProps {
  setSelectedArticle: (a: NewsItem) => void;
  setPage: (p: Page) => void;
}

export const NewsPage = ({ setSelectedArticle, setPage }: NewsPageProps) => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    getPublicDb()
      .then((db) => setItems((db.news as NewsItem[]) ?? []))
      .catch(() => setItems([]));
  }, []);

  const categories = useMemo(
    () => ['Tous', ...Array.from(new Set(items.map((n) => n.category))).filter(Boolean)],
    [items]
  );

  const filteredNews = activeCategory === 'Tous' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="pt-36 sm:pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-4 sm:px-6 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <PageHeader
          eyebrow="Éditorial FMA"
          title="Actualités"
          description="Restez informé de toute l'actualité de l'athlétisme malagasy : records, compétitions et portraits d'athlètes."
        />
      </motion.div>

      <div className="flex gap-2 sm:gap-3 mb-12 sm:mb-16 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap no-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`filter-pill shrink-0 min-h-[44px] ${activeCategory === cat ? 'filter-pill-active' : 'filter-pill-inactive'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {filteredNews.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer card card-hover overflow-hidden active:scale-[0.99]"
            onClick={() => setSelectedArticle(item)}
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 sm:p-6">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-2">
                <span className="text-text-muted">{item.date}</span>
                <span className="text-text-muted/40">·</span>
                <span className="text-brand-primary">{item.category}</span>
              </p>
              <h3 className="text-lg sm:text-xl font-display font-bold group-hover:text-brand-primary transition-colors leading-snug mb-3">
                {item.title}
              </h3>
              <span className="link-action text-[10px]">
                Lire la suite <ArrowRight size={13} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
