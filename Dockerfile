# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.13.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
RUN corepack enable pnpm

# Étape deps : installe TOUTES les dépendances (dev incluses) nécessaires au
# build. Isolée pour profiter du cache tant que le lockfile ne change pas.
FROM base AS deps
ENV HUSKY=0
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Étape build : compile l'application Next.js en mode standalone.
# NEXT_PUBLIC_API_URL est inliné dans le bundle client au moment du build : il
# doit donc être fourni ici en ARG (et non au runtime).
FROM base AS build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Étape finale : image de production minimale servie par le serveur Node
# autonome généré par Next (.next/standalone).
FROM base AS final

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

USER node

# Le serveur autonome embarque déjà ses node_modules ; on copie le résultat du
# build ainsi que les assets statiques et publics.
COPY --chown=node:node --from=build /usr/src/app/public ./public
COPY --chown=node:node --from=build /usr/src/app/.next/standalone ./
COPY --chown=node:node --from=build /usr/src/app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
