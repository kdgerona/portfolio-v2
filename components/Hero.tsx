import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/data/site";
import RoleRotator from "@/components/RoleRotator";
import SocialLinks from "@/components/SocialLinks";
import { RippleRings } from "@/components/WaveBlob";

export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-5xl flex-col items-center justify-center gap-12 overflow-clip px-5 py-16 sm:px-8 md:flex-row md:gap-16">
      {/* Avatar wrapped in the orbit rings; rings are centered on the avatar and clipped by the section */}
      <div className="relative size-[min(72vw,320px)] shrink-0">
        <RippleRings className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[330%] max-w-none -translate-x-1/2 -translate-y-1/2 text-brand" />
        <div className="relative z-10 size-full overflow-hidden rounded-full border-2 border-brand bg-surface">
          <Image
            src="/hero-photo.png"
            alt={site.name}
            width={500}
            height={500}
            priority
            sizes="(max-width: 640px) 72vw, 320px"
            className="size-full object-cover object-top"
          />
        </div>
      </div>

      <div className="relative z-10 text-center md:text-left">
        <p className="font-serif text-sm uppercase tracking-[0.22em] text-muted md:text-lg">
          Hello everyone,
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold leading-[1.05] md:text-7xl">
          I&rsquo;m Kevin Dave <span className="text-brand">Gerona</span>
        </h1>
        <p className="mt-4 font-display text-3xl font-bold md:text-4xl">
          <RoleRotator roles={site.roles} />
        </p>
        <p className="mt-5 font-serif text-lg text-muted">{site.tagline}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:justify-start">
          <Link
            href="/crafts"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 font-display text-lg font-bold text-panel-ink shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            See my crafts
            <ArrowRight className="size-5" />
          </Link>
          <SocialLinks className="text-foreground" />
        </div>
      </div>
    </section>
  );
}
