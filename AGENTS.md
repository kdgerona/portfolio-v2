<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Deploy

- CI/CD is `.github/workflows/ci.yml`: PRs run lint, `tsc --noEmit`, `next build` and a docker build (no push). Pushes to `main` publish `ghcr.io/kdgerona/portfolio-v2:{sha,latest}` and deploy to the droplet over Tailscale (ephemeral OAuth node, ssh as `deploy`, `scripts/deploy.sh <sha>`).
- `deploy.sh` runs on the droplet: pull, `up -d`, wait healthy, auto-rollback to the previous SHA, prune to current + previous. The deployed tag lives in `~/portfolio/.env` on the droplet.
- Publish/deploy jobs must stay gated to `push` on `refs/heads/main`. Never use `pull_request_target` or expose secrets to PR jobs (public repo).
- Validate changes with `actionlint` and `shellcheck scripts/*.sh`; `scripts/test-deploy.sh` tests deploy/rollback offline with a fake docker.
- Agents do not touch the droplet, secrets or `main`; setup steps and rollback are in the README ("CI/CD and deployment").
