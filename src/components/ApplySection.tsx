import { CvForm } from "@/components/CvForm";

export function ApplySection({ categories }: { categories: string[] }) {
  return (
    <section id="apply" className="bg-brand-blue py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Ready to work abroad?
          </h2>
          <p className="mt-3 text-blue-100">
            Fill out the form below. It takes less than 3 minutes and it&apos;s
            completely free — always.
          </p>
        </div>
        <CvForm categories={categories} />
      </div>
    </section>
  );
}
