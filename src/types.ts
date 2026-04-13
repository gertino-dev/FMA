export type Page =
  | 'accueil'
  | 'athletes'
  | 'competitions'
  | 'classements'
  | 'resultats'
  | 'resultats-detail'
  | 'article'
  | 'athlete-profile'
  | 'direct'
  | 'mentions'
  | 'confidentialite'
  | 'cookies'
  | 'billetterie'
  | 'programme'
  | 'actualites'
  | 'admin-login'
  | 'admin';

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  description?: string;
}

export interface Athlete {
  id: number;
  name: string;
  country: string;
  flag: string;
  discipline: string;
  rank: number;
  performance: string;
  image: string;
}

export interface Competition {
  id: number;
  title: string;
  location: string;
  date: string;
  category: string;
  status: string;
  image: string;
}
