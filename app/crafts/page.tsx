import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Crafts — Kevin Dave Gerona",
  description: "Selected projects by Kevin Dave Gerona.",
};

export default function CraftsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 md:pt-36">
      <PageHeader
        eyebrow="Crafts"
        title="Things I've built"
        blurb="A selection of projects across the stack — from developer tooling to full products. Each one taught me something worth keeping."
      />

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 3) * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
