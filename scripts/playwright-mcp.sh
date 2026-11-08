#!/bin/sh
# Launch the Playwright MCP server with a browser that survives agent runs.
# $HOME is a per-run temp dir, so browsers live under /workspace instead.
# Keep both versions in sync: playwright must be the version @playwright/mcp depends on.
set -eu

MCP_VERSION="0.0.84"
PLAYWRIGHT_VERSION="1.65.0-alpha-2026-10-30"
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright

# Idempotent: a no-op when this revision is already downloaded.
# stdout is the MCP stdio channel, so send installer output to stderr.
npx --yes "playwright@${PLAYWRIGHT_VERSION}" install chromium >&2

exec npx --yes "@playwright/mcp@${MCP_VERSION}" --headless --browser chromium \
  --output-dir /workspace/_qa-artifacts
