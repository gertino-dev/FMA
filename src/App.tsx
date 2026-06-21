import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NavigationProvider, useAppNavigation } from './lib/navigation';
import { usePageTitle } from './hooks/usePageTitle';
import {
  AthletesRoute,
  AthleteProfileRoute,
  ArticleRoute,
  ResultsDetailRoute,
  TicketingRoute,
  ProgramRoute,
} from './components/routes/RouteWrappers';

const HomePage = lazy(() => import('./components/HomePage').then((m) => ({ default: m.HomePage })));
const CompetitionsPage = lazy(() => import('./components/CompetitionsPage').then((m) => ({ default: m.CompetitionsPage })));
const RankingsPage = lazy(() => import('./components/RankingsPage').then((m) => ({ default: m.RankingsPage })));
const ResultsPage = lazy(() => import('./components/ResultsPage').then((m) => ({ default: m.ResultsPage })));
const DirectPage = lazy(() => import('./components/DirectPage').then((m) => ({ default: m.DirectPage })));
const NewsPage = lazy(() => import('./components/NewsPage').then((m) => ({ default: m.NewsPage })));
const LegalPage = lazy(() => import('./components/LegalPage').then((m) => ({ default: m.LegalPage })));

const PageFallback = () => (
  <div className="pt-48 pb-20 flex justify-center">
    <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppRoutes() {
  const { setPage } = useAppNavigation();
  usePageTitle();

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              setPage={setPage}
              setSelectedArticle={(a) => setPage('article', { articleId: a.id })}
              setSelectedCompetition={(c) => setPage('programme', { competitionId: c.id })}
              setSelectedAthlete={(a) => setPage('athlete-profile', { athleteId: a.id })}
            />
          }
        />
        <Route path="/athletes" element={<AthletesRoute />} />
        <Route path="/athletes/:id" element={<AthleteProfileRoute />} />
        <Route
          path="/competitions"
          element={
            <CompetitionsPage
              setPage={setPage}
              setSelectedCompetition={(c) => setPage('programme', { competitionId: c.id })}
            />
          }
        />
        <Route
          path="/classements"
          element={
            <RankingsPage
              setPage={setPage}
              setSelectedAthlete={(a) => setPage('athlete-profile', { athleteId: a.id })}
            />
          }
        />
        <Route
          path="/resultats"
          element={
            <ResultsPage
              setPage={setPage}
              setSelectedCompetition={(c) => setPage('resultats-detail', { competitionId: c.id })}
            />
          }
        />
        <Route path="/resultats/:id" element={<ResultsDetailRoute />} />
        <Route
          path="/actualites"
          element={
            <NewsPage
              setPage={setPage}
              setSelectedArticle={(a) => setPage('article', { articleId: a.id })}
            />
          }
        />
        <Route path="/actualites/:id" element={<ArticleRoute />} />
        <Route path="/direct" element={<DirectPage />} />
        <Route path="/billetterie" element={<TicketingRoute />} />
        <Route path="/billetterie/:id" element={<TicketingRoute />} />
        <Route path="/programme" element={<ProgramRoute />} />
        <Route path="/programme/:id" element={<ProgramRoute />} />
        <Route
          path="/mentions"
          element={
            <LegalPage
              title="Mentions Légales"
              content={`Éditeur du site : Fédération Malagasy d'Athlétisme (FMA)\nSiège social : Stade d'Alarobia, Antananarivo, Madagascar\n\nDirecteur de la publication : Président de la FMA\n\nHébergement : Cloud Run (Google Cloud Platform)\n\nPropriété intellectuelle : L'ensemble des contenus de ce site (textes, images, vidéos) est la propriété exclusive de la FMA ou de ses partenaires. Toute reproduction est interdite sans accord préalable.`}
            />
          }
        />
        <Route
          path="/confidentialite"
          element={
            <LegalPage
              title="Confidentialité"
              content={`La FMA s'engage à protéger vos données personnelles. Les informations collectées via nos formulaires sont destinées exclusivement à l'usage de la Fédération pour vous informer sur nos activités.\n\nConformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour toute demande, contactez-nous via notre adresse email officielle.`}
            />
          }
        />
        <Route
          path="/cookies"
          element={
            <LegalPage
              title="Politique des Cookies"
              content={`Ce site utilise des cookies pour améliorer votre expérience de navigation. En continuant à naviguer sur ce site, vous acceptez notre utilisation des cookies.\n\nVous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait limiter certaines fonctionnalités du site.`}
            />
          }
        />
        <Route path="*" element={<HomePage setPage={setPage} setSelectedArticle={(a) => setPage('article', { articleId: a.id })} setSelectedCompetition={(c) => setPage('programme', { competitionId: c.id })} setSelectedAthlete={(a) => setPage('athlete-profile', { athleteId: a.id })} />} />
      </Routes>
    </Suspense>
  );
}

function AppShell() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [athleteFilter, setAthleteFilter] = useState('Tous');
  const { setPage } = useAppNavigation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="min-h-screen bg-bg-main text-text-main transition-colors duration-500 selection:bg-brand-primary selection:text-white">
      <Navbar
        setPage={setPage}
        setAthleteFilter={setAthleteFilter}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main>
        <AppRoutes />
      </main>
      <Footer setPage={setPage} setAthleteFilter={setAthleteFilter} />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [athleteFilter, setAthleteFilter] = useState('Tous');

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {loading ? (
          <Loader key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <NavigationProvider athleteFilter={athleteFilter} setAthleteFilter={setAthleteFilter}>
            <AppShell />
          </NavigationProvider>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}
