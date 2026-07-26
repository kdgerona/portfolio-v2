import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";
import {
  bio,
  certifications,
  companyExperience,
  education,
  freelanceExperience,
  type TimelineEntry,
} from "@/data/about";

export const metadata: Metadata = {
  title: "About — Kevin Dave Gerona",
  description:
    "About Kevin Dave Gerona — software engineer from Cebu, Philippines: bio, company and freelance experience, education, and certifications.",
};

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative flex flex-col gap-10 border-l-2 border-edge pl-8">
      {entries.map((entry) => (
        <li key={`${entry.org}-${entry.title}`} className="relative">
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
          {(entry.location || entry.chips?.length) && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {entry.location && (
                <li className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand-deep">
                  {entry.location}
                </li>
              )}
              {entry.chips?.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-brand-deep"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
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
        <h3 className="mb-8 font-serif text-sm uppercase tracking-widest text-muted">
          Companies
        </h3>
        <Timeline entries={companyExperience} />
        <h3 className="mb-8 mt-14 font-serif text-sm uppercase tracking-widest text-muted">
          Freelance &amp; Independent
        </h3>
        <Timeline entries={freelanceExperience} />
        <a
          href={site.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-brand-deep transition-opacity hover:opacity-70"
        >
          <FaLinkedin className="size-4" aria-hidden />
          Full career history on LinkedIn
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </Reveal>

      <Reveal className="mt-20">
        <h2 className="mb-10 font-display text-3xl font-bold">Education</h2>
        <Timeline entries={education} />
      </Reveal>

      <Reveal className="mt-20">
        <h2 className="mb-10 font-display text-3xl font-bold">
          Certifications
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <li
              key={cert.title}
              className="rounded-3xl border border-edge bg-background p-6 shadow-sm"
            >
              <p className="font-serif text-sm uppercase tracking-widest text-brand-deep">
                {cert.period}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold">
                {cert.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
