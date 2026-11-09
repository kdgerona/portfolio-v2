# 0002. Edge hardening: security headers, pinned Caddy, capped container logs

- **Status:** Accepted
- **Date:** 2026-11-09
- **Deciders:** Board (approved on KDG-14, follow-up A); recommendation by Gyomei (Architect); implemented by Kyojuro Rengoku (DevOps)

This amends the edge and deploy parts of [ADR 0001](0001-static-nextjs-site-on-single-docker-host.md) (section 6, Caddy). It does not change any of 0001's decisions.

## Context
ADR 0001's review found three gaps at the public edge, all fixable at no cost:

- Caddy sent no security headers beyond its defaults.
- `caddy:2-alpine` is a floating tag. A deploy that recreates the container can pull a different Caddy version than the one last tested.
- Docker's default `json-file` driver has no size limit. Container logs could slowly fill the droplet's 10 GB disk.

## Decision
1. **Response headers**, set in the `Caddyfile` for both `kdgerona.com` and `www.kdgerona.com`:
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (1 year, **no `preload`**)
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Content-Security-Policy: frame-ancestors 'none'` (this directive only)
   - the `Server` header is removed (`-Server`)
2. **Pin Caddy** to `caddy:2.11.9-alpine`, the latest 2.x patch release on Docker Hub when this was written (2026-11-09). It stays on the 2.x line, so Caddyfile syntax is unchanged. Upgrades become a deliberate one-line PR.
3. **Cap logs** on both services with `logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }`. That is at most about 30 MB per container.

## Alternatives considered
| Option | Why not |
| --- | --- |
| **HSTS with `preload`** | Browsers ship the preload list, and removal takes months. It also forces HTTPS on every subdomain. The Board has not approved it. `max-age=31536000; includeSubDomains` gives most of the benefit and can be undone by lowering `max-age`. |
| **Full Content-Security-Policy** | The `next-themes` bootstrap uses an inline script, and Next.js and `motion` inject inline styles. A strict CSP would need nonces or hashes in app code, which is out of scope. `frame-ancestors 'none'` alone blocks clickjacking with no breakage risk. |
| **Keep the floating `caddy:2-alpine`** | It picks up fixes automatically, but a recreate can change the Caddy version without review, which cannot be reproduced or rolled back by SHA. For a single static site, a manual bump is cheap. |
| **Docker daemon-wide log config (`/etc/docker/daemon.json`)** | It lives on the droplet, outside the repo and CI. Per-service settings in Compose are versioned and reviewed. |

## Consequences
- Browsers will only use HTTPS for the site and its subdomains for a year after the last visit. Any HTTP-only subdomain would break. None are known to exist.
- The site cannot be embedded in a frame. That is intended.
- Caddy no longer gets security patches automatically. **Revisit:** bump the pin when a new 2.x patch or a Caddy security advisory appears.
- The upstream `X-Powered-By` header from Next.js is not touched here (it is app config, out of scope).
- **Rollout risk (bind mount).** CI copies the `Caddyfile` with `tar xzf`, which replaces the file with a new inode. Compose bind-mounts the single file, so a running Caddy container keeps seeing the old one. `deploy.sh` runs `docker compose up -d`, which recreates `caddy` only when its compose config changes. This change edits the `caddy` service (image pin and logging), so the first deploy recreates it and the headers go live. A later deploy that changes only the `Caddyfile` would not take effect until `caddy` is recreated. The fix is a follow-up in `deploy.sh` (for example `up -d --force-recreate caddy` when the Caddyfile changed). It is not done here because the `deploy.sh` and CI scope was excluded.
- Recreating `caddy` restarts it for a few seconds. Certificate state is kept in the `caddy_data` volume.

## Rollback
- Headers: revert the `header { … }` block in the `Caddyfile` and merge. Because of the bind-mount issue above, also recreate Caddy on the host (`docker compose up -d --force-recreate caddy`). Browsers that have seen HSTS keep it until `max-age` expires; to shorten that, first deploy `max-age=0`.
- Pin: revert the image line to `caddy:2-alpine` or another tag; the config change recreates `caddy` on deploy.
- Log caps: remove the `logging` blocks. Existing containers keep their old settings until recreated.
