export const bio = {
  lead: "I design and build software end to end — from the first architecture sketch to the last deploy.",
  paragraphs: [
    "I'm Kevin Dave Gerona, a software engineer based in Cebu, Philippines. Since 2018, I've grown steadily — from developer, to team lead, to senior engineer — building SaaS platforms, transport systems, mobile apps, and complex backend systems, along with the system designs and architectures behind them — and I work with international clients and teams across the Philippines, the US, Australia, and Israel.",
    "Today I'm a Senior Software Engineer at Adaca, working with Australian client teams, and in my own time I built and founded Kioscify, a multi-tenant smart store management & monitoring platform (DMS). Through the years I've developed a real passion for system design and software architecture — and for exploring whatever new technology is around the corner. I care as much about clean boundaries as I do about shipped, working product.",
  ],
};

export type TimelineEntry = {
  period: string;
  title: string;
  subtitle?: string;
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
    chips: ["US-based"],
    description:
      "Joined as part of the pioneering team building a SaaS application from scratch, and was promoted after a year to Team Lead for the GoRentals and Platform projects — onboarding and training newly hired developers along the way. Advanced to Senior Lead Full Stack Developer leading multiple teams, and also served as Team Lead for Research and Development, where we experimented with and evaluated new tech solutions.",
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
      "A Smart Store Management & Monitoring Platform (DMS) — store portal, company portal, and the kiosk app itself — built from architecture to release.",
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
    title: "Bachelor of Science in Information Technology",
    subtitle: "Major in Web Applications Development",
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

