import Image from "next/image";
import { trustStats } from "@/lib/data";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.webp"
          alt="Filipino overseas workers — nurse, construction worker, and technician"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        <h1 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
          Your <span className="text-brand-gold">trusted platform</span> for
          work abroad
        </h1>

        <p className="mt-4 max-w-lg text-base text-slate-200 sm:text-lg">
          Submit your CV in minutes and get matched with verified employers
          overseas — no illegal recruiters, no hidden fees, no guesswork.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#apply"
            className="rounded-full bg-brand-gold px-7 py-3.5 text-center text-base font-bold text-slate-900 shadow-lg shadow-black/20 transition hover:brightness-95"
          >
            Submit Your CV — It&apos;s Free
          </a>
          <a
            href="#jobs"
            className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-center text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            See Open Jobs
          </a>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-2xl font-extrabold text-white sm:text-3xl">
                {stat.value}
              </dd>
              <dd className="mt-1 text-xs font-medium text-slate-300 sm:text-sm">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
