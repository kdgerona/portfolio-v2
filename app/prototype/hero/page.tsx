import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import {
  ArchHero,
  AvatarHero,
  BentoHero,
  TextHero,
} from "@/components/prototype/HeroVariants";

export const metadata: Metadata = {
  title: "Hero prototype (KDG-20)",
  robots: { index: false, follow: false },
};

const variants = [
  { key: "current", label: "Current", render: () => <Hero /> },
  { key: "b1", label: "B1 Arch frame", render: () => <ArchHero /> },
  { key: "b2", label: "B2 Avatar + ring", render: () => <AvatarHero /> },
  { key: "b3", label: "B3 Bento", render: () => <BentoHero /> },
  { key: "c", label: "C Text-led", render: () => <TextHero /> },
];

export default async function HeroPrototypePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { v } = await searchParams;
  const active = variants.find((x) => x.key === v) ?? variants[0];

  return (
    <>
      <nav
        aria-label="Hero variants"
        className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-fit gap-1.5 overflow-x-auto rounded-3xl border border-edge bg-background/90 p-2 shadow-lg backdrop-blur"
      >
        {variants.map((x) => (
          <Link
            key={x.key}
            href={`/prototype/hero?v=${x.key}`}
            aria-current={x.key === active.key ? "page" : undefined}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs sm:px-4 sm:text-sm font-semibold transition-colors ${
              x.key === active.key
                ? "bg-brand text-panel-ink"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {x.label}
          </Link>
        ))}
      </nav>
      <div className={active.key === "current" ? "" : "pt-24 pb-24"}>
        {active.render()}
      </div>
    </>
  );
}
