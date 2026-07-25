"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/data/site";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <nav
        aria-label="Main"
        className="flex items-center justify-between px-5 py-4 sm:px-8 md:py-5"
      >
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          onClick={() => setOpen(false)}
          className="inline-flex items-center"
        >
          {/* The logo renders as two mask layers colored by theme tokens:
              the KDG mark (white on the blue home hero, brand blue elsewhere) and the
              KEVINDAVEGERONA name text on a transparent background (black in light mode,
              light in dark mode so it stays visible) */}
          <span
            role="img"
            aria-label={`${site.shortName} logo`}
            className="relative block size-20 md:size-28"
          >
            <span
              className={`absolute inset-0 [mask-image:url(/logo-mark.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${
                pathname === "/" ? "bg-white" : "bg-brand"
              }`}
            />
            <span
              className={`absolute inset-0 [mask-image:url(/logo-name.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${
                pathname === "/" ? "bg-panel-ink" : "bg-foreground"
              }`}
            />
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-8">
          <ul className="hidden items-center gap-8 font-serif text-[1.05rem] md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-foreground transition-colors hover:text-brand-deep ${
                      active
                        ? "font-semibold underline decoration-current decoration-2 underline-offset-8"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <ThemeToggle />

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-edge bg-background/70 text-foreground backdrop-blur md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-5 rounded-3xl border border-edge bg-background p-4 shadow-lg md:hidden">
          <ul className="flex flex-col font-serif text-lg">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3 transition-colors hover:bg-surface ${
                      active ? "font-semibold text-brand-deep" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
