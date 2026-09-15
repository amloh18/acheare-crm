# =============================================================================
# Achare Server — Production Image
# =============================================================================
#
# Builds the combined server + frontend image. The NestJS server serves both
# the API and the compiled React SPA from dist/front, so the browser talks to
# one origin and there is no CORS surface.
#
# The worker uses this same image with a different command (yarn worker:prod).
# Do not add a separate nginx or front container.
#
# Build:
#   docker build -f deploy/docker/server.Dockerfile \
#     --build-arg ACHARE_VERSION=0.1.0 \
#     -t ghcr.io/amloh18/achare-server:0.1.0 \
#     twenty-upstream/
#
# The build context is the repository root (twenty-upstream/), because the
# Dockerfile needs access to multiple packages.

# ---------------------------------------------------------------------------
# Stage 1: Install front-end dependencies
# ---------------------------------------------------------------------------
FROM node:24.19.0-alpine3.23 AS front-deps

WORKDIR /app

COPY ./package.json ./yarn.lock ./.yarnrc.yml ./tsconfig.base.json ./nx.json /app/
COPY ./.yarn/releases /app/.yarn/releases
COPY ./.yarn/patches /app/.yarn/patches

COPY ./packages/twenty-ui/package.json /app/packages/twenty-ui/
COPY ./packages/twenty-shared/package.json /app/packages/twenty-shared/
COPY ./packages/twenty-front/package.json /app/packages/twenty-front/
COPY ./packages/twenty-front-component-renderer/package.json /app/packages/twenty-front-component-renderer/
COPY ./packages/twenty-sdk/package.json /app/packages/twenty-sdk/
COPY ./packages/twenty-client-sdk/package.json /app/packages/twenty-client-sdk/

RUN yarn workspaces focus twenty twenty-front twenty-front-component-renderer twenty-ui twenty-shared twenty-sdk twenty-client-sdk \
    && yarn cache clean \
    && npx nx reset

# ---------------------------------------------------------------------------
# Stage 2: Install server dependencies
# ---------------------------------------------------------------------------
FROM node:24.19.0-alpine3.23 AS server-deps

WORKDIR /app

COPY ./package.json ./yarn.lock ./.yarnrc.yml ./tsconfig.base.json ./nx.json /app/
COPY ./.yarn/releases /app/.yarn/releases
COPY ./.yarn/patches /app/.yarn/patches

COPY ./packages/twenty-emails/package.json /app/packages/twenty-emails/
COPY ./packages/twenty-server/package.json /app/packages/twenty-server/
COPY ./packages/twenty-server/patches /app/packages/twenty-server/patches
COPY ./packages/twenty-shared/package.json /app/packages/twenty-shared/
COPY ./packages/twenty-client-sdk/package.json /app/packages/twenty-client-sdk/

RUN yarn workspaces focus twenty twenty-server twenty-emails twenty-shared twenty-client-sdk \
    && yarn cache clean \
    && npx nx reset

# ---------------------------------------------------------------------------
# Stage 3: Build the server
# ---------------------------------------------------------------------------
FROM server-deps AS server-build

COPY ./packages/twenty-emails /app/packages/twenty-emails
COPY ./packages/twenty-shared /app/packages/twenty-shared
COPY ./packages/twenty-client-sdk /app/packages/twenty-client-sdk
COPY ./packages/twenty-server /app/packages/twenty-server

RUN npx nx run twenty-server:lingui:extract \
    && npx nx run twenty-server:lingui:compile \
    && npx nx run twenty-emails:lingui:extract \
    && npx nx run twenty-emails:lingui:compile

RUN npx nx run twenty-server:build

# Strip type declarations and compiled tests (not needed at runtime).
# Source maps are kept for Sentry uploads.
RUN find /app/packages/twenty-server/dist -name '*.d.ts' -delete \
    && rm -rf /app/packages/twenty-server/dist/packages/twenty-server/test

RUN yarn workspaces focus --production twenty-emails twenty-shared twenty-client-sdk twenty-server

# ---------------------------------------------------------------------------
# Stage 4: Build the frontend
# ---------------------------------------------------------------------------
FROM front-deps AS front-build

COPY ./packages/twenty-front /app/packages/twenty-front
COPY ./packages/twenty-front-component-renderer /app/packages/twenty-front-component-renderer
COPY ./packages/twenty-ui /app/packages/twenty-ui
COPY ./packages/twenty-shared /app/packages/twenty-shared
COPY ./packages/twenty-sdk /app/packages/twenty-sdk
COPY ./packages/twenty-client-sdk /app/packages/twenty-client-sdk

RUN npx nx run twenty-front:lingui:extract \
    && npx nx run twenty-front:lingui:compile

# Use pre-built frontend from host if available (saves ~5 min build).
RUN if [ -d /app/packages/twenty-front/build ]; then \
        echo "Using pre-built frontend from host"; \
    else \
        NODE_OPTIONS="--max-old-space-size=8192" npx nx run twenty-front:build; \
    fi

# ---------------------------------------------------------------------------
# Stage 5: Final production image (server + frontend)
# ---------------------------------------------------------------------------
FROM node:24.19.0-alpine3.23 AS achare-server

# Security-patched Alpine libraries (psql, curl link these; Node bundles its own).
RUN apk add --no-cache \
    'curl>=8.20.0-r0' \
    'nghttp2-libs>=1.69.0-r0' \
    'libcrypto3>=3.5.8-r0' \
    'libssl3>=3.5.8-r0' \
    'postgresql18-client>=18.5-r0' \
    jq

# Copy the entrypoint from the upstream package.
COPY ./packages/twenty-docker/twenty/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

WORKDIR /app/packages/twenty-server

ARG ACHARE_VERSION=0.1.0
ENV APP_VERSION=${ACHARE_VERSION}
ENV NODE_ENV=production

# --- Workspace root ---
COPY --chown=1000 --from=server-build /app/package.json /app/yarn.lock /app/.yarnrc.yml /app/
COPY --chown=1000 --from=server-build /app/tsconfig.base.json /app/nx.json /app/
COPY --chown=1000 --from=server-build /app/.yarn /app/.yarn
COPY --chown=1000 --from=server-build /app/node_modules /app/node_modules

# --- Server package (compiled dist + package.json only, no src/) ---
COPY --chown=1000 --from=server-build /app/packages/twenty-server/package.json /app/packages/twenty-server/
COPY --chown=1000 --from=server-build /app/packages/twenty-server/dist /app/packages/twenty-server/dist
COPY --chown=1000 --from=server-build /app/packages/twenty-server/patches /app/packages/twenty-server/patches
COPY --chown=1000 --from=server-build /app/packages/twenty-server/scripts /app/packages/twenty-server/scripts
RUN chmod +x /app/packages/twenty-server/scripts/command-background.sh

# --- Workspace packages ---
COPY --chown=1000 --from=server-build /app/packages/twenty-shared/package.json /app/packages/twenty-shared/
COPY --chown=1000 --from=server-build /app/packages/twenty-shared/dist /app/packages/twenty-shared/dist
COPY --chown=1000 --from=server-build /app/packages/twenty-emails/package.json /app/packages/twenty-emails/
COPY --chown=1000 --from=server-build /app/packages/twenty-emails/dist /app/packages/twenty-emails/dist
COPY --chown=1000 --from=server-build /app/packages/twenty-client-sdk/package.json /app/packages/twenty-client-sdk/
COPY --chown=1000 --from=server-build /app/packages/twenty-client-sdk/dist /app/packages/twenty-client-sdk/dist

# --- Frontend SPA (served by the same Node process) ---
COPY --chown=1000 --from=front-build /app/packages/twenty-front/build /app/packages/twenty-server/dist/front

LABEL org.opencontainers.image.source=https://github.com/amloh18/acheare-crm
LABEL org.opencontainers.image.description="Achare server image (backend + frontend, single origin)."

# Remove unused components the scanner flags.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
      /usr/local/include/node \
    && find /app/node_modules -type d -name example -prune -exec rm -rf {} +

RUN mkdir -p /app/.local-storage /app/packages/twenty-server/.local-storage \
    && chown 1000:1000 /app/.local-storage /app/packages/twenty-server/.local-storage

USER 1000

EXPOSE 3000

CMD ["node", "dist/main"]
ENTRYPOINT ["/app/entrypoint.sh"]
