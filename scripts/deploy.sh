#!/usr/bin/env bash
# Deploy a published image to this host, with automatic rollback.
#
# Usage: scripts/deploy.sh <git-sha>
#
# Runs ON THE DROPLET (as the `deploy` user), from the directory that holds
# docker-compose.yml and Caddyfile (the CI job copies them over before calling
# this). Also used for manual rollback: pass an older SHA.
#
#   1. pull ghcr.io/kdgerona/portfolio-v2:<sha>   (nothing changes if this fails)
#   2. docker compose up -d with IMAGE_TAG=<sha>
#   3. wait for the `portfolio` container to report healthy
#   4. on failure: bring the previous SHA back up, then exit non-zero
#   5. on success: record <sha> in .env and prune images to current + previous
#
# State lives in .env (IMAGE_TAG=<sha>), which docker compose reads on its own,
# so plain `docker compose ps/logs` on the host always matches what is deployed.
set -euo pipefail

IMAGE_REPO="${IMAGE_REPO:-ghcr.io/kdgerona/portfolio-v2}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-180}" # seconds
HEALTH_POLL="${HEALTH_POLL:-3}"         # seconds

log() { printf '[deploy %s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
die() { log "ERROR: $*"; exit 1; }

[[ $# -eq 1 && $1 =~ ^[0-9a-f]{40}$ ]] || die "usage: $0 <40-char git sha>"
NEW_TAG="$1"

cd "$(dirname "${BASH_SOURCE[0]}")/.."
[[ -f docker-compose.yml ]] || die "docker-compose.yml not found in $PWD"

# Never run two deploys (CI + a manual one, say) at once.
exec 9>.deploy.lock
flock -n 9 || die "another deploy is already running"

PREV_TAG=""
if [[ -f .env ]]; then
  PREV_TAG="$(sed -n 's/^IMAGE_TAG=//p' .env | tail -n 1)"
fi

compose_up() { IMAGE_TAG="$1" docker compose up -d --remove-orphans; }

# Returns 0 once the portfolio container is healthy, 1 if it goes unhealthy,
# stops running, or does not become healthy within HEALTH_TIMEOUT.
wait_healthy() {
  local deadline=$((SECONDS + HEALTH_TIMEOUT)) cid state health
  while ((SECONDS < deadline)); do
    cid="$(IMAGE_TAG="$1" docker compose ps -q portfolio 2>/dev/null || true)"
    if [[ -n $cid ]]; then
      state="$(docker inspect --format '{{.State.Status}}' "$cid" 2>/dev/null || true)"
      health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$cid" 2>/dev/null || true)"
      case "$health" in
        healthy) return 0 ;;
        unhealthy) log "portfolio reported unhealthy"; return 1 ;;
      esac
      if [[ $state == exited || $state == dead ]]; then
        log "portfolio container is $state"
        return 1
      fi
    fi
    sleep "$HEALTH_POLL"
  done
  log "timed out after ${HEALTH_TIMEOUT}s waiting for portfolio to be healthy"
  return 1
}

rollback() {
  if [[ -z $PREV_TAG || $PREV_TAG == "$NEW_TAG" ]]; then
    log "no previous different release recorded; nothing to roll back to"
    return 1
  fi
  log "rolling back to $PREV_TAG"
  compose_up "$PREV_TAG" || true
  if wait_healthy "$PREV_TAG"; then
    log "rollback OK: $PREV_TAG is healthy again"
  else
    log "rollback FAILED: $PREV_TAG is not healthy either; manual intervention needed"
  fi
}

log "deploying $IMAGE_REPO:$NEW_TAG (previous: ${PREV_TAG:-none})"

# A failed pull leaves the running release untouched.
IMAGE_TAG="$NEW_TAG" docker compose pull portfolio

if compose_up "$NEW_TAG" && wait_healthy "$NEW_TAG"; then
  printf 'IMAGE_TAG=%s\n' "$NEW_TAG" > .env.tmp && mv .env.tmp .env
  log "deploy OK: $NEW_TAG is healthy"
else
  log "deploy of $NEW_TAG FAILED"
  IMAGE_TAG="$NEW_TAG" docker compose logs --tail 40 portfolio || true
  rollback || true
  exit 1
fi

# Keep only the current and previous release on the 10 GB disk.
log "pruning old images (keeping $NEW_TAG and ${PREV_TAG:-none})"
docker image ls --format '{{.Repository}}:{{.Tag}}' "$IMAGE_REPO" |
  grep -vE ":(${NEW_TAG}|${PREV_TAG:-__none__})$" |
  xargs -r docker rmi 2>/dev/null || true
docker image prune -f >/dev/null || true
log "done"
