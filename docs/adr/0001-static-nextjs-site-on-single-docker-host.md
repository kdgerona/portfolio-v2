# 0001. Static Next.js site, content as typed TS, Docker + Caddy on a single host

- **Status:** Accepted
- **Date:** 2026-11-09
- **Deciders:** Kevin Dave Gerona (Board). Recorded by the architect (KDG-15).
- **Baseline:** `main` at `79f728d`

This ADR records the decisions that were **already made** and are visible in the repo.
It adds no new ones. It is the baseline later ADRs supersede or amend.

## Context

portfolio-v2 is the personal portfolio for kdgerona.com: Home, About, Crafts (projects),
Skills, Contact. The forces behind the design:

- **Content changes rarely and has one author.** Nobody else edits it, there are no
  user accounts and no user data.
- **Budget is free tier first.** The only running cost is one small DigitalOcean droplet
  (512 MB RAM, 10 GB disk per the README and `scripts/deploy.sh`). GitHub Actions, GHCR
  and Tailscale Personal are $0 for a public repo.
- **Operated by one person and AI agents.** Few moving parts, nothing to patch beyond
  the host and the images, and recovery should be automatic.
- **Public repository.** CI must never expose deploy secrets to pull requests.

## Decision

### 1. Application: Next.js App Router, fully static output

- Next.js 16.2.11 (App Router, Turbopack), React 19.2, TypeScript 5 (`package.json`).
- Routes: `app/page.tsx`, `app/about/`, `app/crafts/`, `app/skills/`, `app/contact/`.
  No route handlers, server actions, middleware, `generateStaticParams` or revalidation.
  `next build` prerenders every route as static (`○`).
- `app/layout.tsx` is the shell: fonts, `ThemeProvider`, `Navbar`, `Footer`, and the
  site-wide `metadata`. Each page exports its own `metadata`.
- Server Components by default. Only components that need the browser are client
  components: `ContactForm`, `Navbar`, `ThemeToggle`, `RoleRotator`, `Reveal`,
  `ProjectGallery`.
- Animation uses `motion`; icons use `lucide-react` and `react-icons`.

### 2. Content as typed TypeScript modules in `data/`

- All content lives in `data/site.ts`, `data/about.ts`, `data/projects.ts` and
  `data/skills.ts`. Each file declares its types at the top and exports typed constants.
  Pages and components import them via `@/data/...`.
- No CMS, no database, no Markdown/MDX pipeline. Changing content means a code change,
  which goes through a PR, CI and a deploy.
- `data/skills.ts` is curated by hand to match the tech stacks in `data/projects.ts`.
  Nothing derives or checks it.

### 3. No backend, no runtime configuration

- No database, API, auth or environment variables. `.env*` is git-ignored and none exist.
- The contact form (`components/ContactForm.tsx`) builds a `mailto:` URL to `site.email`
  and sets `window.location.href`. Nothing leaves the browser except through the
  visitor's own mail client.

### 4. Styling and theming

- Tailwind CSS v4 through `@tailwindcss/postcss`. Configuration lives in CSS
  (`app/globals.css`, `@theme inline`); there is no `tailwind.config.*`.
- Colours are CSS custom properties (`--background`, `--foreground`, `--surface`,
  `--edge`, `--muted`, `--brand`, …), defined for `:root` and `.dark` and exposed as
  Tailwind utilities. The `dark` variant is class-based (`@custom-variant dark`).
- `next-themes` with `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`:
  light by default, a manual toggle, and the OS preference ignored.
- Fonts (Baloo 2, Lora, Inter) come from `next/font/google`. They are downloaded at
  **build time** and self-hosted from the app, so visitors' browsers never call Google.

### 5. Runtime: `output: "standalone"` Node server in Docker

- `next.config.ts` sets `output: "standalone"` and pins `turbopack.root`.
- The multi-stage `Dockerfile` (Node 22 Alpine) has three stages: `deps` (`npm ci`),
  `builder` (`npm run build`) and `runner`. The runner holds only the traced standalone
  bundle, `.next/static` and `public/`, runs as the non-root `node` user, and runs
  `node server.js` on port 3000.
- The Node server is kept, even though every page is static, because it also handles
  **`next/image` optimisation** (used by `Hero` and `ProjectGallery`, with `sharp`).
  That is why `.next` is writable in the image (cache).
- An image `HEALTHCHECK` (and the matching one in `docker-compose.yml`) needs `GET /`
  to return 200.

### 6. Edge: Caddy reverse proxy with automatic TLS

- `docker-compose.yml` runs two services. `portfolio` exposes 3000 only on the compose
  network. `caddy` (`caddy:2-alpine`) publishes 80/443, starts only once `portfolio`
  is healthy, and keeps certificate state in the `caddy_data` volume.
- `Caddyfile`: `kdgerona.com, www.kdgerona.com { reverse_proxy portfolio:3000 }`.
  Caddy's defaults handle ACME certificates and the HTTP to HTTPS redirect.

### 7. Hosting: one DigitalOcean droplet

- One host runs both containers with `restart: unless-stopped`. DNS for both hostnames
  points at it.
- There is no git checkout on the host. CI copies `docker-compose.yml`, `Caddyfile` and
  `scripts/deploy.sh` from the deployed commit into `~deploy/portfolio/`.

### 8. CI/CD: build in GitHub Actions, publish to GHCR, deploy over Tailscale SSH

`.github/workflows/ci.yml`, with `permissions: {}` at the top level and a minimal
permission set per job:

| Trigger | Jobs |
| --- | --- |
| `pull_request` | `verify` (lint, `tsc --noEmit`, `next build`), `docker-build` (no push, no secrets) |
| `push` to `main` | `verify` → `publish` (`ghcr.io/kdgerona/portfolio-v2:{sha,latest}`) → `deploy` → `smoke` |

- The image is built **once in CI**, never on the 512 MB droplet. The GHCR package is
  public, so the droplet pulls it without registry credentials.
- `deploy` joins the tailnet as an ephemeral `tag:ci` node (OAuth client). The tailnet
  ACL lets that tag reach only `tag:droplet:22`. The job SSHes in as `deploy` with
  strict host-key checking and runs `scripts/deploy.sh <sha>`. Deploys are serialised
  by the `deploy-production` concurrency group and by a `flock` on the host.
- `pull_request_target` is never used, and secrets exist only in the main-only
  `deploy` job.

### 9. Release safety: healthcheck rollback plus an external smoke check

- `scripts/deploy.sh` pulls the new SHA (if the pull fails, nothing changes), runs
  `compose up` and waits up to 180 s for `portfolio` to report healthy. If it does not,
  the script brings the previous SHA from `.env` back up and exits non-zero. If it does,
  the script writes `IMAGE_TAG=<sha>` to `.env` and prunes local images down to the
  current and previous ones. It also recreates `caddy` if that container came up
  without its published ports.
- `scripts/test-deploy.sh` tests deploy and rollback offline against a fake `docker`.
- `smoke` runs `scripts/smoke.sh https://kdgerona.com` from outside the host. `/` and
  `/about` must return 200 and contain "Kevin Dave Gerona" (10 tries, 6 s apart).
  It reports problems but **does not roll back**.
- Manual rollback means re-running `deploy.sh <older-sha>`. Any SHA still in GHCR works.

## Alternatives considered

These are reconstructed from the constraints and the repo history, not from a written
evaluation made at the time.

| Option | Why not chosen (as the design stands) |
| --- | --- |
| **Vercel / Netlify / Cloudflare Pages** (managed static/edge hosting) | Least operations work and free tier, but the project self-hosts on an existing droplet, with the Docker image as the deploy unit. The reason was not recorded. Still the cheapest exit (see Consequences). |
| **`output: "export"` + Caddy `file_server`** (no Node runtime) | Smaller attack surface and less RAM. It needs `next/image` set to `unoptimized` or a custom loader, so it gives up runtime image optimisation. Worth a follow-up ADR. |
| **Headless CMS or Markdown/MDX content** | Lets content change without a deploy, but adds a vendor or a build pipeline for one author who already edits code. Typed TS catches content mistakes at build time for free. |
| **Contact form backend** (route handler + email API, or a form SaaS) | Adds a secret, a vendor and spam handling. `mailto:` costs nothing and has no state. |
| **Build on the droplet / `git pull` deploys** | A 512 MB host is too small to build Next.js reliably, and builds would not be reproducible. Building once in CI gives an immutable image per SHA. |
| **Public SSH on the droplet for CI** | Tailscale with an ACL keeps port 22 off the public deploy path, and the ephemeral CI node holds no long-lived network identity. |

## Consequences

### Positive

- **Almost nothing to break or attack at runtime.** No database, no secrets in the app,
  no user input processed on the server. The only dynamic endpoint is `/_next/image`.
- **Content is type-checked.** A malformed project or timeline entry fails `next build`
  in CI before it ships.
- **Immutable, traceable releases.** One image per commit SHA. Rollback means
  redeploying a SHA. `.env` on the host always shows what is live.
- **Self-healing deploys.** A release that fails its healthcheck rolls back on its own.
  The external smoke check catches DNS, Caddy or content problems.
- **Running cost is the droplet only.** Everything else is on free tiers.
- **Easy to leave.** A standard Next.js app and a standard OCI image, so moving to
  Vercel or another host is a small change.

### Negative, trade-offs and known limits

- **Single host, no redundancy.** If the droplet, its disk or its region goes down, the
  site is down, and nothing fails over. Deploys briefly replace the only `portfolio`
  container, so short 502s are possible during a release. That is accepted for a
  personal site.
- **Small host headroom.** 512 MB RAM (plus 1 GB swap) and a 10 GB disk. `deploy.sh`
  keeps only two images for this reason. Image-optimisation cache and Docker logs grow
  on the same disk.
- **No form backend.** Contact only works for visitors with a configured mail client.
  There are no submission records and no delivery confirmation. The upside is no spam
  surface on the server.
- **Content changes require a deploy.** Every text edit goes through PR, CI, image and
  deploy. That is acceptable at the current edit rate.
- **Build-time network dependency.** `next/font/google` fetches fonts during
  `next build`, so builds (CI and `docker build`) need network access. A Google Fonts
  outage fails the build, but not the running site.
- **The smoke check does not roll back.** A release that passes the container
  healthcheck (`/` returns 200) but serves wrong content stays live until someone acts.
- **`deploy` user is in the `docker` group, which is root-equivalent on the host.** This
  is accepted because the key works only over the tailnet and only from `tag:ci`
  (README).
- **Floating Caddy tag.** `caddy:2-alpine` is not pinned to a digest. `deploy.sh` pulls
  only the `portfolio` service, so Caddy changes version only when its image is pulled
  again or missing.
- **Dependence on GitHub (Actions, GHCR) and Tailscale.** If one is down, deploys stop,
  but the running site keeps serving. Manual rollback to SHAs no longer cached on the
  host needs GHCR to be up.
- **Skills and projects can drift.** `data/skills.ts` is kept in sync with
  `data/projects.ts` by convention only.
- **No test suite.** Correctness rests on types, lint, build, the container healthcheck
  and the smoke check.

## Revisit when

- The site needs runtime features (form backend, CMS, analytics with a server side, auth).
  That ends the "no backend, no env" decision and needs its own ADR.
- Availability needs grow beyond "personal site, short outages acceptable".
- The droplet cost, size or provider changes, or a managed host becomes preferable.
- `next/image` optimisation is no longer needed (this opens up a static export).
