<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# portfolio-v2

Personal portfolio site for Kevin Dave Gerona (kdgerona.com): home, About, Crafts (projects), Skills, Contact. Fully static content, no database, no backend, no env vars.

## Stack

Next.js 16.2.11 (App Router, Turbopack, `output: "standalone"`), React 19.2, TypeScript 5, Tailwind CSS v4 (`@tailwindcss/postcss`), ESLint 9 (`eslint-config-next`), `motion` (animation), `next-themes` (theming), `lucide-react` + `react-icons` (icons), `sharp`. Fonts via `next/font/google` (Baloo 2, Lora, Inter). Docker image uses Node 22 (Alpine).

## Commands

Run from the repo root. There is no test script.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install exact deps from `package-lock.json` |
| `npm run dev` | Dev server on :3000 (`-- -p 3001` to change port) |
| `npm run lint` | ESLint (`eslint`, flat config in `eslint.config.mjs`) |
| `npm run build` | Production build; also type-checks |
| `npm run start` | Serve the production build (`PORT=…` to change port) |
| `docker build -t portfolio .` | Build the image (multi-stage, standalone output) |
| `docker compose up -d --build` | App + Caddy (needs ports 80/443 free) |

`next build` fetches Google Fonts at build time, so it needs network access. A transient font fetch failure can fail a build; retry before investigating.

## Directory map

- `app/` — routes: `page.tsx` (home), `about/`, `contact/`, `crafts/`, `skills/` (each a `page.tsx`); `layout.tsx` (fonts, `ThemeProvider`, Navbar/Footer); `globals.css` (theme tokens).
- `components/` — shared UI (Navbar, Footer, Hero, PageHeader, ProjectCard/ProjectGallery, RepoCard, ContactForm, ThemeToggle, Reveal, RoleRotator, SocialLinks, WaveBlob).
- `data/` — all site content as typed TS: `site.ts`, `about.ts`, `projects.ts`, `skills.ts`.
- `public/` — static assets; project screenshots under `public/projects/`.
- `docs/superpowers/` — design specs (`specs/`) and implementation plans (`plans/`) for the About and Crafts pages. Read these before reworking those pages; don't duplicate them here.
- `Dockerfile`, `docker-compose.yml`, `Caddyfile` — deployment. `.mcp.json` + `scripts/playwright-mcp.sh` — Playwright MCP.

Imports use the `@/` alias (repo root).

## Editing content (`data/`)

Edit data, not JSX. Types are defined at the top of each file; follow them.

- **Project** — add an object to a `companyGroups[].projects` array in `data/projects.ts` (or a new `CompanyGroup`). Order is deliberate (significance, founder work first). Only add `links` that really exist; use `images` paths under `/public/projects/`.
- **Skill** — add a string to a `skillCategories[].skills` array in `data/skills.ts` (skills are merged from project tech stacks; keep them consistent with `projects.ts`).
- **About entry** — add a `TimelineEntry` to `companyExperience`, `freelanceExperience` or `education`, or a `Certification` to `certifications`, in `data/about.ts`; bio text is `bio`.
- **Nav, socials, email, roles** — `data/site.ts`.

The contact form has no backend: it builds a `mailto:` link to `site.email`.

## Styling and theming

- Tailwind v4: config lives in CSS (`@import "tailwindcss"`, `@theme inline` in `app/globals.css`), there is no `tailwind.config.*`.
- Colors come from CSS variables (`--background`, `--foreground`, `--surface`, `--edge`, `--muted`, `--brand`, …) defined for `:root` and `.dark`, exposed as utilities like `bg-surface`, `text-muted`, `text-brand`. Use these tokens rather than hard-coded colors.
- Theme: `next-themes` with `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`. Light is the default; every UI change must look right in both light and dark (`dark:` variant is class-based).
- Fonts are exposed as CSS variables `--font-baloo`, `--font-lora`, `--font-inter` on `<html>`.

## Playwright MCP

`.mcp.json` starts `scripts/playwright-mcp.sh`, which installs a pinned Chromium into `/workspace/.cache/ms-playwright` and runs `@playwright/mcp` headless, writing artifacts to `/workspace/_qa-artifacts`. To check UI changes: start `npm run dev` (or `build` + `start`), then navigate the `mcp__playwright__*` tools to `http://localhost:<port>`. Keep the versions pinned in the script in sync. `.playwright-mcp/` and test output are git-ignored.

## Deployment

Docker + Caddy on a single host. `docker-compose.yml` runs `portfolio` (exposes 3000 internally only) and `caddy` (publishes 80/443, automatic TLS, reverse-proxies `kdgerona.com` and `www.kdgerona.com` to `portfolio:3000`; cert state in the `caddy_data` volume). DNS for both hostnames must point at the host and ports 80/443 must be reachable for certificate issuance. The container runs as the non-root `node` user and has a `/` healthcheck. CI/CD is described in the Deploy section below.

## Git and workflow

- Work on the task branch you were given; never commit to `main` directly and don't merge your own work.
- Small, focused commits with conventional-style messages (`feat:`, `fix:`, `chore:`, `docs:`).
- Before handing off, run `npm run lint` and `npm run build`.

## Guardrails

- Don't hand-edit the Next.js block above (between the `nextjs-agent-rules` markers); `next dev` rewrites it. Commit it if `next dev` changes it.
- Read `node_modules/next/dist/docs/` before using Next.js APIs; this version differs from older releases.
- No secrets, tokens, or `.env*` files in the repo (`.env*` is git-ignored). The site needs none.
- Don't change the Caddy domains/TLS config, ports, or Dockerfile/compose without DevOps involvement.
- Keep `CLAUDE.md` as just `@AGENTS.md`.
- Don't add dependencies or config changes as a side effect of content or docs work.

## Deploy

- CI/CD is `.github/workflows/ci.yml`: PRs run lint, `tsc --noEmit`, `next build` and a docker build (no push). Pushes to `main` publish `ghcr.io/kdgerona/portfolio-v2:{sha,latest}` and deploy to the droplet over Tailscale (ephemeral OAuth node, ssh as `deploy`, `scripts/deploy.sh <sha>`).
- `deploy.sh` runs on the droplet: pull, `up -d`, wait healthy, auto-rollback to the previous SHA, prune to current + previous. The deployed tag lives in `~/portfolio/.env` on the droplet.
- Publish/deploy jobs must stay gated to `push` on `refs/heads/main`. Never use `pull_request_target` or expose secrets to PR jobs (public repo).
- Validate changes with `actionlint` and `shellcheck scripts/*.sh`; `scripts/test-deploy.sh` tests deploy/rollback offline with a fake docker.
- `smoke` job (after `deploy`, same main-only gate) runs `scripts/smoke.sh https://kdgerona.com`: `/` and `/about` must return 200 and contain "Kevin Dave Gerona" (retries 10x, 6s apart). Red `smoke` = site not serving after deploy: run the script locally to see which URL/why (`HTTP 000` = unreachable/Caddy/DNS, `404/5xx` = app, `marker not found` = wrong page or rebrand). It does not roll back; deploy.sh's healthcheck does that. Needs only curl/grep.
- Agents do not touch the droplet, secrets or `main`; setup steps and rollback are in the README ("CI/CD and deployment").
