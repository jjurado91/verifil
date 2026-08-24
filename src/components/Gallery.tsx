import Image from "next/image";
import { galleryImages } from "@/lib/data";

export function Gallery() {
  return (
    <section id="stories" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-brand-red">
            Kababayans Working Abroad
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Real Filipinos, real opportunities
          </h2>
          <p className="mt-3 text-slate-600">
            Every profile on Verifil is verified — and every deployment is one
            more Filipino working safely, legally, and with support abroad.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.src}
              className={`relative aspect-square overflow-hidden rounded-xl ${
                image.featured ? "col-span-2 row-span-2 aspect-auto" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={image.featured ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"}
                loading={index < 2 ? "eager" : "lazy"}
                className="object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Placeholder gallery — to be replaced with real, consented photos of
          deployed OFWs.
        </p>
      </div>
    </section>
  );
}
