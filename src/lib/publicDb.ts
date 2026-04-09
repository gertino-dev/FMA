import { apiFetch } from './api';
import { Competition } from '../types';

export type SponsorPublic = { id: string; name: string; logo: string; order: number };

export type PublicDb = {
  competitions: Competition[];
  results: Competition[];
  news: any[];
  athletes: any[];
  sponsors: SponsorPublic[];
  media: any[];
};

let cache: { at: number; data: PublicDb } | null = null;
let inflight: Promise<PublicDb> | null = null;

export async function getPublicDb(opts?: { force?: boolean; maxAgeMs?: number }): Promise<PublicDb> {
  const force = opts?.force ?? false;
  const maxAgeMs = opts?.maxAgeMs ?? 5_000;

  if (!force && cache && Date.now() - cache.at < maxAgeMs) return cache.data;
  if (!force && inflight) return inflight;

  inflight = apiFetch<PublicDb>('/api/public/db').then((data) => {
    cache = { at: Date.now(), data };
    inflight = null;
    return data;
  }).catch((e) => {
    inflight = null;
    throw e;
  });

  return inflight;
}

