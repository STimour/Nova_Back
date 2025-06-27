# Étape 1 : Build (TypeScript + dépendances de dev)
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Build le projet (ex: tsc)
RUN npm run build

# Étape 2 : Exécution (production only)
FROM node:18-alpine

WORKDIR /app

# Copie uniquement les fichiers nécessaires à l'exécution
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Installe uniquement les dépendances de prod
RUN npm install --production

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
