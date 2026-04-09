export type AdminNews = {
  id: string;
  date: string;
  category: string;
  title: string;
  photo: string;
  hook: string;
  text: string;
};

export type AdminCard = {
  id: string;
  title: string;
  text: string;
  accent?: string;
};

export type AdminVideo = {
  id: string;
  title: string;
  youtubeId: string;
  poster: string;
};

export type AdminAthlete = {
  id: string;
  name: string;
  country: string;
  flag: string;
  discipline: string;
  rank: number;
  performance: string;
  image: string;
  bio: string;
};

export type AdminSubCompetition = {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
};

export type AdminCompetitionGroup = {
  id: string;
  category: string;
  title: string;
  date: string;
  location: string;
  status: string;
  image: string;
  subCompetitions: AdminSubCompetition[];
};

export type TicketTier = {
  id: string;
  type: string;
  price: string;
  features: string[];
};

export type TicketingConfig = {
  eliteBadgeTitle: string;
  eliteBadgeSubtitle: string;
  quote: string;
  tiers: TicketTier[];
};

export type ProgramEvent = {
  id: string;
  time: string;
  title: string;
  category: string;
};

export type ProgramSession = {
  id: string;
  session: string;
  time: string;
  events: ProgramEvent[];
};

export type ProgrammeConfig = {
  badgeTitle: string;
  badgeSubtitle: string;
  quote: string;
  sessions: ProgramSession[];
};

export type ResultRow = {
  id: string;
  dossard: string;
  rang: string;
  nomPrenoms: string;
  club: string;
  perf: string;
  points: string;
};

export type ResultEvent = {
  id: string;
  epreuve: string;
  categorie: string;
  genre: string;
  rows: ResultRow[];
};

export type ResultConfig = {
  meta: {
    title: string;
    date: string;
    location: string;
    category: string;
    status: string;
    image: string;
  };
  events: ResultEvent[];
};

export type ResultItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  status: string;
  image: string;
};

export type DirectUpcoming = {
  id: string;
  time: string;
  title: string;
  category: string;
};

export type AdminContent = {
  home: {
    heroBackgrounds: string[];
  };
  news: AdminNews[];
  dailyFeature: {
    nature: string;
    title: string;
    text: string;
    cards: AdminCard[];
  };
  videos: AdminVideo[];
  athletes: AdminAthlete[];
  competitions: AdminCompetitionGroup[];
  ticketingTemplate: TicketingConfig;
  programmeTemplate: ProgrammeConfig;
  ticketingByEventId: Record<string, TicketingConfig>;
  programmeByEventId: Record<string, ProgrammeConfig>;
  resultsByEventId: Record<string, ResultConfig>;
  direct: {
    title: string;
    subtitle: string;
    heroImage: string;
    viewerCountLabel: string;
    liveTitle: string;
    liveLocation: string;
    upcoming: DirectUpcoming[];
    promoQuote: string;
    ctaLabel: string;
  };
};

const KEY = 'fma_admin_content_v1';

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getDefaultAdminContent(): AdminContent {
  return {
    home: {
      heroBackgrounds: ['/image/image%20(6).png', '/image/image%20(1).png', '/image/image%20(3).png', '/image/image%20(2).png'],
    },
    news: [
      {
        id: uid('news'),
        date: '07 avril 2026',
        category: 'Compétition',
        title: "Sidonie Fiadanantsoa brille aux Championnats d'Afrique",
        photo: '/image/image%20(1).png',
        hook: "Une performance historique qui marque un tournant pour l'athlétisme malagasy cette saison.",
        text:
          "L'événement qui s'est déroulé ce week-end a tenu toutes ses promesses, offrant aux spectateurs des moments d'une intensité rare.\n\nImpact Communautaire\nPlus de 5000 jeunes ont été inspirés par cette performance à travers les différentes ligues régionales.\n\nObjectif 2026\nCette étape est cruciale dans la préparation des prochains championnats d'Afrique.",
      },
    ],
    dailyFeature: {
      nature: 'Athlète en vedette',
      title: 'Sidonie Fiadanantsoa',
      text:
        "La championne de Madagascar du 100m haies continue de porter haut les couleurs nationales sur la scène internationale. Découvrez son parcours et ses prochains défis.",
      cards: [
        { id: uid('card'), title: 'Vitesse Max', text: '38.4 km/h', accent: 'performance' },
        { id: uid('card'), title: 'Pays', text: 'Madagascar', accent: 'info' },
      ],
    },
    videos: [
      { id: uid('vid'), title: 'Highlights 2026', youtubeId: '', poster: '/image/image%20(1).png' },
    ],
    athletes: [],
    competitions: [],
    ticketingTemplate: {
      eliteBadgeTitle: 'Événement Élite',
      eliteBadgeSubtitle: 'Places limitées pour la tribune officielle.',
      quote:
        "Vivez l'intensité de l'athlétisme malagasy au plus près de l'action. Réservez vos places dès maintenant pour cet événement exceptionnel.",
      tiers: [
        { id: uid('tier'), type: 'Pelouse', price: '5,000 Ar', features: ['Accès zone debout', 'Proximité piste', 'Ambiance populaire'] },
        { id: uid('tier'), type: 'Tribune', price: '15,000 Ar', features: ['Siège numéroté', "Vue d'ensemble", 'Accès buvette'] },
        { id: uid('tier'), type: 'VIP', price: '50,000 Ar', features: ['Espace climatisé', 'Cocktail inclus', 'Rencontre athlètes'] },
      ],
    },
    programmeTemplate: {
      badgeTitle: 'Programme Officiel',
      badgeSubtitle: 'Horaires sujets à modification.',
      quote: 'Découvrez le déroulement détaillé de la compétition. Des séries aux finales, ne manquez aucun moment fort.',
      sessions: [
        {
          id: uid('session'),
          session: 'Matinée',
          time: '08:00 - 12:00',
          events: [
            { id: uid('evt'), time: '08:30', title: '100m Haies Femmes - Séries', category: 'Course' },
            { id: uid('evt'), time: '09:15', title: 'Saut en Hauteur Hommes - Qualifications', category: 'Saut' },
          ],
        },
      ],
    },
    ticketingByEventId: {},
    programmeByEventId: {},
    resultsByEventId: {},
    direct: {
      title: 'Direct Live',
      subtitle: "Suivez en temps réel les compétitions majeures de l'athlétisme malagasy.",
      heroImage: '/image/image%20(6).png',
      viewerCountLabel: '1,245 spectateurs',
      liveTitle: 'Championnats de Madagascar - Jour 2',
      liveLocation: "Stade d'Alarobia, Antananarivo",
      upcoming: [
        { id: uid('up'), title: 'Finale 100m Hommes', time: '14:30', category: 'Sprint' },
        { id: uid('up'), title: 'Saut en Longueur Femmes', time: '15:15', category: 'Saut' },
      ],
      promoQuote: "Suivez l'excellence, vivez l'émotion de l'athlétisme malagasy en direct.",
      ctaLabel: "S'abonner aux alertes",
    },
  };
}

function migrate(raw: any): AdminContent {
  // v1 -> v2 migration: attach global ticketing/programme/results into templates + maps
  const base: AdminContent = {
    ...getDefaultAdminContent(),
    ...raw,
  };

  // If old shapes exist, promote them.
  const maybeTicketing = raw?.ticketing;
  const maybeProgramme = raw?.programme;
  const maybeResults = raw?.results;

  if (maybeTicketing && !raw?.ticketingTemplate) base.ticketingTemplate = maybeTicketing as TicketingConfig;
  if (maybeProgramme && !raw?.programmeTemplate) base.programmeTemplate = maybeProgramme as ProgrammeConfig;

  // Results migration: old had {items, detailsById}
  if (maybeResults && !raw?.resultsByEventId) {
    const items: ResultItem[] = Array.isArray(maybeResults.items) ? maybeResults.items : [];
    const detailsById: Record<string, any> = maybeResults.detailsById ?? {};
    const map: Record<string, ResultConfig> = {};
    for (const it of items) {
      map[it.id] = {
        meta: {
          title: it.title,
          date: it.date,
          location: it.location,
          category: it.category,
          status: it.status,
          image: it.image,
        },
        events: (detailsById[it.id]?.events ?? []) as ResultEvent[],
      };
    }
    base.resultsByEventId = map;
  }

  // Ensure required keys exist
  base.ticketingByEventId = base.ticketingByEventId ?? {};
  base.programmeByEventId = base.programmeByEventId ?? {};
  base.resultsByEventId = base.resultsByEventId ?? {};
  base.ticketingTemplate = base.ticketingTemplate ?? getDefaultAdminContent().ticketingTemplate;
  base.programmeTemplate = base.programmeTemplate ?? getDefaultAdminContent().programmeTemplate;

  // Remove legacy keys to avoid confusion
  delete (base as any).ticketing;
  delete (base as any).programme;
  delete (base as any).results;

  return base;
}

export function loadAdminContent(): AdminContent {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return getDefaultAdminContent();
    return migrate(JSON.parse(raw));
  } catch {
    return getDefaultAdminContent();
  }
}

export function saveAdminContent(next: AdminContent): void {
  localStorage.setItem(KEY, JSON.stringify(next));
}

