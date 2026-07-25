# Crafts Page — Design

**Date:** 2026-07-25
**Status:** Approved by Kevin

## Goal

Replace the placeholder crafts page content with Kevin's 12 real projects, sourced from
`~/KDFiles/personal/portfolio assets/Projects Docs.docx` (screenshots + links) and
`portfolio_descriptions.docx` (descriptions + tech stacks). Projects are grouped by
company, ordered by significance, with screenshot lightboxes.

## Data model

`data/projects.ts` is rewritten. The exported shape changes from a flat `Project[]`
to company groups (only `app/crafts/page.tsx` and `components/ProjectCard.tsx`
consume this module, so nothing else breaks):

```ts
export type ProjectLink = { label: string; url: string; kind: "live" | "github" | "app" };

export type Project = {
  title: string;
  role?: string;            // "Founder", "Co-Founder"
  description: string;      // verbatim from portfolio_descriptions.docx
  tags: string[];           // FULL tech list — all tags render on the card (Kevin's choice)
  images?: string[];        // paths under /public/projects/<slug>/; first entry is the cover
  links?: ProjectLink[];    // only links that actually exist, each with its own label
  privateCode?: boolean;    // true → card shows a "Private codebase" lock note
};

export type CompanyGroup = {
  company: string;
  location?: string;        // "PH", "US", "AU", "Israel"
  note?: string;            // "Freelance", "On-the-job training"
  projects: Project[];
};

export const companyGroups: CompanyGroup[];
```

## Section order (by significance)

1. Independent / Founder — **Kioscify** (Founder)
2. Digital Business Process (DBP), US — **SkAIForm Platform** (Co-Founder)
3. Adaca, AU — **The Desktop**
4. DNA Micro, US — Platform 7, GoRentals, Navitaire
5. Tech Hub Solutions LLC, US (Freelance) — Ground Command
6. Concise Nursing, Israel (Freelance) — Concise Nursing
7. Micab Systems Corp., PH — Micab Fleet Portal, Micab Concierge App, MICARGO
8. Ferret9, PH (On-the-job training) — Dental Job Staffing System

## Page layout (`app/crafts/page.tsx`)

- Keeps existing `PageHeader` and `Reveal` scroll animations.
- Renders one section per `CompanyGroup`: company name heading, location chip,
  optional note (Freelance / OJT), then that company's project cards in the existing
  responsive grid (1 / 2 / 3 columns). Single-project sections may use a wider card —
  final call made visually during implementation.

## Cards & lightbox

- `ProjectCard` extended:
  - Cover image = `images[0]`; a small count badge (e.g. "5 shots") when more exist.
  - Clicking the image opens the lightbox with all of that project's screenshots.
  - No images → keep the current branded wave/initial placeholder.
  - All tags render (no truncation).
  - Links render only when real, each with its own label (Kioscify: Store Portal,
    Company Portal, GitHub). The Kiosk App has no public download URL by Kevin's
    choice — it renders as a non-link `appBadge` with a phone icon instead.
    `privateCode` renders a lock icon + "Private codebase" note.
  - Optional `role` renders near the title (e.g. "Founder").
- New `Lightbox` client component, hand-rolled (no new dependencies):
  full-screen overlay, prev/next arrows, dot indicators, Esc to close,
  arrow-key navigation, basic focus handling/aria.

## Images

- ~42 screenshots were embedded in Projects Docs.docx (already extracted to scratchpad).
- Projects **with** screenshots: Micab Fleet Portal, GoRentals, Ground Command,
  Concise Nursing, SkAIForm, The Desktop, Kioscify.
- Projects **without** (use placeholder): Dental Job Staffing, Micab Concierge App,
  MICARGO, Platform 7, Navitaire.
- Implementation maps each image to its project via the docx `document.xml` ordering,
  copies them to `public/projects/<slug>/NN.png` with clean names, and picks a
  sensible cover per project. Kevin reviews/swaps covers after seeing the page.

## Constraints & notes

- **AGENTS.md warning applies:** this repo's Next.js has breaking changes — read the
  relevant guides in `node_modules/next/dist/docs/` before writing page/Image code.
- No new npm dependencies.
- Kevin runs `npm run dev` himself — do not start the dev server.
- Metadata description on the crafts page should be updated to reflect real content.

## Testing

- `npm run build` (or lint + typecheck) passes.
- Manual visual check by Kevin in his running dev server: grouping, order, covers,
  lightbox keyboard nav, placeholder cards, link labels, dark/light themes.
