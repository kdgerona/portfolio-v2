import type { ComponentType } from "react";
import { ExternalLink, Lock, Smartphone } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project, ProjectLink } from "@/data/projects";
import { WaveDivider } from "@/components/WaveBlob";
import ProjectGallery from "@/components/ProjectGallery";

const linkIcons: Record<
  ProjectLink["kind"],
  ComponentType<{ className?: string }>
> = {
  live: ExternalLink,
  github: FaGithub,
  app: Smartphone,
};

export default function ProjectCard({
  project,
  wide = false,
}: {
  project: Project;
  wide?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-edge bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {project.images?.length ? (
        <ProjectGallery
          title={project.title}
          images={project.images}
          sizes={
            wide
              ? "(max-width: 1024px) 100vw, (max-width: 1200px) 66vw, 780px"
              : undefined
          }
        />
      ) : (
        /* Branded placeholder for projects without screenshots */
        <div className="relative aspect-[16/10] overflow-hidden bg-panel">
          <div className="flex h-full items-end justify-between">
            <span
              aria-hidden
              className="pl-6 font-display text-7xl font-extrabold text-white/85 transition-transform duration-500 group-hover:-translate-y-2"
            >
              {project.title.charAt(0)}
            </span>
            <WaveDivider className="absolute inset-x-0 bottom-0 h-10 w-full rotate-180 text-white/25" />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-2xl font-bold">
          {project.title}
          {project.role && (
            <span className="ml-3 inline-block translate-y-[-2px] rounded-full bg-surface px-3 py-1 align-middle font-sans text-xs font-semibold text-brand-deep">
              {project.role}
            </span>
          )}
        </h3>
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

        {(project.links?.length || project.privateCode) && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-edge pt-4 text-sm font-medium">
            {project.links?.map((link) => {
              const Icon = linkIcons[link.kind];
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 transition-opacity hover:opacity-70 ${
                    link.kind === "github" ? "text-foreground" : "text-brand-deep"
                  }`}
                >
                  <Icon className="size-4" />
                  {link.label}
                </a>
              );
            })}
            {project.privateCode && (
              <span className="inline-flex items-center gap-1.5 text-muted">
                <Lock className="size-4" />
                Private codebase
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
