import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import type { Page, NavOptions } from '../types';

export type { NavOptions };

export function pageToPath(page: Page, opts?: NavOptions): string {
  switch (page) {
    case 'accueil':
      return '/';
    case 'athletes': {
      const params = new URLSearchParams();
      if (opts?.athleteFilter && opts.athleteFilter !== 'Tous') params.set('discipline', opts.athleteFilter);
      if (opts?.search) params.set('q', opts.search);
      const qs = params.toString();
      return qs ? `/athletes?${qs}` : '/athletes';
    }
    case 'athlete-profile':
      return `/athletes/${opts?.athleteId ?? ''}`;
    case 'competitions':
      return '/competitions';
    case 'classements':
      return '/classements';
    case 'resultats':
      return '/resultats';
    case 'resultats-detail':
      return `/resultats/${opts?.competitionId ?? ''}`;
    case 'actualites':
      return '/actualites';
    case 'article':
      return `/actualites/${opts?.articleId ?? ''}`;
    case 'direct':
      return '/direct';
    case 'billetterie':
      return opts?.competitionId ? `/billetterie/${opts.competitionId}` : '/billetterie';
    case 'programme':
      return opts?.competitionId ? `/programme/${opts.competitionId}` : '/programme';
    case 'mentions':
      return '/mentions';
    case 'confidentialite':
      return '/confidentialite';
    case 'cookies':
      return '/cookies';
    default:
      return '/';
  }
}

export function getPageFromPath(pathname: string): Page {
  if (pathname === '/') return 'accueil';
  if (pathname.startsWith('/athletes/') && pathname !== '/athletes') return 'athlete-profile';
  if (pathname.startsWith('/athletes')) return 'athletes';
  if (pathname.startsWith('/competitions')) return 'competitions';
  if (pathname.startsWith('/classements')) return 'classements';
  if (pathname.startsWith('/resultats/')) return 'resultats-detail';
  if (pathname.startsWith('/resultats')) return 'resultats';
  if (pathname.startsWith('/actualites/') && pathname !== '/actualites') return 'article';
  if (pathname.startsWith('/actualites')) return 'actualites';
  if (pathname.startsWith('/direct')) return 'direct';
  if (pathname.startsWith('/billetterie')) return 'billetterie';
  if (pathname.startsWith('/programme')) return 'programme';
  if (pathname.startsWith('/mentions')) return 'mentions';
  if (pathname.startsWith('/confidentialite')) return 'confidentialite';
  if (pathname.startsWith('/cookies')) return 'cookies';
  return 'accueil';
}

type NavigationContextValue = {
  currentPage: Page;
  setPage: (page: Page, opts?: NavOptions) => void;
  athleteFilter: string;
  setAthleteFilter: (f: string) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({
  children,
  athleteFilter,
  setAthleteFilter,
}: {
  children: ReactNode;
  athleteFilter: string;
  setAthleteFilter: (f: string) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = useMemo(() => getPageFromPath(location.pathname), [location.pathname]);

  const setPage = useCallback(
    (page: Page, opts?: NavOptions) => {
      const filter = opts?.athleteFilter ?? (page === 'athletes' ? athleteFilter : undefined);
      navigate(pageToPath(page, { ...opts, athleteFilter: filter }));
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [navigate, athleteFilter]
  );

  const value = useMemo(
    () => ({ currentPage, setPage, athleteFilter, setAthleteFilter }),
    [currentPage, setPage, athleteFilter, setAthleteFilter]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useAppNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useAppNavigation must be used within NavigationProvider');
  return ctx;
}
