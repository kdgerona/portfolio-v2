export type SkillCategory = {
  title: string;
  blurb: string;
  skills: string[];
};

// TODO: adjust to your real skill set — placeholder content.
export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    blurb: "The vocabularies I think in.",
    skills: ["TypeScript", "JavaScript", "Python", "Java", "SQL", "Go"],
  },
  {
    title: "Frameworks",
    blurb: "What I build products with.",
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "NestJS",
      "Tailwind CSS",
      "React Native",
    ],
  },
  {
    title: "Architecture & Cloud",
    blurb: "How I design systems that scale.",
    skills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Microservices",
      "Event-driven design",
      "System design",
      "CI/CD",
    ],
  },
  {
    title: "Tools",
    blurb: "The everyday workbench.",
    skills: ["Git", "GitHub Actions", "Figma", "Postman", "Jira", "Vercel"],
  },
];
