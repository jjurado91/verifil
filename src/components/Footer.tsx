import Image from "next/image";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings-defaults";

const socialIcons = {
  Facebook: (
    <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.35C16.2 4.31 15.2 4.22 14 4.22c-2.35 0-4 1.44-4 4.06V10.5H7.5v3H10V21h3.5Z" />
  ),
  Instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  LinkedIn: (
    <path d="M6.94 8.5a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88ZM5.5 10h2.88v8.5H5.5V10Zm5.25 0h2.76v1.16h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.45 1.92 3.45 4.41v4.41h-2.88v-3.91c0-.93-.02-2.13-1.3-2.13-1.3 0-1.5 1.02-1.5 2.06v3.98h-2.88V10Z" />
  ),
};

export function Footer({ settings = DEFAULT_SITE_SETTINGS }: { settings?: SiteSettings }) {
  const socialLinks = [
    settings.socialFacebook && { name: "Facebook" as const, href: settings.socialFacebook },
    settings.socialInstagram && { name: "Instagram" as const, href: settings.socialInstagram },
    settings.socialLinkedin && { name: "LinkedIn" as const, href: settings.socialLinkedin },
  ].filter((link): link is { name: keyof typeof socialIcons; href: string } => Boolean(link));

  return (
    <footer className="bg-slate-950 py-10 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Image
            src="/logo/verifil-logo.png"
            alt="Verifil"
            width={397}
            height={100}
            className="h-9 w-auto"
          />
          <p className="max-w-md text-sm">
            Verifil is a technology platform built to make overseas
            recruitment transparent, verified, and fair for every Filipino
            worker.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-gold hover:text-slate-900"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                  {socialIcons[social.name]}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Verifil. DMW License No.
            [pending]. All rights reserved.
          </p>
          <p>Placement fees, if any, follow POEA/DMW-mandated limits.</p>
        </div>
      </div>
    </footer>
  );
}
