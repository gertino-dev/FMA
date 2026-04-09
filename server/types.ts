export type CompetitionItem = {
  id: number;
  title: string;
  location: string;
  date: string;
  category: string;
  status: string;
  image: string;
};

export type ResultItem = CompetitionItem;

export type SubCompetitionV2 = {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
  category?: string;
  image?: string;
};

export type CompetitionGroupV2 = {
  id: string;
  title: string;
  season?: string;
  category: string; // National / International
  location: string;
  date: string; // range or label
  status: string;
  image: string;
  subCompetitions: SubCompetitionV2[];
};

export type SponsorItem = {
  id: string;
  name: string;
  logo: string;
  order: number;
};

export type HomeV2 = {
  hero: {
    slides: Array<{
      id: string;
      title: string;
      subtitle?: string;
      image: string;
      cta?: { label: string; to: string };
    }>;
    rotationMs: number;
    stats: Array<{ id: string; label: string; value: string }>;
  };
  youtube: {
    enabled: boolean;
    items: Array<{ id: string; title: string; youtubeId: string; poster: string }>;
  };
};

export type DirectV2 = {
  enabled: boolean;
  youtubeId: string;
  title: string;
  location: string;
  viewerCount: number | null;
  planning: Array<{ time: string; title: string; category?: string }>;
};

export type DbShape = {
  schemaVersion: number;
  meta?: {
    updatedAt: string;
    locale: string;
    season: string;
  };
  admin: {
    username: string;
    passwordHash: string | null;
    createdAt: string;
    updatedAt: string;
  };
  competitions: CompetitionItem[];
  competitionsV2?: CompetitionGroupV2[];
  results: ResultItem[];
  news: Array<Record<string, unknown>>;
  athletes: Array<Record<string, unknown>>;
  sponsors: SponsorItem[];
  media: Array<Record<string, unknown>>;

  // v2 additions (kept optional for backwards compatibility)
  home?: HomeV2;
  rankings?: { tables: Array<Record<string, unknown>> };
  resultDetailsById?: Record<string, unknown>;
  direct?: DirectV2;
  mediaImages?: Array<Record<string, unknown>>;
};

export type PublicDb = Pick<DbShape, 'competitions' | 'results' | 'news' | 'athletes' | 'sponsors' | 'media'>;
