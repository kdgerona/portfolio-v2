import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { skillCategories } from "@/data/skills";

export const metadata: Metadata = {
  title: "Skills — Kevin Dave Gerona",
  description:
    "Languages, frameworks, architecture, and tools Kevin Dave Gerona works with.",
};

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 md:pt-36">
      <PageHeader
        eyebrow="Skills"
        title="What I work with"
        blurb="The languages, frameworks, and practices I reach for — grouped by how I actually use them."
      />

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {skillCategories.map((category, i) => (
          <Reveal key={category.title} delay={(i % 2) * 0.08}>
            <section className="h-full rounded-3xl border border-edge bg-surface p-8">
              <h2 className="font-display text-2xl font-bold">
                {category.title}
              </h2>
              <p className="mt-1 font-serif text-sm text-muted">
                {category.blurb}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-edge bg-background px-4 py-1.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand-deep"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
