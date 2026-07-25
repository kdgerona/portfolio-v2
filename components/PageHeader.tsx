import { Squiggle } from "@/components/WaveBlob";
import Reveal from "@/components/Reveal";

export default function PageHeader({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <Reveal>
      <p className="font-serif text-sm uppercase tracking-[0.22em] text-brand-deep">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <Squiggle className="mt-4 h-3 w-28 text-brand" />
      {blurb && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {blurb}
        </p>
      )}
    </Reveal>
  );
}
