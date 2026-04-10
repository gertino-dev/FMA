FROM node:20-bookworm-slim

# Native deps for better-sqlite3
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build frontend for production (server will serve /dist when NODE_ENV=production)
RUN npm run build

# Ensure runtime-writable directories exist (db + uploads + sqlite sessions)
RUN mkdir -p /app/data /app/storage/uploads/images

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Runs the Express API (and serves /dist in production)
CMD ["npm","run","start:api"]
