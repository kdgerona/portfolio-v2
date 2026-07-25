import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project } from "@/data/projects";
import { WaveDivider } from "@/components/WaveBlob";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-edge bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-panel">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          /* Branded placeholder until a real screenshot is added */
          <div className="flex h-full items-end justify-between">
            <span
              aria-hidden
              className="pl-6 font-display text-7xl font-extrabold text-white/85 transition-transform duration-500 group-hover:-translate-y-2"
            >
              {project.title.charAt(0)}
            </span>
            <WaveDivider className="absolute inset-x-0 bottom-0 h-10 w-full rotate-180 text-white/25" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">{project.title}</h2>
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

        {(project.liveUrl || project.githubUrl) && (
          <div className="flex items-center gap-5 border-t border-edge pt-4 text-sm font-medium">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-deep transition-opacity hover:opacity-70"
              >
                <ExternalLink className="size-4" />
                Live site
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground transition-opacity hover:opacity-70"
              >
                <FaGithub className="size-4" />
                Code
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
