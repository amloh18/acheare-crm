# =============================================================================
# Achare Landing — Marketing Site Image
# =============================================================================
#
# Serves the static marketing page (index.html + assets) on a lightweight
# Node HTTP server. No framework — just the files.
#
# Build:
#   docker build -f deploy/docker/landing.Dockerfile \
#     --build-arg ACHARE_VERSION=0.1.0 \
#     -t ghcr.io/amloh18/achare-landing:0.1.0 \
#     twenty-upstream/

FROM node:24.19.0-alpine3.23

RUN apk add --no-cache 'curl>=8.20.0-r0'

WORKDIR /app

# Only copy the landing page files — nothing from the monorepo.
COPY landing/ /app/

ARG ACHARE_VERSION=0.1.0
ENV NODE_ENV=production
ENV PORT=4000
ENV ACHARE_VERSION=${ACHARE_VERSION}

LABEL org.opencontainers.image.source=https://github.com/amloh18/acheare-crm
LABEL org.opencontainers.image.description="Achare marketing landing page."

EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
    CMD curl -fsS http://localhost:4000/ >/dev/null || exit 1

CMD ["node", "serve.mjs"]
