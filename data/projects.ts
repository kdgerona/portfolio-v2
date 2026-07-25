export type ProjectLink = {
  label: string;
  url: string;
  kind: "live" | "github";
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
  /** Non-link badge for an app with no public download URL (e.g. an Android APK). */
  appBadge?: string;
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
          "A cloud-based, multi-tenant store management and monitoring platform designed and built end-to-end as founder. Spans an Android mobile app, web admin portals for both individual stores and companies, a backend API, and the underlying database architecture. In production with a partner company that runs Kioscify across all of its company-owned stores, plus franchisee-owned stores that are active subscribers.",
        tags: [
          "ReactJS", "Redux", "React Native", "Expo", "NativeWind", "NextJS",
          "Tailwind", "NestJS", "Prisma", "Swagger", "MongoDB", "Redis",
          "Turborepo", "AWS", "DigitalOcean", "Cloudflare"
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
        appBadge: "Kiosk App (APK, Android only)",
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
          "ReactJS", "TypeScript", "XState", "Tailwind", "NodeJS", "NestJS", "Commander",
          "Redis", "RethinkDB", "MongoDB", "Socket.IO", "Kafka", "RabbitMQ",
          "OpenTelemetry", "GraphQL", "gRPC", "MySQL", "Elasticsearch",
          "Nginx", "CI/CD", "AWS", "Linux", "Microservices",
          "System Design/Architecture", "Turborepo", "Docker",
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
