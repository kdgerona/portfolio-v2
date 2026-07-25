export type Project = {
  title: string;
  description: string;
  tags: string[];
  /** Path under /public, e.g. "/projects/my-app.png". Falls back to a branded placeholder when omitted. */
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
};

// TODO: replace with real projects — every entry below is placeholder content.
export const projects: Project[] = [
  {
    // TODO: replace with real project
    title: "Wavelength",
    description:
      "A real-time team retrospective board with live cursors, voting, and action-item export. Built to explore CRDT-based syncing.",
    tags: ["Next.js", "TypeScript", "WebSockets", "PostgreSQL"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/kdgerona",
  },
  {
    // TODO: replace with real project
    title: "Shipmate CLI",
    description:
      "A deployment helper CLI that turns a repo into a zero-config containerized deploy — health checks, rollbacks, and env diffing included.",
    tags: ["Node.js", "Docker", "AWS ECS", "GitHub Actions"],
    githubUrl: "https://github.com/kdgerona",
  },
  {
    // TODO: replace with real project
    title: "Ledgerline",
    description:
      "Personal finance dashboard that ingests bank exports, categorizes spending with rules, and charts trends across accounts.",
    tags: ["React", "NestJS", "Prisma", "Recharts"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/kdgerona",
  },
  {
    // TODO: replace with real project
    title: "Atlas Docs",
    description:
      "An internal architecture-decision-record hub: searchable ADRs, diagram embeds, and review workflows for engineering teams.",
    tags: ["Next.js", "Elasticsearch", "Mermaid", "Tailwind CSS"],
    githubUrl: "https://github.com/kdgerona",
  },
  {
    // TODO: replace with real project
    title: "Queue Studio",
    description:
      "A visual playground for message-queue topologies — simulate producers, consumers, and failure modes before touching production infra.",
    tags: ["TypeScript", "RabbitMQ", "Vite", "D3"],
    liveUrl: "https://example.com",
  },
];
