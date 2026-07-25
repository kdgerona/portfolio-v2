// TODO: replace every entry below with your real bio, experience, and education.

export const bio = {
  lead: "I design and build software end to end — from the first architecture sketch to the last deploy.",
  paragraphs: [
    "I'm Kevin Dave Gerona, a software engineer who enjoys the whole journey of a product: understanding the problem, shaping the system, and shipping something people actually use. Placeholder bio — swap in your real story here.",
    "Over the years I've moved between hands-on development and architecture work, which taught me to care equally about clean code and clean boundaries. Placeholder paragraph — replace with your own background and interests.",
  ],
};

export type TimelineEntry = {
  period: string;
  title: string;
  org: string;
  description: string;
};

export const experience: TimelineEntry[] = [
  {
    period: "2023 — Present",
    title: "Software Architect",
    org: "Placeholder Company",
    description:
      "Leading system design for a multi-tenant SaaS platform — service boundaries, data modeling, and platform migrations. Placeholder entry.",
  },
  {
    period: "2020 — 2023",
    title: "Software Engineer",
    org: "Placeholder Studio",
    description:
      "Built and shipped full-stack features across web and mobile, owning delivery from spec to production monitoring. Placeholder entry.",
  },
  {
    period: "2018 — 2020",
    title: "Software Developer",
    org: "Placeholder Agency",
    description:
      "Developed client web applications and internal tooling, and grew from junior to trusted feature owner. Placeholder entry.",
  },
];

export const education: TimelineEntry[] = [
  {
    period: "2014 — 2018",
    title: "B.S. Computer Science",
    org: "Placeholder University",
    description:
      "Focused on software engineering and distributed systems. Placeholder entry — add honors, thesis, or activities.",
  },
];
