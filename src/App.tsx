import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Page, NewsItem, Athlete, Competition } from './types';

// Components
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AthletesPage } from './components/AthletesPage';
import { CompetitionsPage } from './components/CompetitionsPage';
import { RankingsPage } from './components/RankingsPage';
import { ResultsPage } from './components/ResultsPage';
import { ArticlePage } from './components/ArticlePage';
import { AthleteProfilePage } from './components/AthleteProfilePage';
import { DirectPage } from './components/DirectPage';
import { TicketingPage } from './components/TicketingPage';
import { ProgramPage } from './components/ProgramPage';
import { ResultsDetailPage } from './components/ResultsDetailPage';
import { NewsPage } from './components/NewsPage';
import { LegalPage } from './components/LegalPage';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<Page>('accueil');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [athleteFilter, setAthleteFilter] = useState('Tous');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className={`min-h-screen bg-bg-main text-text-main transition-colors duration-500 selection:bg-brand-primary selection:text-white`}>
      <AnimatePresence mode="wait">
        {loading ? (
          <Loader key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <div key="content" className="relative">
            <Navbar 
              currentPage={page} 
              setPage={setPage} 
              setAthleteFilter={setAthleteFilter}
              theme={theme}
              toggleTheme={toggleTheme}
            />

            <main>
              {page === 'accueil' && (
                <HomePage 
                  setPage={setPage} 
                  setSelectedArticle={setSelectedArticle} 
                  setSelectedCompetition={setSelectedCompetition}
                  setSelectedAthlete={setSelectedAthlete}
                />
              )}
              {page === 'athletes' && (
                <AthletesPage 
                  setSelectedAthlete={setSelectedAthlete} 
                  setPage={setPage} 
                  initialFilter={athleteFilter}
                />
              )}
              {page === 'competitions' && (
                <CompetitionsPage 
                  setPage={setPage} 
                  setSelectedCompetition={setSelectedCompetition} 
                />
              )}
              {page === 'classements' && (
                <RankingsPage 
                  setSelectedAthlete={setSelectedAthlete} 
                  setPage={setPage} 
                />
              )}
              {page === 'resultats' && (
                <ResultsPage 
                  setPage={setPage} 
                  setSelectedCompetition={setSelectedCompetition} 
                />
              )}
              {page === 'resultats-detail' && (
                <ResultsDetailPage 
                  competition={selectedCompetition} 
                  setPage={setPage} 
                />
              )}
              {page === 'article' && <ArticlePage article={selectedArticle} setPage={setPage} />}
              {page === 'athlete-profile' && <AthleteProfilePage athlete={selectedAthlete} setPage={setPage} />}
              {page === 'direct' && <DirectPage />}
              {page === 'billetterie' && <TicketingPage competition={selectedCompetition} setPage={setPage} />}
              {page === 'programme' && <ProgramPage competition={selectedCompetition} setPage={setPage} />}
              {page === 'actualites' && <NewsPage setSelectedArticle={setSelectedArticle} setPage={setPage} />}
              
              {page === 'mentions' && (
                <LegalPage 
                  title="Mentions Légales" 
                  content={`Éditeur du site : Fédération Malagasy d'Athlétisme (FMA)\nSiège social : Stade d'Alarobia, Antananarivo, Madagascar\n\nDirecteur de la publication : Président de la FMA\n\nHébergement : Cloud Run (Google Cloud Platform)\n\nPropriété intellectuelle : L'ensemble des contenus de ce site (textes, images, vidéos) est la propriété exclusive de la FMA ou de ses partenaires. Toute reproduction est interdite sans accord préalable.`} 
                />
              )}
              {page === 'confidentialite' && (
                <LegalPage 
                  title="Confidentialité" 
                  content={`La FMA s'engage à protéger vos données personnelles. Les informations collectées via nos formulaires sont destinées exclusivement à l'usage de la Fédération pour vous informer sur nos activités.\n\nConformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour toute demande, contactez-nous via notre adresse email officielle.`} 
                />
              )}
              {page === 'cookies' && (
                <LegalPage 
                  title="Politique des Cookies" 
                  content={`Ce site utilise des cookies pour améliorer votre expérience de navigation et analyser notre trafic. En continuant à naviguer sur ce site, vous acceptez notre utilisation des cookies.\n\nVous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait limiter certaines fonctionnalités du site.`} 
                />
              )}
            </main>

            <Footer setPage={setPage} setAthleteFilter={setAthleteFilter} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
