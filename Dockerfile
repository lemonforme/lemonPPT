# syntax=docker/dockerfile:1
FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm -r build
RUN mkdir -p output

ENV NODE_ENV=production
EXPOSE 5300
CMD ["node", "apps/server/dist/index.js"]
