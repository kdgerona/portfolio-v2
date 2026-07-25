import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { bio, education, experience } from "@/data/about";

export const metadata: Metadata = {
  title: "About — Kevin Dave Gerona",
  description:
    "About Kevin Dave Gerona — Software Engineer, Developer, and Architect.",
};

function Timeline({ entries }: { entries: typeof experience }) {
  return (
    <ol className="relative flex flex-col gap-10 border-l-2 border-edge pl-8">
      {entries.map((entry) => (
        <li key={`${entry.period}-${entry.title}`} className="relative">
          <span
            aria-hidden
            className="absolute -left-[2.4rem] top-1.5 size-4 rounded-full border-4 border-background bg-brand"
          />
          <p className="font-serif text-sm uppercase tracking-widest text-brand-deep">
            {entry.period}
          </p>
          <h3 className="mt-1 font-display text-2xl font-bold">
            {entry.title}
            <span className="font-serif text-lg font-normal text-muted">
              {" "}
              · {entry.org}
            </span>
          </h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-muted">
            {entry.description}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 md:pt-36">
      <PageHeader eyebrow="About me" title="The person behind the code" />

      <Reveal className="mt-12">
        <p className="max-w-3xl font-display text-2xl font-semibold leading-snug md:text-3xl">
          {bio.lead}
        </p>
        <div className="mt-6 flex max-w-3xl flex-col gap-4 leading-relaxed text-muted">
          {bio.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-20">
        <h2 className="mb-10 font-display text-3xl font-bold">Experience</h2>
        <Timeline entries={experience} />
      </Reveal>

      <Reveal className="mt-20">
        <h2 className="mb-10 font-display text-3xl font-bold">Education</h2>
        <Timeline entries={education} />
      </Reveal>
    </div>
  );
}
