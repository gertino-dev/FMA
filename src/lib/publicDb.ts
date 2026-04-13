import { COMPETITIONS, RESULTS, NEWS, ATHLETES, SPONSORS, MEDIA } from '../constants';

export type SponsorPublic = { id: string; name: string; logo: string; order: number };

export type PublicDb = {
  competitions: any[];
  results: any[];
  news: any[];
  athletes: any[];
  sponsors: SponsorPublic[];
  media: any[];
};

let cache: { at: number; data: PublicDb } | null = null;

export async function getPublicDb(opts?: { force?: boolean; maxAgeMs?: number }): Promise<PublicDb> {
  const force = opts?.force ?? false;
  const maxAgeMs = opts?.maxAgeMs ?? 5_000;

  if (!force && cache && Date.now() - cache.at < maxAgeMs) return cache.data;

  const data: PublicDb = {
    competitions: COMPETITIONS,
    results: RESULTS,
    news: NEWS,
    athletes: ATHLETES,
    sponsors: SPONSORS,
    media: MEDIA,
  };

  cache = { at: Date.now(), data };
  return data;
}

