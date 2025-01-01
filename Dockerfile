# docker build . --secret id=github_token,env=GITHUB_TOKEN -t template:dev && docker run --rm -it --entrypoint bash template:dev

FROM node:22.12-bullseye-slim AS base

RUN apt-get update && apt-get install -y openssl python3 make g++ \
  && npm install -g pnpm@9.15

WORKDIR /app

# I wish I could restrict that to all_deps, but sadly that's needed to install kysely in the pre-upgrade image
RUN --mount=type=secret,id=github_token \
  echo -e "@pushpress:registry=https://npm.pkg.github.com/PushPress\n//npm.pkg.github.com/:_authToken=$(cat /run/secrets/github_token)" > .npmrc

###

FROM base AS all_deps

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

###

FROM all_deps AS builder

COPY . .

RUN pnpm build:web
RUN pnpm build

###

# re-using the layer that has installed allows re-using pnpm's cache
FROM all_deps AS prod_deps

# only production dependencies, skip husky install
RUN rm -rf node_modules && pnpm install --prod --frozen-lockfile --ignore-scripts

###

FROM base

COPY package.json .

COPY --from=prod_deps /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.config ./.config
COPY --from=builder /app/spa ./spa


ARG GIT_REPOSITORY_URL
ENV DD_GIT_REPOSITORY_URL=${GIT_REPOSITORY_URL}

ARG GIT_COMMIT_SHA
ENV DD_VERSION=${GIT_COMMIT_SHA}
ENV DD_GIT_COMMIT_SHA=${GIT_COMMIT_SHA}

ENV DD_SERVICE=${APP_NAME}

CMD ["pnpm", "start:prod"]
