"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, MapPin, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/data/site";
import ThemedRoleRotator from "@/components/prototype/ThemedRoleRotator";
import SocialLinks from "@/components/SocialLinks";

/* Throwaway prototype variants for KDG-20. Portraits never render wider than 320 CSS px. */

const years = new Date().getFullYear() - 2018; // "Since 2018" (data/about.ts bio)
const stack = "TypeScript · React · NestJS";

function Portrait({ className }: { className?: string }) {
  return (
    <Image
      src="/hero-photo.png"
      alt={site.name}
      width={500}
      height={500}
      priority
      sizes="(max-width: 640px) 80vw, 320px"
      className={className}
    />
  );
}

function Chip({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute z-20 flex items-center gap-2 rounded-2xl border border-edge bg-background/70 px-3.5 py-2 text-sm font-semibold shadow-lg backdrop-blur-md ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/crafts"
      className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 font-display text-lg font-bold text-panel-ink shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {children}
      <ArrowRight className="size-5" />
    </Link>
  );
}

/** B1 — tall arch, cutout breaking out of the top edge, floating glass chips. */
export function ArchHero() {
  return (
    <section className="mx-auto grid min-h-[calc(100svh-6rem)] max-w-6xl items-center gap-12 overflow-x-clip px-5 py-10 sm:px-8 md:grid-cols-2">
      <div>
        <p className="font-serif text-sm uppercase tracking-[0.22em] text-muted md:text-lg">
          Hello everyone,
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold leading-[1.05] md:text-7xl">
          I&rsquo;m <span className="text-brand">Kevin Dave Gerona</span>
        </h1>
        <p className="mt-4 font-display text-3xl font-bold md:text-4xl">
          <ThemedRoleRotator roles={site.roles} />
        </p>
        <p className="mt-5 max-w-md font-serif text-lg text-muted">
          {site.tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <CtaButton>See my crafts</CtaButton>
          <SocialLinks className="text-foreground" />
        </div>
      </div>

      <div className="relative mx-auto mt-16 w-[min(80vw,320px)] md:mt-24">
        {/* arch backdrop */}
        <div className="aspect-[4/4.4] w-full rounded-t-[999px] rounded-b-[2rem] bg-gradient-to-b from-brand to-brand-deep opacity-90 dark:from-brand-deep dark:to-panel" />
        {/* cutout overlaps the arch top and bleeds out of it */}
        <div className="absolute inset-x-0 bottom-0 z-10 [clip-path:inset(-60%_-20%_0_-20%_round_0_0_2rem_2rem)]">
          <Portrait className="w-full" />
        </div>
        <Chip className="-left-4 top-[28%] sm:-left-12" delay={0}>
          <Code2 className="size-4 text-brand" /> Fullstack
        </Chip>
        <Chip className="-right-3 top-[48%] sm:-right-12" delay={1}>
          <Sparkles className="size-4 text-brand" /> {years}+ yrs experience
        </Chip>
        <Chip className="bottom-6 -left-3 sm:-left-14" delay={2}>
          <span className="size-2 rounded-full bg-brand" /> {stack}
        </Chip>
      </div>
    </section>
  );
}

/** B2 — circular portrait with an animated conic gradient ring, beside the name. */
export function AvatarHero() {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto flex min-h-[calc(100svh-6rem)] max-w-5xl flex-col items-center justify-center gap-10 px-5 py-10 sm:px-8 md:flex-row md:gap-16">
      <div className="relative size-[min(72vw,320px)] shrink-0">
        <motion.div
          aria-hidden
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--brand),var(--brand-deep),#a78bfa,var(--brand))] blur-[2px]"
        />
        <div className="absolute inset-[6px] overflow-hidden rounded-full bg-surface">
          <Portrait className="size-full object-cover object-top" />
        </div>
      </div>
      <div className="text-center md:text-left">
        <p className="font-serif text-sm uppercase tracking-[0.22em] text-muted md:text-lg">
          Hello everyone,
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold leading-[1.05] md:text-7xl">
          I&rsquo;m Kevin Dave <span className="text-brand">Gerona</span>
        </h1>
        <p className="mt-4 font-display text-3xl font-bold md:text-4xl">
          <ThemedRoleRotator roles={site.roles} />
        </p>
        <p className="mt-5 font-serif text-lg text-muted">{site.tagline}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:justify-start">
          <CtaButton>See my crafts</CtaButton>
          <SocialLinks className="text-foreground" />
        </div>
      </div>
    </section>
  );
}

/** B3 — bento grid: portrait, role, location/availability, CTA. */
export function BentoHero() {
  const tile = "rounded-3xl border border-edge bg-surface p-6";
  return (
    <section className="mx-auto min-h-[calc(100svh-6rem)] max-w-6xl px-5 py-10 sm:px-8">
      <div className="grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto]">
        <div className={`${tile} md:col-span-4`}>
          <p className="font-serif text-sm uppercase tracking-[0.22em] text-muted">
            Hello everyone,
          </p>
          <h1 className="mt-2 font-display text-5xl font-bold leading-[1.05] md:text-7xl">
            I&rsquo;m <span className="text-brand">Kevin Dave Gerona</span>
          </h1>
        </div>
        <div className="relative flex items-end justify-center overflow-hidden rounded-3xl border border-edge bg-gradient-to-b from-brand/30 to-brand-deep/30 md:col-span-2 md:row-span-2">
          <Portrait className="w-[min(80vw,320px)]" />
        </div>
        <div className={`${tile} md:col-span-2`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Role
          </p>
          <p className="mt-2 font-display text-3xl font-bold">
            <ThemedRoleRotator roles={site.roles} />
          </p>
        </div>
        <div className={`${tile} md:col-span-1`}>
          <MapPin className="size-5 text-brand" />
          <p className="mt-2 font-display text-xl font-bold leading-tight">
            Cebu, PH
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
            Open to work
          </p>
        </div>
        <div className="flex flex-col justify-between gap-5 rounded-3xl bg-brand p-6 text-panel-ink md:col-span-1">
          <p className="font-serif text-base">{site.tagline}</p>
          <Link
            href="/crafts"
            className="inline-flex items-center gap-2 font-display text-lg font-bold underline-offset-4 hover:underline"
          >
            See my crafts <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** C — text-led: big type, role rotator and a code-window card; no photo. */
export function TextHero() {
  const reduce = useReducedMotion();
  return (
    <div className="relative overflow-x-clip">
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { scale: [1, 1.15, 1], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-0 top-10 size-96 rounded-full bg-gradient-to-br from-brand to-[#a78bfa] opacity-30 blur-3xl"
      />
      <section className="relative mx-auto grid min-h-[calc(100svh-6rem)] max-w-6xl items-center gap-12 px-5 py-10 sm:px-8 md:grid-cols-[1.3fr_1fr]">
        <div className="relative">
          <p className="font-serif text-sm uppercase tracking-[0.22em] text-muted md:text-lg">
            Hello everyone, I&rsquo;m
          </p>
          <h1 className="mt-2 font-display text-[clamp(3.25rem,7vw,6.5rem)] font-extrabold leading-[0.95]">
            Kevin Dave <span className="text-brand">Gerona</span>
          </h1>
          <p className="mt-5 font-display text-3xl font-bold md:text-5xl">
            <ThemedRoleRotator roles={site.roles} />
          </p>
          <p className="mt-5 font-serif text-lg text-muted">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <CtaButton>See my crafts</CtaButton>
            <SocialLinks className="text-foreground" />
          </div>
        </div>
        <div className="relative rounded-2xl border border-edge bg-surface/80 shadow-xl backdrop-blur-md">
          <div
            className="flex gap-1.5 border-b border-edge px-4 py-3"
            aria-hidden
          >
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-sm leading-7 text-foreground">
            <code>
              <span className="text-brand">const</span> kevin = {"{"}
              {"\n  "}role:{" "}
              <span className="text-muted">&quot;{site.roles[0]}&quot;</span>,
              {"\n  "}since: <span className="text-brand">2018</span>,{"\n  "}
              stack: <span className="text-muted">&quot;{stack}&quot;</span>,
              {"\n  "}base:{" "}
              <span className="text-muted">&quot;Cebu, PH&quot;</span>,{"\n"}
              {"}"};
            </code>
          </pre>
        </div>
      </section>
    </div>
  );
}
