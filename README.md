# FMA Front

Application web de la Federation Malagasy d'Athletisme (FMA).

## Lancer en local

Prerequis : Node.js 20+.

1. Installer les dependances :
   `npm install`
2. Lancer le serveur de developpement :
   `npm run dev`

## Déploiement (recommandé : 1 seul service)

Ce projet se déploie facilement comme **un seul service** :
- le frontend est buildé dans `dist/` via `npm run build`
- le backend `server/index.ts` sert `dist/` quand `NODE_ENV=production`

### Variables d’environnement (backend)

- `PORT` : port d’écoute (ex: `8080` sur Cloud Run)
- `NODE_ENV` : `production`
- `SESSION_SECRET` : secret de session (obligatoire en prod)
- `ADMIN_USERNAME` : login admin (optionnel, défaut `admin`)
- `ADMIN_PASSWORD` : mot de passe admin (si absent, login admin désactivé)
- `ADMIN_FORCE_RESET` : `true` pour réinitialiser le mot de passe depuis `ADMIN_PASSWORD`

### Docker (Cloud Run / Render / Fly.io)

Build et run en local :

```bash
docker build -t fma .
docker run --rm -p 8080:8080 \
  -e SESSION_SECRET="change-me" \
  -e ADMIN_USERNAME="admin" \
  -e ADMIN_PASSWORD="change-me-strong" \
  fma
```

Ensuite, déploie l’image sur ta plateforme.

### Attention : persistance des données

Le contenu est stocké dans :
- `data/db.json` (contenu du site)
- `data/sessions.sqlite` (sessions admin)
- `storage/uploads/images` (uploads)

Sur certaines plateformes (ex: Cloud Run), le disque est **éphémère** : sans volume persistant, tu peux perdre les données au redéploiement.
