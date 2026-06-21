import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import type { Athlete, Competition, NewsItem } from '../../types';
import { getPublicDb } from '../../lib/publicDb';
import { useAppNavigation } from '../../lib/navigation';
import { usePageTitle } from '../../hooks/usePageTitle';
import { AthleteProfilePage } from '../AthleteProfilePage';
import { ArticlePage } from '../ArticlePage';
import { ResultsDetailPage } from '../ResultsDetailPage';
import { TicketingPage } from '../TicketingPage';
import { ProgramPage } from '../ProgramPage';
import { AthletesPage } from '../AthletesPage';

export function AthletesRoute() {
  const [searchParams] = useSearchParams();
  const { athleteFilter, setPage } = useAppNavigation();
  const q = searchParams.get('q') ?? '';
  const discipline = searchParams.get('discipline') ?? athleteFilter;
  usePageTitle('Athlètes');
  return (
    <AthletesPage
      setPage={setPage}
      initialFilter={discipline}
      initialSearch={q}
      setSelectedAthlete={(a) => setPage('athlete-profile', { athleteId: a.id })}
    />
  );
}

export function AthleteProfileRoute() {
  const { id } = useParams();
  const { setPage } = useAppNavigation();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicDb()
      .then((db) => {
        const found = (db.athletes as Athlete[]).find((a) => a.id === Number(id));
        setAthlete(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  usePageTitle(athlete?.name ?? 'Athlète');

  if (loading) return <div className="pt-48 pb-20 text-center text-text-muted text-sm">Chargement…</div>;
  if (!athlete) return <Navigate to="/athletes" replace />;
  return <AthleteProfilePage athlete={athlete} setPage={setPage} />;
}

export function ArticleRoute() {
  const { id } = useParams();
  const { setPage } = useAppNavigation();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicDb()
      .then((db) => {
        const found = (db.news as NewsItem[]).find((n) => n.id === Number(id));
        setArticle(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  usePageTitle(article?.title ?? 'Actualité');

  if (loading) return <div className="pt-48 pb-20 text-center text-text-muted text-sm">Chargement…</div>;
  if (!article) return <Navigate to="/actualites" replace />;
  return <ArticlePage article={article} setPage={setPage} />;
}

export function ResultsDetailRoute() {
  const { id } = useParams();
  const { setPage } = useAppNavigation();
  const [competition, setCompetition] = useState<Competition | null>(null);

  useEffect(() => {
    getPublicDb()
      .then((db) => {
        const found = (db.competitions as Competition[]).find((c) => c.id === Number(id));
        setCompetition(found ?? null);
      });
  }, [id]);

  usePageTitle(competition?.title ?? 'Résultats');
  return <ResultsDetailPage competition={competition} setPage={setPage} />;
}

export function TicketingRoute() {
  const { id } = useParams();
  const { setPage } = useAppNavigation();
  const [competition, setCompetition] = useState<Competition | null>(null);

  useEffect(() => {
    if (!id) return;
    getPublicDb()
      .then((db) => {
        const found = (db.competitions as Competition[]).find((c) => c.id === Number(id));
        setCompetition(found ?? null);
      });
  }, [id]);

  usePageTitle('Billetterie');
  return <TicketingPage competition={competition} setPage={setPage} />;
}

export function ProgramRoute() {
  const { id } = useParams();
  const { setPage } = useAppNavigation();
  const [competition, setCompetition] = useState<Competition | null>(null);

  useEffect(() => {
    if (!id) return;
    getPublicDb()
      .then((db) => {
        const found = (db.competitions as Competition[]).find((c) => c.id === Number(id));
        setCompetition(found ?? null);
      });
  }, [id]);

  usePageTitle('Programme');
  return <ProgramPage competition={competition} setPage={setPage} />;
}
