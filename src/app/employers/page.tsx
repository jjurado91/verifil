import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Employer Portal | Verifil",
  description:
    "Hire verified, vetted Filipino talent for construction, logistics, healthcare, and more — with transparent pricing and no hidden fees.",
};

const benefits = [
  {
    title: "Vetted, verified candidates",
    description:
      "Every candidate is screened and their credentials checked before you ever see a profile.",
  },
  {
    title: "Transparent, flat pricing",
    description:
      "No hidden fees. You know the cost of a hire before you commit.",
  },
  {
    title: "Fast, digital process",
    description:
      "Skip the back-and-forth with agencies. Search, shortlist, and hire online.",
  },
  {
    title: "Ongoing support",
    description:
      "From contract signing through deployment, we stay involved so hires stick.",
  },
];

export default function EmployersPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-slate-900 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <span className="text-sm font-bold uppercase tracking-wide text-brand-gold">
              Employer Portal
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Hire verified Filipino talent, without the recruitment
              headaches.
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Verifil gives employers direct access to vetted, work-ready
              Filipino candidates across construction, logistics, healthcare,
              and more — with transparent pricing and no hidden fees.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="mailto:hire@verifiljobs.com?subject=Employer%20Inquiry"
                className="rounded-full bg-brand-gold px-7 py-3.5 text-center text-base font-bold text-slate-900 shadow-lg shadow-black/20 transition hover:brightness-95"
              >
                Get in Touch
              </a>
              <Link
                href="/#jobs"
                className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-center text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                See Candidate Pool
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-slate-200 bg-brand-offwhite p-6"
                >
                  <h3 className="text-base font-bold text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900">
                Ready to build your team?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Tell us what roles you&apos;re hiring for and we&apos;ll get
                back to you with a shortlist of verified candidates.
              </p>
              <a
                href="mailto:hire@verifiljobs.com?subject=Employer%20Inquiry"
                className="mt-5 inline-block rounded-full bg-brand-blue px-7 py-3 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
              >
                hire@verifiljobs.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
