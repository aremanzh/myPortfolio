# Two stages: Node builds the static site, nginx serves it. Nothing from Node
# reaches the runtime image, so it holds no npm, no source and no secrets.
#
# Versions are pinned to the patch so the runtime is visible in a diff.
# Node 22 matches confession-api and CI.

# ── Build ────────────────────────────────────────────────────────────────────
FROM node:22.23.4-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
# Dev dependencies are the build tools (Vite, React Router CLI, Tailwind,
# sharp), so no --omit=dev here. sharp ships a prebuilt musl binary.
RUN npm ci

COPY . .

# `npm run build` runs scripts/content.mjs first (prebuild): it validates the
# CMS content, so a bad edit fails the image build, writes the resized WebP
# images and the sitemap, then prerenders every page to build/client.
RUN npm run build

# Precompress text assets once here; nginx serves the .gz with gzip_static
# instead of compressing on every request.
RUN find build/client -type f \
      \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.svg' \
         -o -name '*.json' -o -name '*.xml' -o -name '*.txt' -o -name '*.yml' \) \
      -size +1k -exec gzip -9 -k {} +

# ── Runtime ──────────────────────────────────────────────────────────────────
# Unprivileged variant: runs as uid 101, listens on 8080, writes only to /tmp.
# That is what lets compose.prod.yml run it read-only with no capabilities.
FROM nginxinc/nginx-unprivileged:1.30.6-alpine

ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/build/client /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
