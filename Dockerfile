# ---------- Build stage ----------
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente y config
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build


# ---------- Runtime stage ----------
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

# Copiar solo lo necesario
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Cloud Run inyecta PORT
EXPOSE 8080

CMD ["node", "dist/server.js"]
