import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="#top" className="flex items-center gap-2">
          <Image
            src="/logo/verifil-logo.png"
            alt="Verifil"
            width={397}
            height={100}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a href="#jobs" className="hover:text-brand-blue">
            Job Openings
          </a>
          <a href="#how-it-works" className="hover:text-brand-blue">
            How It Works
          </a>
          <a href="#stories" className="hover:text-brand-blue">
            OFW Stories
          </a>
        </nav>

        <a
          href="#apply"
          className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-blue-dark sm:px-5"
        >
          Submit Your CV
        </a>
      </div>
    </header>
  );
}
