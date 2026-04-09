import { z } from 'zod';

const nonEmpty = z.string().min(1);

export const competitionSchema = z.object({
  id: z.number().int().positive(),
  title: nonEmpty,
  location: nonEmpty,
  date: nonEmpty,
  category: nonEmpty,
  status: nonEmpty,
  image: nonEmpty,
});

export const subCompetitionV2Schema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  date: nonEmpty,
  location: nonEmpty,
  status: nonEmpty,
  category: z.string().optional(),
  image: z.string().optional(),
});

export const competitionGroupV2Schema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  season: z.string().optional(),
  category: nonEmpty,
  location: nonEmpty,
  date: nonEmpty,
  status: nonEmpty,
  image: nonEmpty,
  subCompetitions: z.array(subCompetitionV2Schema),
});

export const sponsorSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  logo: nonEmpty,
  order: z.number().int().nonnegative(),
});

export const loginSchema = z.object({
  username: nonEmpty,
  password: z.string().min(8),
});

export const homeSchema = z.object({
  hero: z.object({
    slides: z.array(
      z.object({
        id: nonEmpty,
        title: nonEmpty,
        subtitle: z.string().optional(),
        image: nonEmpty,
        cta: z
          .object({
            label: nonEmpty,
            to: nonEmpty,
          })
          .optional(),
      })
    ),
    rotationMs: z.number().int().positive(),
    stats: z.array(z.object({ id: nonEmpty, label: nonEmpty, value: nonEmpty })),
  }),
  youtube: z.object({
    enabled: z.boolean(),
    items: z.array(z.object({ id: nonEmpty, title: nonEmpty, youtubeId: z.string(), poster: nonEmpty })),
  }),
});

export const newsPostSchema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  slug: nonEmpty,
  category: nonEmpty,
  excerpt: z.string().default(''),
  coverImage: nonEmpty,
  contentMarkdown: z.string().default(''),
  publishedAt: nonEmpty,
  updatedAt: nonEmpty,
  status: z.enum(['draft', 'published']),
});

export const athleteSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  country: nonEmpty,
  flag: z.string().default(''),
  disciplines: z.array(nonEmpty).default([]),
  image: nonEmpty,
  bio: z.string().default(''),
});

export const rankingRowSchema = z.object({
  id: nonEmpty,
  rank: z.number().int().positive(),
  athleteId: nonEmpty,
  country: nonEmpty,
  discipline: nonEmpty,
  points: z.number().int().nonnegative(),
  trend: z.enum(['up', 'down', 'stable']),
  delta: z.number().int().optional(),
});

export const rankingTableSchema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  updatedAt: nonEmpty,
  rows: z.array(rankingRowSchema),
});

export const resultItemSchema = competitionSchema;

export const resultEventRowSchema = z.object({
  dossard: nonEmpty,
  rang: nonEmpty,
  nomPrenoms: nonEmpty,
  club: z.string().default(''),
  perf: nonEmpty,
  points: z.string().optional(),
});

export const resultEventSchema = z.object({
  epreuve: nonEmpty,
  categorie: nonEmpty,
  genre: nonEmpty,
  rows: z.array(resultEventRowSchema),
});

export const directSchema = z.object({
  enabled: z.boolean(),
  youtubeId: z.string(),
  title: nonEmpty,
  location: z.string().default(''),
  viewerCount: z.number().int().nullable(),
  planning: z.array(z.object({ time: nonEmpty, title: nonEmpty, category: z.string().optional() })),
});

export const mediaImageSchema = z.object({
  id: nonEmpty,
  url: nonEmpty,
  filename: nonEmpty,
  createdAt: nonEmpty,
  size: z.number().int().nonnegative().optional(),
  mime: z.string().optional(),
});

