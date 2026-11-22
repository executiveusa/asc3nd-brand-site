# Hostinger-ready independent deployment for the existing ASC3ND Next.js app.
# No DNS, production hosting, or secrets are changed by this file.
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-bookworm-slim
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app
RUN groupadd --system asc3nd && useradd --system --gid asc3nd --home /app asc3nd
COPY --from=build --chown=asc3nd:asc3nd /app/package.json ./package.json
COPY --from=build --chown=asc3nd:asc3nd /app/node_modules ./node_modules
COPY --from=build --chown=asc3nd:asc3nd /app/.next ./.next
COPY --from=build --chown=asc3nd:asc3nd /app/public ./public
COPY --from=build --chown=asc3nd:asc3nd /app/next.config.ts ./next.config.ts
COPY --from=build --chown=asc3nd:asc3nd /app/config ./config
USER asc3nd
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=8s --start-period=60s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/standby').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000", "-H", "0.0.0.0"]
