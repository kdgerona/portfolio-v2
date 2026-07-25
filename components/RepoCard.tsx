import { FaGithub } from "react-icons/fa6";
import type { OtherProject } from "@/data/projects";

export default function RepoCard({ repo }: { repo: OtherProject }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col gap-3 rounded-3xl border border-edge bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-snug">
          {repo.name}
        </h3>
        <FaGithub className="size-5 shrink-0 text-muted transition-colors group-hover:text-foreground" />
      </div>
      <p className="flex-1 text-sm leading-relaxed text-muted">
        {repo.description}
      </p>
      <span className="self-start rounded-full bg-surface px-3 py-1 text-xs font-medium text-brand-deep">
        {repo.language}
      </span>
    </a>
  );
}
