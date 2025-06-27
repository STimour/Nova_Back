# Étape 1 : build
FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

# Étape 2 : exécution
FROM node:alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --production

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
