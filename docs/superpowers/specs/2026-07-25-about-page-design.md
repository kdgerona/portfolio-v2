# About Page — Design

**Date:** 2026-07-25
**Status:** Approved by Kevin

## Goal

Replace the placeholder About page content with Kevin's real bio, experience, education,
and certifications, sourced from his CV (`~/KDFiles/personal/portfolio assets/Latest Resume/Kevin Dave Gerona - CV.pdf`)
plus corrections he supplied in conversation. Experience is split into two timelines:
**Company Experience** vs **Freelance & Independent**.

## Sensitive constraint (hard requirement)

SkAI Technologies is still active alongside Adaca, but due to Kevin's contract with
Adaca the site must **not** hint that it is ongoing:

- Its period renders as exactly **"Jun 2023"** — no end date, no "Present", no en dash.
- Its description uses neutral/past phrasing, never present tense about ongoing work.

## Bio copy (verbatim)

Lead (unchanged from placeholder — Kevin likes it):

> I design and build software end to end — from the first architecture sketch to the last deploy.

Paragraphs:

> I'm Kevin Dave Gerona, a software engineer based in Cebu, Philippines. Since starting
> as an intern in 2018, I've grown from developer to team lead to senior engineer —
> building SaaS platforms, transport systems, and mobile apps for companies across the
> Philippines, the US, Australia, and Israel.

> Today I'm a Senior Software Engineer at Adaca, working with Australian client teams,
> and in my own time I'm building Kioscify, a self-service kiosk platform. Through the
> years I've developed a real passion for system design and software architecture — and
> for exploring whatever new technology is around the corner. I care as much about clean
> boundaries as I do about shipped, working product.

## Data model (`data/about.ts`)

```ts
export type TimelineEntry = {
  period: string;
  title: string;
  org: string;
  location?: string;     // e.g. "Cebu City, PH", "US · Remote"
  chips?: string[];      // e.g. ["Co-Founder"], ["Part-time"], ["Internship"]
  description: string;
};

export type Certification = {
  title: string;
  issuer: string;
  period: string;
};

export const bio: { lead: string; paragraphs: string[] };
export const companyExperience: TimelineEntry[];
export const freelanceExperience: TimelineEntry[];
export const education: TimelineEntry[];
export const certifications: Certification[];
```

The old `experience` export is removed; `app/about/page.tsx` is the sole consumer.
The `// TODO: replace…` comment is removed.

## Company Experience (reverse-chronological)

1. **Senior Software Engineer · Adaca Inc.** — Sep 2024 — Present — location "AU · Remote"
   — Adaca is an offshore engineering / staff-augmentation company; Kevin works embedded
   with the Australian client The Desktop, building and maintaining their platform.
2. **Senior Lead Full Stack Developer · DNA Micro Software Inc.** — Aug 2020 — May 2023
   — location "Cebu City, PH" — joined as Software Engineer building a SaaS application
   from scratch; promoted after a year to Team Lead for the GoRentals and Platform
   projects (including onboarding/training developers); advanced to Senior Lead Full
   Stack Developer leading multiple teams; also served as Team Lead for Research and
   Development.
3. **Software Development Engineer · Micab Systems Corp.** — Apr 2019 — Jul 2020 —
   location "Cebu City, PH" — developed and maintained ReactJS applications with Redux
   and NodeJS/SailsJS APIs; built new features, a Flutter mobile app, and a ReactJS PWA;
   agile environment, automation, Docker deployment/containerization.
4. **Intern · Ferret9 Creative Solutions** — Nov 2018 — Feb 2019 — location
   "Cebu City, PH" — chip "Internship" — on-the-job training; built the Dental Job
   Staffing System.

## Freelance & Independent (reverse-chronological)

1. **Founder · Kioscify** — Dec 2025 — Present — chip "Founder" — building a
   self-service kiosk SaaS platform (store portal, company portal, kiosk APK).
2. **Co-Founder & Principal Software Engineer · SkAI Technologies** — period exactly
   "Jun 2023" (see sensitive constraint) — location "US · Remote" — chip "Co-Founder" —
   co-founded the startup and built the SkAIForm Platform from scratch: overall
   architecture, infrastructure, and team leadership/training.
3. **Senior Software Engineer · TechHub Solutions** — Mar 2023 — Aug 2023 — location
   "US · Remote" — chip "Part-time" — started the Ground Command project from scratch
   with ReactJS, collaborating with internal engineers on backend and IoT integrations.
4. **Full Stack Developer · Concise Med** — Mar 2023 — Aug 2023 — location
   "Israel · Remote" — chip "Part-time" — EdTech company; handled the Concise Nursing
   platform end to end, maintaining and shipping new features; now in production.

Exact description wording is drafted at implementation from the CV text above; period
strings, titles, orgs, locations, and chips are fixed as listed.

## Education

- **BS in Information Technology · University of San Jose – Recoletos** — Jun 2015 —
  Mar 2019 — description mentions the **Excellence in Software Development** award.

## Certifications (new section)

- **Software Architecture & Design of Modern Large Scale Systems** — Udemy — Nov 2023
- **Philippine Information Technology General Certification (Phil-IT GCE, Passer)** —
  Phil-IT — Oct 2018

## Page layout (`app/about/page.tsx`)

- Keeps PageHeader ("About me" / "The person behind the code") and Reveal animations.
- Bio block as today, with the new copy.
- One "Experience" h2, then two subsections with h3 headings **"Companies"** and
  **"Freelance & Independent"**, each rendering the dot-timeline.
- `Timeline` extended: renders `location` and `chips` as small pills next to/under the
  title, same pill style as the crafts-page role chips
  (`rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand-deep`).
- After the experience subsections, a LinkedIn CTA link — "Full career history on
  LinkedIn →" — using the LinkedIn URL already in `data/site.ts` socials (external link,
  `rel="noopener noreferrer"`).
- Education section as today (real entry).
- New compact **Certifications** section after Education (simple list/cards — no
  timeline dots needed).
- Page `metadata.description` updated to reflect real content.

## Out of scope / exclusions

- Personal CV details (age, birth date, religion, height, weight, references, phone,
  address) never appear on the site.
- No mention of SkAI in the bio paragraphs (only in the freelance timeline).
- No new npm dependencies. Kevin runs `npm run dev` himself — do not start the dev
  server.

## Constraints & notes

- **AGENTS.md warning applies:** this repo's Next.js has breaking changes — read the
  relevant guides in `node_modules/next/dist/docs/` before writing page code.
- Follow existing design tokens (font-display, font-serif, text-brand-deep, bg-surface,
  border-edge, text-muted).

## Testing

- `npx tsc --noEmit` and eslint pass; `npm run build` passes.
- Manual visual check by Kevin in his running dev server: two experience subsections,
  chips, SkAI period rendering, certifications section, LinkedIn link, dark/light themes.
