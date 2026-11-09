# Architecture Decision Records

Each ADR records one significant decision: why it was made, what was chosen, and what
it costs. ADRs are numbered and never rewritten. To change a decision, add a new ADR
that supersedes the old one, and update the old one's status to
`Superseded by NNNN`.

| ADR | Title | Status |
| --- | --- | --- |
| [0001](0001-static-nextjs-site-on-single-docker-host.md) | Static Next.js site, content as typed TS, Docker + Caddy on a single host | Accepted |
| [0002](0002-edge-security-headers-pinned-caddy-and-log-caps.md) | Edge hardening: security headers, pinned Caddy, capped container logs | Accepted |

## Template

Name new files `NNNN-short-slug.md` (next free number).

```markdown
# NNNN. Title

- **Status:** Proposed | Accepted | Superseded by NNNN
- **Date:** YYYY-MM-DD
- **Deciders:** …

## Context
The forces and constraints that make a decision necessary.

## Decision
What we do, stated plainly.

## Alternatives considered
2-3 options with why each was not chosen.

## Consequences
Positive and negative results, known limits, and what triggers a revisit.
```
