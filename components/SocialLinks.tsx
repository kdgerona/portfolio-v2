import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { site } from "@/data/site";

const links = [
  { label: "Facebook", href: site.socials.facebook, Icon: FaFacebookF },
  { label: "GitHub", href: site.socials.github, Icon: FaGithub },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: FaLinkedinIn },
];

export default function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-5 ${className ?? ""}`}>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex transition-transform hover:-translate-y-0.5"
          >
            <Icon className="size-7" />
          </a>
        </li>
      ))}
    </ul>
  );
}
