FROM node:22-alpine AS base
WORKDIR /saferplace

FROM node:22-alpine AS build
WORKDIR /saferplace
ADD --link codebase.tar.gz ./
RUN NODE_ENV=development npm ci && NODE_ENV=development npm run compile && rm -rf node_modules && NODE_ENV=production npm ci

FROM base AS deployable
ENV NODE_ENV=production
COPY --from=build /saferplace .

ENTRYPOINT ["sh", "run.sh"]