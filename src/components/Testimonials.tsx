import Image from "next/image";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="bg-brand-offwhite py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
            >
              <blockquote className="flex-1 text-sm italic text-slate-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t.role} &middot; {t.country}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
