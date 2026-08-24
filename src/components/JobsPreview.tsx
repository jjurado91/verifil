import Link from "next/link";
import { jobListings } from "@/lib/data";

export function JobsPreview() {
  return (
    <section id="jobs" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-brand-red">
            Open Opportunities
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Roles hiring right now
          </h2>
          <p className="mt-3 text-slate-600">
            Employer details are kept private until you&apos;re matched — this
            protects you from fake job postings. What you see below is real:
            the role, the country, and the pay.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobListings.map((job) => (
            <div
              key={job.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden>
                    {job.countryFlag}
                  </span>
                  <span className="rounded-full bg-brand-offwhite px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {job.category}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  {job.role}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {job.country} &middot; {job.contract}
                </p>
                <p className="mt-3 text-base font-extrabold text-brand-blue">
                  {job.salaryRange}
                </p>
              </div>

              <a
                href="#apply"
                className="mt-5 block rounded-full bg-brand-blue py-2.5 text-center text-sm font-bold text-white transition hover:bg-brand-blue-dark"
              >
                Check If You Qualify
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don&apos;t see your trade listed? Submit your CV anyway — new roles
          open every week and we&apos;ll match you as soon as one fits.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-brand-offwhite px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm font-semibold text-slate-700">
            Looking to hire instead? Get verified Filipino talent for your
            team.
          </p>
          <Link
            href="/employers"
            className="shrink-0 rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
          >
            Hire from the Philippines Now
          </Link>
        </div>
      </div>
    </section>
  );
}
