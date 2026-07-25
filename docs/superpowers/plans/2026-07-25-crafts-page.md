# Crafts Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder crafts page with Kevin's 12 real projects, grouped by company (ordered by significance), with screenshot covers and a lightbox gallery.

**Architecture:** `data/projects.ts` becomes the single source of truth exporting `companyGroups: CompanyGroup[]`. `app/crafts/page.tsx` renders one section per group. `ProjectCard` (server component) delegates its image slot to a new `ProjectGallery` client component that shows the cover and opens a portal-rendered lightbox. No new dependencies.

**Tech Stack:** Next.js 16.2.11 (App Router), Tailwind v4 tokens from `app/globals.css` (`bg-surface`, `border-edge`, `text-muted`, `text-brand-deep`, `bg-panel`, `font-display`), `motion/react` via existing `Reveal`, `lucide-react` + `react-icons/fa6` icons.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-25-crafts-page-design.md`.
- **No new npm dependencies.** Lightbox is hand-rolled.
- **Do not start the dev server** — Kevin runs `npm run dev` himself.
- This repo's Next.js may differ from training data (`AGENTS.md`); the patterns used here (`next/image` with `fill`/`sizes`, App Router `Metadata`) were verified against `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` and match the existing working `ProjectCard`.
- No test framework exists in this repo (static portfolio). Verification per task = `npx tsc --noEmit` and `npm run lint`; final verification = `npm run build`. Do not add a test framework.
- Descriptions must be used verbatim from `portfolio_descriptions.docx` (transcribed below); tech tags are cleaned of typos (Micorservices→Microservices, Prsima→Prisma, Socket AI→Socket.IO, Google API's→Google APIs) but otherwise complete — **all tags render, no truncation** (Kevin's explicit choice).
- Commit after every task. End commit messages with:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` and
  `Claude-Session: https://claude.ai/code/session_01PniksMr51tMGGAf734r2oK`

## Source material (already extracted)

Screenshots live in `/private/tmp/claude-501/-Users-kevindavegerona-KDFiles-personal-projects-portfolio/632bce12-8a51-44b5-b179-2ad5570793cf/scratchpad/docx-media/`. If that directory is missing, re-extract with:

```bash
mkdir -p <scratchpad>/docx-media
unzip -o -j '/Users/kevindavegerona/KDFiles/personal/portfolio assets/Projects Docs.docx' 'word/media/*' -d <scratchpad>/docx-media
```

Image→project mapping (from the docx's internal order). **Logos are excluded from galleries**: image1 (Micab), image6 (Ground Command), image12 (Concise), image14 (SkAIForm), image20 (The Desktop), image29 (Kioscify). Covers = the landscape screenshot listed first per project below.

| Project | Source images (docx-media) | Destination (`public/projects/`) |
|---|---|---|
| Micab Fleet Portal | image4.jpg, image2.png, image3.png | `micab-fleet-portal/01.jpg`, `02.png`, `03.png` |
| GoRentals | image5.jpeg | `gorentals/01.jpeg` |
| Ground Command | image8.jpeg, image9.png, image10.png, image11.png, image7.png | `ground-command/01.jpeg`, `02.png`, `03.png`, `04.png`, `05.png` |
| Concise Nursing | image13.jpeg | `concise-nursing/01.jpeg` |
| SkAIForm | image15.png … image19.png | `skaiform/01.png` … `05.png` |
| The Desktop | image21.png … image28.png | `the-desktop/01.png` … `08.png` |
| Kioscify | image30.jpeg … image38.jpeg, image39.png … image52.png | `kioscify/01.jpeg` … `09.jpeg`, `10.png` … `23.png` |

No screenshots (branded placeholder card): Dental Job Staffing System, Micab Concierge App, MICARGO, Platform 7, Navitaire.

---

### Task 1: Copy screenshots into `public/projects/`

**Files:**
- Create: `public/projects/<slug>/*` per the mapping table above.

**Interfaces:**
- Produces: static image paths `/projects/<slug>/NN.<ext>` consumed by Task 2's data file.

- [ ] **Step 1: Copy and rename images**

```bash
cd /Users/kevindavegerona/KDFiles/personal/projects/portfolio
SRC='/private/tmp/claude-501/-Users-kevindavegerona-KDFiles-personal-projects-portfolio/632bce12-8a51-44b5-b179-2ad5570793cf/scratchpad/docx-media'
mkdir -p public/projects/{micab-fleet-portal,gorentals,ground-command,concise-nursing,skaiform,the-desktop,kioscify}

cp "$SRC/image4.jpg"  public/projects/micab-fleet-portal/01.jpg
cp "$SRC/image2.png"  public/projects/micab-fleet-portal/02.png
cp "$SRC/image3.png"  public/projects/micab-fleet-portal/03.png

cp "$SRC/image5.jpeg" public/projects/gorentals/01.jpeg

cp "$SRC/image8.jpeg" public/projects/ground-command/01.jpeg
cp "$SRC/image9.png"  public/projects/ground-command/02.png
cp "$SRC/image10.png" public/projects/ground-command/03.png
cp "$SRC/image11.png" public/projects/ground-command/04.png
cp "$SRC/image7.png"  public/projects/ground-command/05.png

cp "$SRC/image13.jpeg" public/projects/concise-nursing/01.jpeg

for i in 15 16 17 18 19; do cp "$SRC/image$i.png" "public/projects/skaiform/0$((i-14)).png"; done
for i in 21 22 23 24 25 26 27 28; do cp "$SRC/image$i.png" "public/projects/the-desktop/0$((i-20)).png"; done
for i in 30 31 32 33 34 35 36 37 38; do cp "$SRC/image$i.jpeg" "public/projects/kioscify/0$((i-29)).jpeg"; done
for i in 39 40 41 42 43 44 45 46 47 48 49 50 51 52; do n=$((i-29)); cp "$SRC/image$i.png" "public/projects/kioscify/$n.png"; done
```

- [ ] **Step 2: Verify counts**

Run: `find public/projects -type f | wc -l` → Expected: `46` (3+1+5+1+5+8+23)
Run: `ls public/projects/kioscify | sort | head -3` → Expected: `01.jpeg`, `02.jpeg`, `03.jpeg`

- [ ] **Step 3: Commit**

```bash
git add public/projects
git commit -m "Add project screenshots extracted from portfolio docs"
```

---

### Task 2: Rewrite `data/projects.ts` with real content

**Files:**
- Modify: `data/projects.ts` (full rewrite)

**Interfaces:**
- Produces: `export type ProjectLink`, `export type Project`, `export type CompanyGroup`, `export const companyGroups: CompanyGroup[]`. The old `export const projects` is **removed** — `tsc` will fail in `app/crafts/page.tsx` until Task 4; that is expected mid-sequence.

- [ ] **Step 1: Write the new data file** (complete content)

```ts
export type ProjectLink = {
  label: string;
  url: string;
  kind: "live" | "github" | "app";
};

export type Project = {
  title: string;
  /** e.g. "Founder", "Co-Founder" — rendered as a badge next to the title. */
  role?: string;
  description: string;
  /** Full tech list — every tag renders on the card. */
  tags: string[];
  /** Paths under /public. First entry is the card's cover image. */
  images?: string[];
  /** Only links that actually exist, each with its own label. */
  links?: ProjectLink[];
  /** Renders a "Private codebase" lock note. */
  privateCode?: boolean;
};

export type CompanyGroup = {
  company: string;
  location?: string;
  note?: string;
  projects: Project[];
};

// Ordered by significance (Kevin's choice): founder work first, OJT last.
export const companyGroups: CompanyGroup[] = [
  {
    company: "Independent / Founder",
    location: "Philippines",
    projects: [
      {
        title: "Kioscify",
        role: "Founder",
        description:
          "A cloud-based, multi-tenant store management and monitoring platform designed and built end-to-end as founder. Spans an Android mobile app, web admin portals for both individual stores and companies, a backend API, and the underlying database architecture.",
        tags: [
          "ReactJS", "Redux", "React Native", "Expo", "NativeWind", "NextJS",
          "Tailwind", "NestJS", "Prisma", "Swagger", "MongoDB", "Redis",
          "Turborepo", "AWS", "DigitalOcean",
        ],
        images: [
          "/projects/kioscify/01.jpeg", "/projects/kioscify/02.jpeg",
          "/projects/kioscify/03.jpeg", "/projects/kioscify/04.jpeg",
          "/projects/kioscify/05.jpeg", "/projects/kioscify/06.jpeg",
          "/projects/kioscify/07.jpeg", "/projects/kioscify/08.jpeg",
          "/projects/kioscify/09.jpeg", "/projects/kioscify/10.png",
          "/projects/kioscify/11.png", "/projects/kioscify/12.png",
          "/projects/kioscify/13.png", "/projects/kioscify/14.png",
          "/projects/kioscify/15.png", "/projects/kioscify/16.png",
          "/projects/kioscify/17.png", "/projects/kioscify/18.png",
          "/projects/kioscify/19.png", "/projects/kioscify/20.png",
          "/projects/kioscify/21.png", "/projects/kioscify/22.png",
          "/projects/kioscify/23.png",
        ],
        links: [
          { label: "Store Portal", url: "https://store.kioscify.com/login", kind: "live" },
          { label: "Company Portal", url: "https://greatserve.kioscify.com/login", kind: "live" },
          { label: "Code", url: "https://github.com/kdgerona/Kioscify", kind: "github" },
        ],
      },
    ],
  },
  {
    company: "Digital Business Process",
    location: "United States",
    projects: [
      {
        title: "SkAIForm Platform",
        role: "Co-Founder",
        description:
          "An AI-powered workflow automation platform that helps businesses streamline and transform their processes. Its generative-AI-driven workflow engine delivers a comprehensive, cost-effective solution for improving operational efficiency.",
        tags: [
          "ReactJS", "Redux", "NextJS", "NestJS", "Prisma", "Redis", "Nginx",
          "MinIO", "MongoDB", "Node Celery", "BullMQ", "Socket.IO",
          "Google APIs", "Twilio APIs", "SendGrid", "Jenkins", "AWS",
          "Microservices", "System Design/Architecture", "Python", "RAG",
          "MCP", "Ollama", "Hugging Face", "Claude APIs", "OpenTelemetry",
          "Grafana", "Loki", "Tempo", "Prometheus", "Docker",
        ],
        images: [
          "/projects/skaiform/01.png", "/projects/skaiform/02.png",
          "/projects/skaiform/03.png", "/projects/skaiform/04.png",
          "/projects/skaiform/05.png",
        ],
        links: [
          { label: "Live site", url: "https://alpha.platform.skaiform.com/", kind: "live" },
        ],
        privateCode: true,
      },
    ],
  },
  {
    company: "Adaca",
    location: "Australia",
    projects: [
      {
        title: "The Desktop",
        description:
          "A compliance management platform purpose-built for Australia's childcare sector, helping providers meet regulatory requirements with confidence and reduce administrative overhead.",
        tags: [
          "ReactJS", "Redux", "NextJS", "PHP", "Laravel", "MySQL", "Docker",
          "Nginx", "Mailpit", "AI Integration", "Stripe",
        ],
        images: [
          "/projects/the-desktop/01.png", "/projects/the-desktop/02.png",
          "/projects/the-desktop/03.png", "/projects/the-desktop/04.png",
          "/projects/the-desktop/05.png", "/projects/the-desktop/06.png",
          "/projects/the-desktop/07.png", "/projects/the-desktop/08.png",
        ],
        links: [
          { label: "Live site", url: "https://auth.thedesktop.com.au/login", kind: "live" },
        ],
        privateCode: true,
      },
    ],
  },
  {
    company: "DNA Micro",
    location: "United States",
    projects: [
      {
        title: "Platform 7",
        description:
          "An internal development platform that streamlines the process of building applications, from initial scaffolding through to production deployment. Enabled engineering teams to move faster by standardizing how new applications are built.",
        tags: [
          "ReactJS", "TypeScript", "XState", "Tailwind", "NodeJS", "NestJS",
          "Redis", "RethinkDB", "MongoDB", "Socket.IO", "Kafka", "RabbitMQ",
          "OpenTelemetry", "GraphQL", "gRPC", "MySQL", "Elasticsearch",
          "Nginx", "CI/CD", "AWS", "Linux", "Microservices",
          "System Design/Architecture",
        ],
        privateCode: true,
      },
      {
        title: "GoRentals",
        description:
          "A vehicle rental platform covering the full customer journey in one system, including bookings, live tracking, and claims management.",
        tags: [
          "ReactJS", "TypeScript", "XState", "Tailwind", "NodeJS", "NestJS",
          "Redis", "RethinkDB", "MongoDB", "Socket.IO", "GraphQL",
          "Elasticsearch", "Nginx", "Linux", "Google APIs", "BeyondPay",
          "Microservices", "System Design/Architecture",
        ],
        images: ["/projects/gorentals/01.jpeg"],
        privateCode: true,
      },
      {
        title: "Navitaire",
        description:
          "An integration built to connect client systems with Navitaire, enabling seamless airline booking, reservation, and ticketing workflows.",
        tags: [".NET", "JavaScript", "XML"],
        privateCode: true,
      },
    ],
  },
  {
    company: "Tech Hub Solutions",
    location: "United States",
    note: "Freelance",
    projects: [
      {
        title: "Ground Command",
        description:
          "A smart tracking platform for autonomous mowers, giving operators real-time location, status, and fleet monitoring for their equipment.",
        tags: [
          "ReactJS", "Styled Components", "Redux", "GraphQL", "AWS",
          "Google APIs",
        ],
        images: [
          "/projects/ground-command/01.jpeg", "/projects/ground-command/02.png",
          "/projects/ground-command/03.png", "/projects/ground-command/04.png",
          "/projects/ground-command/05.png",
        ],
        privateCode: true,
      },
    ],
  },
  {
    company: "Concise Nursing",
    location: "Israel",
    note: "Freelance",
    projects: [
      {
        title: "Concise Nursing",
        description:
          "An EdTech platform delivering comprehensive nursing exam review content, helping nursing students prepare effectively for licensure through structured, accessible study tools.",
        tags: [
          "ReactJS", "Tailwind", "Redux", "NextJS", "Auth0",
          "Google Apps Script", "Google APIs",
        ],
        images: ["/projects/concise-nursing/01.jpeg"],
        links: [
          { label: "Live site", url: "https://concise-nursing.com", kind: "live" },
        ],
        privateCode: true,
      },
    ],
  },
  {
    company: "Micab Systems Corp.",
    location: "Philippines",
    projects: [
      {
        title: "Micab Fleet Portal",
        description:
          "A taxi-hailing platform connecting riders with drivers in real time, paired with a fleet portal that gives operators visibility and control over vehicles, drivers, and trip activity. Designed to support the full ride lifecycle, from booking to dispatch to completion.",
        tags: [
          "ReactJS", "Redux", "NodeJS", "SailsJS", "Flutter", "MongoDB",
          "Docker", "Linux", "Google APIs", "Stripe",
        ],
        images: [
          "/projects/micab-fleet-portal/01.jpg",
          "/projects/micab-fleet-portal/02.png",
          "/projects/micab-fleet-portal/03.png",
        ],
        privateCode: true,
      },
      {
        title: "Micab Concierge App",
        description:
          "A concierge-oriented extension of the Micab ecosystem, enabling hospitality staff to book and manage rides on behalf of guests. Streamlines coordination between venues and the fleet for a smoother guest experience.",
        tags: ["ReactJS (PWA)", "Google APIs"],
        privateCode: true,
      },
      {
        title: "MICARGO",
        description:
          "A cargo tracking system built on the Fleetmon platform, giving logistics teams real-time visibility into shipments and fleet movement across delivery routes.",
        tags: [
          "ReactJS", "Redux", "NodeJS", "SailsJS", "MongoDB", "Docker",
          "Linux", "Google APIs", "Fleetmon",
        ],
        privateCode: true,
      },
    ],
  },
  {
    company: "Ferret9",
    location: "Philippines",
    note: "On-the-job training",
    projects: [
      {
        title: "Dental Job Staffing System",
        description:
          "A staffing platform connecting dental practices with qualified job seekers, streamlining job postings, applications, and placement workflows. Built with PHP and CodeIgniter.",
        tags: ["PHP", "CodeIgniter", "XAMPP", "MySQL", "FileZilla"],
        privateCode: true,
      },
    ],
  },
];
```

- [ ] **Step 2: Verify the data file itself compiles**

Run: `npx tsc --noEmit`
Expected: errors ONLY in `app/crafts/page.tsx` (`projects` no longer exported) — none in `data/projects.ts`. If `data/projects.ts` has errors, fix them before proceeding.

- [ ] **Step 3: Commit**

```bash
git add data/projects.ts
git commit -m "Replace placeholder projects data with real company-grouped projects"
```

---

### Task 3: Create `ProjectGallery` client component (cover + lightbox)

**Files:**
- Create: `components/ProjectGallery.tsx`

**Interfaces:**
- Produces: `export default function ProjectGallery({ title, images }: { title: string; images: string[] })` — consumed by Task 4's `ProjectCard`. `images` is non-empty; `images[0]` is the cover.
- Note: the lightbox is rendered via `createPortal(…, document.body)` because `ProjectCard` applies a hover `translate` transform, which would otherwise make `position: fixed` resolve against the card.
- Deviation from spec noted: with up to 23 screenshots (Kioscify), dot indicators are unusable — a "n / N" counter is used instead.

- [ ] **Step 1: Write the component** (complete content)

```tsx
"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

export default function ProjectGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${title} screenshots`}
        className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden bg-panel"
      >
        <Image
          src={images[0]}
          alt={`${title} screenshot`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            <Images className="size-3.5" aria-hidden />
            {images.length} shots
          </span>
        )}
      </button>

      {open && (
        <Lightbox title={title} images={images} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function Lightbox({
  title,
  images,
  onClose,
}: {
  title: string;
  images: string[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex w-full max-w-6xl items-center justify-between text-sm text-white/80">
        <span className="font-medium">{title}</span>
        <span>
          {index + 1} / {images.length}
        </span>
      </div>

      <div
        className="relative h-[70vh] w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`${title} screenshot ${index + 1} of ${images.length}`}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      {images.length > 1 && (
        <div
          className="flex items-center gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={prev}
            aria-label="Previous screenshot"
            className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next screenshot"
            className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25"
      >
        <X className="size-5" />
      </button>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 2: Verify it compiles and lints**

Run: `npx tsc --noEmit`
Expected: still only the pre-existing `app/crafts/page.tsx` error from Task 2 — nothing from `components/ProjectGallery.tsx`.
Run: `npm run lint`
Expected: no errors in `components/ProjectGallery.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/ProjectGallery.tsx
git commit -m "Add ProjectGallery client component with screenshot lightbox"
```

---

### Task 4: Update `ProjectCard` and rebuild the crafts page

**Files:**
- Modify: `components/ProjectCard.tsx` (full rewrite below)
- Modify: `app/crafts/page.tsx` (full rewrite below)

**Interfaces:**
- Consumes: `companyGroups`, `Project`, `ProjectLink` from `data/projects.ts` (Task 2); `ProjectGallery` (Task 3).
- Produces: nothing consumed later.
- Card heading drops from `h2` to `h3` because company sections now own the `h2` level.

- [ ] **Step 1: Rewrite `components/ProjectCard.tsx`** (complete content)

```tsx
import type { ComponentType } from "react";
import { ExternalLink, Lock, Smartphone } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project, ProjectLink } from "@/data/projects";
import { WaveDivider } from "@/components/WaveBlob";
import ProjectGallery from "@/components/ProjectGallery";

const linkIcons: Record<
  ProjectLink["kind"],
  ComponentType<{ className?: string }>
> = {
  live: ExternalLink,
  github: FaGithub,
  app: Smartphone,
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-edge bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {project.images?.length ? (
        <ProjectGallery title={project.title} images={project.images} />
      ) : (
        /* Branded placeholder for projects without screenshots */
        <div className="relative aspect-[16/10] overflow-hidden bg-panel">
          <div className="flex h-full items-end justify-between">
            <span
              aria-hidden
              className="pl-6 font-display text-7xl font-extrabold text-white/85 transition-transform duration-500 group-hover:-translate-y-2"
            >
              {project.title.charAt(0)}
            </span>
            <WaveDivider className="absolute inset-x-0 bottom-0 h-10 w-full rotate-180 text-white/25" />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-2xl font-bold">
          {project.title}
          {project.role && (
            <span className="ml-3 inline-block translate-y-[-2px] rounded-full bg-surface px-3 py-1 align-middle font-sans text-xs font-semibold text-brand-deep">
              {project.role}
            </span>
          )}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-brand-deep"
            >
              {tag}
            </li>
          ))}
        </ul>

        {(project.links?.length || project.privateCode) && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-edge pt-4 text-sm font-medium">
            {project.links?.map((link) => {
              const Icon = linkIcons[link.kind];
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 transition-opacity hover:opacity-70 ${
                    link.kind === "github" ? "text-foreground" : "text-brand-deep"
                  }`}
                >
                  <Icon className="size-4" />
                  {link.label}
                </a>
              );
            })}
            {project.privateCode && (
              <span className="inline-flex items-center gap-1.5 text-muted">
                <Lock className="size-4" />
                Private codebase
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Rewrite `app/crafts/page.tsx`** (complete content)

```tsx
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { companyGroups } from "@/data/projects";

export const metadata: Metadata = {
  title: "Crafts — Kevin Dave Gerona",
  description:
    "Projects by Kevin Dave Gerona — founder-built products, AI workflow platforms, fleet systems, and more, for companies across the Philippines, US, Australia, and Israel.",
};

export default function CraftsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 md:pt-36">
      <PageHeader
        eyebrow="Crafts"
        title="Things I've built"
        blurb="Real products for real companies — taxi fleets, vehicle rentals, ed-tech, AI workflow automation, and a store platform I founded. Grouped by the companies I built them with."
      />

      {companyGroups.map((group) => (
        <section key={group.company} className="mt-16">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h2 className="font-display text-3xl font-bold">
                {group.company}
              </h2>
              {group.location && (
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand-deep">
                  {group.location}
                </span>
              )}
              {group.note && (
                <span className="text-sm italic text-muted">{group.note}</span>
              )}
            </div>
          </Reveal>

          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {group.projects.map((project, i) => (
              <Reveal
                key={project.title}
                delay={(i % 3) * 0.08}
                className={
                  group.projects.length === 1 ? "sm:col-span-2" : undefined
                }
              >
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify types and lint are clean**

Run: `npx tsc --noEmit` → Expected: no errors (the Task 2 error is now resolved).
Run: `npm run lint` → Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ProjectCard.tsx app/crafts/page.tsx
git commit -m "Rebuild crafts page with company sections, real projects, and lightbox"
```

---

### Task 5: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds; `/crafts` prerenders as a static page with no warnings about images or client components.

- [ ] **Step 2: Ask Kevin to visually check** (do NOT start the dev server — Kevin runs it himself)

Checklist for Kevin in his running dev server at `/crafts`:
- 8 company sections in significance order; single-project sections show a wider (2-col) card.
- Covers look right (swap any by reordering that project's `images` array in `data/projects.ts`).
- Lightbox: opens on cover click, arrows + ←/→ keys navigate, Esc and backdrop click close, counter shows "n / N", Kioscify's 23 shots all render.
- Placeholder cards for the 5 projects without screenshots.
- Link labels (Kioscify's three links), "Private codebase" notes, role badges (Founder, Co-Founder).
- Light and dark themes both look right.

- [ ] **Step 3: Update memory note** — `portfolio-site.md` says "data-file content still placeholder"; after this plan lands, `data/projects.ts` is real (site.ts/about.ts/skills.ts may still be placeholder).
