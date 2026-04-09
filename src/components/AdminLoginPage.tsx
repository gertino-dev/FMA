import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User } from 'lucide-react';
import { Page } from '../types';
import { apiFetch } from '../lib/api';

interface AdminLoginPageProps {
  setPage: (p: Page) => void;
}

export const AdminLoginPage = ({ setPage }: AdminLoginPageProps) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ isAdmin: boolean }>('/api/admin/me')
      .then((r) => {
        if (r.isAdmin) setPage('admin');
      })
      .catch(() => {});
  }, [setPage]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      setPage('admin');
    } catch (err: any) {
      setError(err?.message ?? 'Erreur');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-3xl mx-auto px-6 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl sm:text-6xl font-display font-black italic uppercase tracking-tighter mb-4">
          Log in
        </h1>
        <p className="text-text-muted text-base sm:text-lg max-w-2xl border-l-4 border-brand-primary pl-6">
          Connexion sécurisée.
        </p>
      </motion.div>

      <form onSubmit={onSubmit} className="glass-card p-8">
        <div className="grid gap-6">
          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Identifiant</span>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg-main border-2 border-border-main py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary text-text-main -skew-x-12"
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Mot de passe</span>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-main border-2 border-border-main py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary text-text-main -skew-x-12"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error && (
            <div className="border-l-4 border-brand-primary bg-bg-surface p-4 text-sm">
              <p className="font-black uppercase tracking-widest text-[10px] text-text-muted mb-1">Erreur</p>
              <p className="text-text-main">{error}</p>
              {error === 'admin_not_initialized' && (
                <p className="text-text-muted mt-2 text-xs">
                  Le mot de passe admin n’est pas initialisé. Configure `ADMIN_PASSWORD` côté serveur, puis redémarre
                  l’API.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button disabled={submitting} className="btn-primary px-10 py-3 text-sm disabled:opacity-60">
              {submitting ? 'Connexion...' : 'Se connecter'}
            </button>
            <button
              type="button"
              className="btn-outline px-10 py-3 text-sm"
              onClick={() => setPage('accueil')}
            >
              Retour au site
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

