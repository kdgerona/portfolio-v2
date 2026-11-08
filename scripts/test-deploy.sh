#!/usr/bin/env bash
# Offline test of scripts/deploy.sh using a fake `docker` on PATH (no daemon
# needed). Covers: first deploy, upgrade + prune, failing healthcheck -> rollback,
# failing first deploy (nothing to roll back to), and bad input.
#
# Usage: scripts/test-deploy.sh
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$WORK/app/scripts" "$WORK/bin"
cp "$SRC/scripts/deploy.sh" "$WORK/app/scripts/"
touch "$WORK/app/docker-compose.yml"

A=$(printf 'a%.0s' {1..40})
B=$(printf 'b%.0s' {1..40})
C=$(printf 'c%.0s' {1..40})

# Fake docker: state is files under $FAKE. Tags listed in $FAKE/bad are
# reported "unhealthy"; everything else becomes "healthy".
cat > "$WORK/bin/docker" <<'SHIM'
#!/usr/bin/env bash
echo "  + docker $*" >&2
case "$1" in
  compose)
    shift
    case "$1" in
      pull) echo "${IMAGE_TAG}" >> "$FAKE/images" ;;
      up) echo "${IMAGE_TAG}" > "$FAKE/running" ;;
      ps) echo cid123 ;;
      logs) echo "(fake container logs)" ;;
    esac ;;
  inspect)
    if [[ "$*" == *State.Status* ]]; then echo running
    elif grep -qx "$(cat "$FAKE/running")" "$FAKE/bad" 2>/dev/null; then echo unhealthy
    else echo healthy; fi ;;
  image)
    if [[ $2 == ls ]]; then sort -u "$FAKE/images" | sed 's|^|ghcr.io/kdgerona/portfolio-v2:|'; fi ;;
  rmi)
    shift; for i in "$@"; do sed -i "\|^${i##*:}\$|d" "$FAKE/images"; done ;;
esac
SHIM
chmod +x "$WORK/bin/docker"

export FAKE="$WORK/fake" PATH="$WORK/bin:$PATH" HEALTH_TIMEOUT=5 HEALTH_POLL=1
mkdir -p "$FAKE"; : > "$FAKE/images"; : > "$FAKE/bad"
DEPLOY="$WORK/app/scripts/deploy.sh"
fails=0
check() { # check <description> <expected> <actual>
  if [[ $2 == "$3" ]]; then echo "PASS: $1"; else echo "FAIL: $1 (expected '$2', got '$3')"; fails=$((fails + 1)); fi
}
tag() { sed -n 's/^IMAGE_TAG=//p' "$WORK/app/.env" 2>/dev/null || true; }

echo "== 1. first deploy of A"
"$DEPLOY" "$A"
check "A recorded in .env" "$A" "$(tag)"

echo "== 2. upgrade to B (A kept as previous)"
"$DEPLOY" "$B"
check "B recorded in .env" "$B" "$(tag)"

echo "== 3. upgrade to C (A pruned, B kept)"
"$DEPLOY" "$C"
check "C recorded in .env" "$C" "$(tag)"
check "images kept = B and C" "$B $C" "$(sort -u "$FAKE/images" | tr '\n' ' ' | sed 's/ $//')"

echo "== 4. deploy D with failing healthcheck -> rolls back to C"
D=$(printf 'd%.0s' {1..40}); echo "$D" > "$FAKE/bad"
if "$DEPLOY" "$D"; then check "deploy of D exits non-zero" nonzero zero; else check "deploy of D exits non-zero" nonzero nonzero; fi
check "running release rolled back to C" "$C" "$(cat "$FAKE/running")"
check ".env still C" "$C" "$(tag)"

echo "== 5. bad input is rejected"
if "$DEPLOY" latest 2>/dev/null; then check "non-sha rejected" nonzero zero; else check "non-sha rejected" nonzero nonzero; fi

echo "== 6. first-ever deploy that is unhealthy (nothing to roll back to)"
rm -f "$WORK/app/.env"
if "$DEPLOY" "$D"; then check "exits non-zero" nonzero zero; else check "exits non-zero" nonzero nonzero; fi
check ".env not written" "" "$(tag)"

if ((fails == 0)); then echo "ALL PASSED"; else echo "$fails FAILED"; exit 1; fi
