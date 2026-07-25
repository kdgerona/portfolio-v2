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
        blurb="Everything here shipped. Platforms serving real users today — some built with teams, some end-to-end on my own, and one I founded and still run in production."
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
                <ProjectCard
                  project={project}
                  wide={group.projects.length === 1}
                />
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
