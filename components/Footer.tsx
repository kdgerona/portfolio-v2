import Link from "next/link";
import { Mail } from "lucide-react";
import { navLinks, site } from "@/data/site";
import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  return (
    <footer className="border-t border-edge bg-surface">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span
            role="img"
            aria-label={`${site.shortName} logo`}
            className="relative block size-14 shrink-0"
          >
            <span className="absolute inset-0 bg-brand [mask-image:url(/logo-mark.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            <span className="absolute inset-0 bg-foreground [mask-image:url(/logo-name.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">{site.name}</p>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-brand-deep"
            >
              <Mail className="size-3.5" />
              {site.email}
            </a>
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-serif text-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted transition-colors hover:text-brand-deep"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <SocialLinks className="text-muted [&_svg]:size-5" />
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
