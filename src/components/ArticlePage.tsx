import { motion } from 'motion/react';
import { ArrowRight, Calendar, Mail, QrCode } from 'lucide-react';
import { Page, NewsItem } from '../types';

interface ArticlePageProps {
  article: NewsItem | null;
  setPage: (p: Page) => void;
}

export const ArticlePage = ({ article, setPage }: ArticlePageProps) => {
  if (!article) return null;

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-4xl mx-auto px-6 min-h-screen">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setPage('accueil')}
        className="inline-flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-xs mb-12 hover:gap-4 transition-all"
      >
        <ArrowRight size={16} className="rotate-180" /> Retour à l'accueil
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <span className="badge-sport px-4 py-2">{article.category}</span>
          <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase tracking-widest">
            <Calendar size={14} className="text-brand-primary" /> {article.date}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black italic uppercase tracking-tighter leading-[0.9] mb-12">
          {article.title}
        </h1>

        <div className="aspect-video overflow-hidden mb-16 border-4 border-border-main shadow-2xl">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="prose prose-invert max-w-none text-text-muted leading-relaxed text-lg space-y-8">
          {article.description && (() => {
            const content = article.description;
            
            // Check if this is a structured description
            if (content.includes('|MAIN|')) {
              const [highlight, rest1] = content.split('|MAIN|');
              const [mainText, rest2] = rest1.split('|CARDS|');
              const [cardText, finalText] = rest2.split('|END_CARDS|');
              const cardParts = cardText.split('|CARD_SEP|');
              
              return (
                <>
                  {/* Highlighted section */}
                  <p className="text-xl text-text-main font-medium italic border-l-4 border-brand-primary pl-8 py-4 bg-bg-surface/30">
                    {highlight}
                  </p>
                  
                  {/* Main paragraphs */}
                  {mainText.split('\n\n').map((para, i) => (
                    para.trim() && <p key={`main-${i}`}>{para}</p>
                  ))}
                  
                  {/* Cards section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                    {cardParts.map((cardContent, idx) => {
                      const [cardTitle, cardBody] = cardContent.split('|');
                      const icon = idx === 0 
                        ? <Mail className="text-brand-primary mb-4" size={32} /> 
                        : <QrCode className="text-brand-primary mb-4" size={32} />;
                      
                      return (
                        <div key={`card-${idx}`} className="glass-card p-8 border-t-4 border-brand-primary">
                          {icon}
                          <h4 className="text-white font-bold mb-2">{cardTitle.trim()}</h4>
                          <p className="text-sm">{cardBody.trim()}</p>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Final paragraph */}
                  <p>{finalText}</p>
                </>
              );
            } else {
              // Default rendering for non-structured descriptions
              return content.split('\n\n').map((paragraph, i) => (
                <p key={i} className={i === 0 ? 'text-xl text-text-main font-medium italic border-l-4 border-brand-primary pl-8 py-4 bg-bg-surface/30' : ''}>
                  {paragraph}
                </p>
              ));
            }
          })()}
          {!article.description && (
            <>
              <p className="text-xl text-text-main font-medium italic border-l-4 border-brand-primary pl-8 py-4 bg-bg-surface/30">
                Une performance historique qui marque un tournant pour l'athlétisme malagasy cette saison.
              </p>
              <p>
                L'événement qui s'est déroulé ce week-end a tenu toutes ses promesses, offrant aux spectateurs des moments d'une intensité rare. Les athlètes, portés par une ferveur populaire exceptionnelle, ont repoussé leurs limites pour offrir des performances de classe mondiale.
              </p>
              <p>
                Cette victoire ne représente pas seulement un succès individuel, mais témoigne du travail acharné accompli par la Fédération Malagasy d'Athlétisme pour structurer et promouvoir la discipline à travers toute l'île. Les investissements dans les infrastructures et l'encadrement technique commencent à porter leurs fruits.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="glass-card p-8 border-t-4 border-brand-primary">
                  <Mail className="text-brand-primary mb-4" size={32} />
                  <h4 className="text-white font-bold mb-2">Impact Communautaire</h4>
                  <p className="text-sm">Plus de 5000 jeunes ont été inspirés par cette performance à travers les différentes ligues régionales.</p>
                </div>
                <div className="glass-card p-8 border-t-4 border-brand-primary">
                  <QrCode className="text-brand-primary mb-4" size={32} />
                  <h4 className="text-white font-bold mb-2">Objectif 2026</h4>
                  <p className="text-sm">Cette étape est cruciale dans la préparation des prochains championnats d'Afrique.</p>
                </div>
              </div>
              <p>
                La suite de la saison s'annonce tout aussi passionnante avec plusieurs meetings internationaux prévus dans les mois à venir. La FMA invite tous les passionnés à rester connectés pour ne rien manquer des prochaines échéances.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
