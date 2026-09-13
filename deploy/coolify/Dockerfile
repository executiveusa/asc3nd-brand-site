FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=80
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=build /app ./
EXPOSE 80
CMD ["npx", "next", "start", "-p", "80"]
