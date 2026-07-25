import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { site } from "@/data/site";
import RoleRotator from "@/components/RoleRotator";
import SocialLinks from "@/components/SocialLinks";
import { HeroBlob, RippleRings, WaveDivider } from "@/components/WaveBlob";

export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-x-clip md:block">
      {/* Ripple rings radiating from behind the photo; painted first so the blob covers them on the left */}
      <RippleRings className="pointer-events-none absolute bottom-[-6%] right-[-25%] z-0 w-[130%] text-brand md:bottom-auto md:right-[-12vw] md:top-[2vh] md:h-[min(100vh,1100px)] md:w-auto" />

      {/* Desktop: blue blob fills the left side and S-curves into the white side */}
      <HeroBlob className="pointer-events-none absolute inset-y-0 left-0 hidden h-full w-[58vw] text-panel md:block" />

      {/* Mobile: solid blue panel behind the copy */}
      <div className="relative z-10 bg-panel pb-14 pt-24 md:bg-transparent md:pb-0 md:pt-[17vh]">
        <div className="w-full px-5 sm:px-8 md:pl-[6vw] md:pr-8">
          <div className="md:max-w-[46vw]">
            <p className="font-serif text-base uppercase tracking-[0.22em] text-panel-ink md:text-xl">
              Hello everyone,
            </p>

            <h1 className="mt-2 font-display text-[clamp(3.25rem,6.5vw,6.5rem)] font-bold leading-[1.04]">
              <span className="text-panel-ink">I&rsquo;m </span>
              <span className="text-white">Kevin Dave</span>
              <br className="hidden md:inline" />
              <span className="text-white"> Gerona</span>
            </h1>

            <p className="mt-5 font-display text-[clamp(1.6rem,2.9vw,3.1rem)] font-bold leading-[1.15]">
              <RoleRotator roles={site.roles} />
            </p>

            <div className="mt-10 md:mt-[9vh] md:pl-[4vw]">
              <p className="font-serif text-[clamp(1.05rem,1.6vw,1.55rem)] text-panel-ink">
                {site.tagline}
              </p>
              <Link
                href="/crafts"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-display text-lg font-bold text-brand-deep shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-background dark:text-brand"
              >
                See my crafts
                <ArrowRight className="size-5" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 md:hidden">
              <SocialLinks className="text-panel-ink" />
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2.5 font-serif text-panel-ink transition-opacity hover:opacity-70"
              >
                <Mail className="size-5" />
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: socials + email pinned to the bottom of the hero */}
      <div className="absolute bottom-[5vh] left-[6vw] z-10 hidden w-[40vw] items-center justify-between gap-x-8 md:flex">
        <SocialLinks className="text-panel-ink" />
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center gap-2.5 font-serif text-lg text-panel-ink transition-opacity hover:opacity-70"
        >
          <Mail className="size-5" />
          {site.email}
        </a>
      </div>

      {/* Mobile: blue wave trailing off the panel */}
      <WaveDivider className="z-0 -mt-px h-12 w-full text-panel md:hidden" />

      {/* Photo: bottom-right on desktop, below the panel on mobile */}
      <Image
        src="/hero-photo.png"
        alt={site.name}
        width={500}
        height={500}
        priority
        unoptimized
        className="pointer-events-none relative z-[5] mt-4 w-[90%] max-w-[460px] self-end md:absolute md:bottom-0 md:right-[-2vw] md:mt-0 md:h-[min(90vh,1060px)] md:w-auto md:max-w-none [filter:drop-shadow(0_0_20px_var(--photo-glow))_drop-shadow(0_0_55px_var(--photo-glow))]"
      />
    </section>
  );
}
