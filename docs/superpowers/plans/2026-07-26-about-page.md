# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder About page with Kevin's real bio, split company/freelance experience timelines, education, and certifications, per `docs/superpowers/specs/2026-07-25-about-page-design.md`.

**Architecture:** Two-file change. `data/about.ts` is rewritten with real content and new exports (`companyExperience`, `freelanceExperience`, `certifications`); `app/about/page.tsx` renders two timeline subsections with location/role chips, a LinkedIn CTA, and a new Certifications section. No other file consumes these modules.

**Tech Stack:** Next.js 16 App Router (server components), Tailwind v4 design tokens, lucide-react + react-icons (already installed).

## Global Constraints

- **SkAI Technologies must not appear ongoing:** its `period` is exactly `"Jun 2023"` — no end date, no "Present"; description phrased in past/neutral voice.
- SkAI is never mentioned in the bio paragraphs — only in the freelance timeline.
- Personal CV details (age, birth date, religion, height, weight, references, phone, address) never appear anywhere.
- Bio copy, periods, titles, orgs, locations, and chips are fixed verbatim by the spec — copy them exactly as given in the task code below.
- No new npm dependencies.
- Do NOT start the dev server (`npm run dev`) — Kevin runs it himself.
- **AGENTS.md warning:** this repo's Next.js has breaking changes vs training data — read the relevant guide in `node_modules/next/dist/docs/` before modifying page code.
- Commits end with the two trailers shown in the commit steps (Co-Authored-By + Claude-Session).

---

### Task 1: Rewrite `data/about.ts` with real content

**Files:**
- Modify: `data/about.ts` (full rewrite)

**Interfaces:**
- Consumes: nothing.
- Produces: `TimelineEntry` (adds `location?: string`, `chips?: string[]`), `Certification`, and exports `bio`, `companyExperience: TimelineEntry[]`, `freelanceExperience: TimelineEntry[]`, `education: TimelineEntry[]`, `certifications: Certification[]`. Also a **temporary** `experience` alias so the not-yet-updated page keeps compiling; Task 2 deletes it.

- [ ] **Step 1: Replace the entire contents of `data/about.ts` with:**

```ts
export const bio = {
  lead: "I design and build software end to end — from the first architecture sketch to the last deploy.",
  paragraphs: [
    "I'm Kevin Dave Gerona, a software engineer based in Cebu, Philippines. Since starting as an intern in 2018, I've grown from developer to team lead to senior engineer — building SaaS platforms, transport systems, and mobile apps for companies across the Philippines, the US, Australia, and Israel.",
    "Today I'm a Senior Software Engineer at Adaca, working with Australian client teams, and in my own time I'm building Kioscify, a self-service kiosk platform. Through the years I've developed a real passion for system design and software architecture — and for exploring whatever new technology is around the corner. I care as much about clean boundaries as I do about shipped, working product.",
  ],
};

export type TimelineEntry = {
  period: string;
  title: string;
  org: string;
  location?: string;
  chips?: string[];
  description: string;
};

export type Certification = {
  title: string;
  issuer: string;
  period: string;
};

export const companyExperience: TimelineEntry[] = [
  {
    period: "Sep 2024 — Present",
    title: "Senior Software Engineer",
    org: "Adaca Inc.",
    location: "AU · Remote",
    description:
      "Adaca is an Australian offshore engineering and staff-augmentation company. I work embedded with the client company The Desktop, building and maintaining their platform as part of their engineering team.",
  },
  {
    period: "Aug 2020 — May 2023",
    title: "Senior Lead Full Stack Developer",
    org: "DNA Micro Software Inc.",
    location: "Cebu City, PH",
    description:
      "Joined as a Software Engineer building a SaaS application from scratch, and was promoted after a year to Team Lead for the GoRentals and Platform projects — onboarding and training newly hired developers along the way. Advanced to Senior Lead Full Stack Developer leading multiple teams, and also served as Team Lead for Research and Development, where we experimented with and evaluated new tech solutions.",
  },
  {
    period: "Apr 2019 — Jul 2020",
    title: "Software Development Engineer",
    org: "Micab Systems Corp.",
    location: "Cebu City, PH",
    description:
      "Developed and maintained ReactJS applications with Redux for state management and NodeJS/SailsJS APIs. Built new features, a Flutter mobile app, and a ReactJS PWA — working in an agile environment, handling automation processes, and shipping with Docker.",
  },
  {
    period: "Nov 2018 — Feb 2019",
    title: "Intern",
    org: "Ferret9 Creative Solutions",
    location: "Cebu City, PH",
    chips: ["Internship"],
    description:
      "On-the-job training where I built the Dental Job Staffing System — my first real taste of shipping software for actual users.",
  },
];

export const freelanceExperience: TimelineEntry[] = [
  {
    period: "Dec 2025 — Present",
    title: "Founder",
    org: "Kioscify",
    chips: ["Founder"],
    description:
      "Building a self-service kiosk SaaS platform — store portal, company portal, and the kiosk app itself — from architecture to release.",
  },
  {
    period: "Jun 2023",
    title: "Co-Founder & Principal Software Engineer",
    org: "SkAI Technologies",
    location: "US · Remote",
    chips: ["Co-Founder"],
    description:
      "Co-founded the startup and built the SkAIForm Platform from scratch — overall architecture, infrastructure, and team leadership and training.",
  },
  {
    period: "Mar 2023 — Aug 2023",
    title: "Senior Software Engineer",
    org: "TechHub Solutions",
    location: "US · Remote",
    chips: ["Part-time"],
    description:
      "Started the Ground Command project from scratch with ReactJS, working alongside internal engineers who handled the backend and IoT device integrations.",
  },
  {
    period: "Mar 2023 — Aug 2023",
    title: "Full Stack Developer",
    org: "Concise Med",
    location: "Israel · Remote",
    chips: ["Part-time"],
    description:
      "An EdTech company where I handled the Concise Nursing platform as a full-stack developer — maintaining it and shipping new features. The platform is in production today.",
  },
];

export const education: TimelineEntry[] = [
  {
    period: "Jun 2015 — Mar 2019",
    title: "BS in Information Technology",
    org: "University of San Jose – Recoletos",
    location: "Cebu City, PH",
    description:
      "Collegiate studies focused on software development, capped with the Excellence in Software Development award.",
  },
];

export const certifications: Certification[] = [
  {
    title: "Software Architecture & Design of Modern Large Scale Systems",
    issuer: "Udemy",
    period: "Nov 2023",
  },
  {
    title: "Philippine Information Technology General Certification (Phil-IT GCE, Passer)",
    issuer: "Phil-IT",
    period: "Oct 2018",
  },
];

// Temporary alias so app/about/page.tsx compiles until Task 2 rewires it. Task 2 deletes this line.
export const experience: TimelineEntry[] = companyExperience;
```

- [ ] **Step 2: Verify types and lint**

Run: `npx tsc --noEmit && npx eslint data/about.ts`
Expected: both exit 0, no output.

- [ ] **Step 3: Commit**

```bash
git add data/about.ts
git commit -m "Replace placeholder about data with real CV content

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PniksMr51tMGGAf734r2oK"
```

---

### Task 2: Render the new About page

**Files:**
- Modify: `app/about/page.tsx` (full rewrite)
- Modify: `data/about.ts` (delete the temporary `experience` alias — the last two lines, comment included)

**Interfaces:**
- Consumes from Task 1: `bio`, `companyExperience`, `freelanceExperience`, `education`, `certifications`, `type TimelineEntry` from `@/data/about`; `site.socials.linkedin` from `@/data/site` (value `https://www.linkedin.com/in/kevindavegerona`).
- Produces: nothing consumed later.

- [ ] **Step 1: Read the App Router page/metadata guide**

Per AGENTS.md, skim the relevant doc before editing the page:
`ls node_modules/next/dist/docs/` then read the file covering pages/metadata (e.g. the App Router metadata or pages guide). Confirm the existing `export const metadata: Metadata` pattern in `app/about/page.tsx` is still current; adapt only if the docs say otherwise.

- [ ] **Step 2: Replace the entire contents of `app/about/page.tsx` with:**

```tsx
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";
import {
  bio,
  certifications,
  companyExperience,
  education,
  freelanceExperience,
  type TimelineEntry,
} from "@/data/about";

export const metadata: Metadata = {
  title: "About — Kevin Dave Gerona",
  description:
    "About Kevin Dave Gerona — software engineer from Cebu, Philippines: bio, company and freelance experience, education, and certifications.",
};

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative flex flex-col gap-10 border-l-2 border-edge pl-8">
      {entries.map((entry) => (
        <li key={`${entry.org}-${entry.title}`} className="relative">
          <span
            aria-hidden
            className="absolute -left-[2.4rem] top-1.5 size-4 rounded-full border-4 border-background bg-brand"
          />
          <p className="font-serif text-sm uppercase tracking-widest text-brand-deep">
            {entry.period}
          </p>
          <h3 className="mt-1 font-display text-2xl font-bold">
            {entry.title}
            <span className="font-serif text-lg font-normal text-muted">
              {" "}
              · {entry.org}
            </span>
          </h3>
          {(entry.location || entry.chips?.length) && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {entry.location && (
                <li className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand-deep">
                  {entry.location}
                </li>
              )}
              {entry.chips?.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand-deep"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            {entry.description}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 md:pt-36">
      <PageHeader eyebrow="About me" title="The person behind the code" />

      <Reveal className="mt-12">
        <p className="max-w-3xl font-display text-2xl font-semibold leading-snug md:text-3xl">
          {bio.lead}
        </p>
        <div className="mt-6 flex max-w-3xl flex-col gap-4 leading-relaxed text-muted">
          {bio.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-20">
        <h2 className="mb-10 font-display text-3xl font-bold">Experience</h2>
        <h3 className="mb-8 font-serif text-sm uppercase tracking-widest text-muted">
          Companies
        </h3>
        <Timeline entries={companyExperience} />
        <h3 className="mb-8 mt-14 font-serif text-sm uppercase tracking-widest text-muted">
          Freelance &amp; Independent
        </h3>
        <Timeline entries={freelanceExperience} />
        <a
          href={site.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-brand-deep transition-opacity hover:opacity-70"
        >
          <FaLinkedin className="size-4" aria-hidden />
          Full career history on LinkedIn
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </Reveal>

      <Reveal className="mt-20">
        <h2 className="mb-10 font-display text-3xl font-bold">Education</h2>
        <Timeline entries={education} />
      </Reveal>

      <Reveal className="mt-20">
        <h2 className="mb-10 font-display text-3xl font-bold">
          Certifications
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <li
              key={cert.title}
              className="rounded-3xl border border-edge bg-background p-6 shadow-sm"
            >
              <p className="font-serif text-sm uppercase tracking-widest text-brand-deep">
                {cert.period}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold">
                {cert.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 3: Delete the temporary alias from `data/about.ts`**

Remove these two lines (the comment and the export) at the end of the file:

```ts
// Temporary alias so app/about/page.tsx compiles until Task 2 rewires it. Task 2 deletes this line.
export const experience: TimelineEntry[] = companyExperience;
```

- [ ] **Step 4: Verify types, lint, and build**

Run: `npx tsc --noEmit && npx eslint app/about/page.tsx data/about.ts`
Expected: exit 0, no output.

Run: `npm run build`
Expected: build succeeds; `/about` listed in the route output with no errors.

- [ ] **Step 5: Grep guard for the sensitive constraint**

Run: `grep -n "SkAI" data/about.ts app/about/page.tsx`
Expected: matches only inside the `freelanceExperience` SkAI entry (org + description); its `period` line above it reads exactly `period: "Jun 2023",`. No "Present" on that entry, no SkAI in `bio`.

- [ ] **Step 6: Commit**

```bash
git add app/about/page.tsx data/about.ts
git commit -m "Build out the About page with split company/freelance timelines

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PniksMr51tMGGAf734r2oK"
```

---

## Testing

No test framework exists in this repo; verification is `npx tsc --noEmit`, `npx eslint`, and `npm run build` (all covered in task steps), followed by Kevin's manual visual check in his own dev server: two experience subsections with chips, SkAI period showing only "Jun 2023", certifications cards, LinkedIn link, dark/light themes.
