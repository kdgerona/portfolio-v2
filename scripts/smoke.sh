#!/usr/bin/env bash
# Post-deploy smoke check: each URL must return HTTP 200 and contain the marker.
# Usage: scripts/smoke.sh [base_url] [marker]
#   defaults: https://kdgerona.com  "Kevin Dave Gerona"
# Env: SMOKE_ATTEMPTS (default 10), SMOKE_DELAY seconds between tries (default 6).
# Marker is the site owner's name: it is in <title> and visible content on every
# page, and only changes if the site is rebranded.
set -euo pipefail

BASE="${1:-https://kdgerona.com}"
BASE="${BASE%/}"
MARKER="${2:-Kevin Dave Gerona}"
ATTEMPTS="${SMOKE_ATTEMPTS:-10}"
DELAY="${SMOKE_DELAY:-6}"
PATHS=("/" "/about")

check() {
  local url="$1" body code
  body="$(mktemp)"
  code="$(curl -sS -L --max-time 15 -o "$body" -w '%{http_code}' "$url" || true)"
  if [ "$code" != "200" ]; then
    echo "  HTTP ${code:-000} (want 200)"; rm -f "$body"; return 1
  fi
  if ! grep -qF -- "$MARKER" "$body"; then
    echo "  HTTP 200 but marker not found: $MARKER"; rm -f "$body"; return 1
  fi
  rm -f "$body"
}

fail=0
for p in "${PATHS[@]}"; do
  url="$BASE$p"
  ok=0
  for ((i = 1; i <= ATTEMPTS; i++)); do
    echo "[$i/$ATTEMPTS] $url"
    if check "$url"; then ok=1; break; fi
    [ "$i" -lt "$ATTEMPTS" ] && sleep "$DELAY"
  done
  if [ "$ok" = 1 ]; then echo "OK   $url"; else echo "FAIL $url"; fail=1; fi
done
exit "$fail"
