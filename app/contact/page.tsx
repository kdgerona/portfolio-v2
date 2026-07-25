import type { Metadata } from "next";
import { Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SocialLinks from "@/components/SocialLinks";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact — Kevin Dave Gerona",
  description: "Get in touch with Kevin Dave Gerona.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 md:pt-36">
      <PageHeader
        eyebrow="Contact"
        title="Let's build something"
        blurb="Have a project, a role, or just an idea worth talking about? My inbox is open."
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="rounded-3xl bg-panel p-8 text-white">
            <h2 className="font-display text-2xl font-bold">
              Reach me directly
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-flex items-center gap-2.5 font-serif text-lg underline-offset-4 hover:underline"
            >
              <Mail className="size-5" />
              {site.email}
            </a>
            <p className="mt-6 text-sm leading-relaxed text-white/85">
              Or find me where the code and conversations happen:
            </p>
            <SocialLinks className="mt-4 text-white" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
