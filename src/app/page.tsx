import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { JobsPreview } from "@/components/JobsPreview";
import { HowItWorks } from "@/components/HowItWorks";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { ApplySection } from "@/components/ApplySection";
import { Footer } from "@/components/Footer";
import { getCategories } from "@/lib/categories";
import { getSiteContent } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitle ?? undefined,
    description: settings.seoDescription ?? undefined,
    openGraph: {
      title: settings.seoTitle ?? undefined,
      description: settings.seoDescription ?? undefined,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
    twitter: {
      title: settings.seoTitle ?? undefined,
      description: settings.seoDescription ?? undefined,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
  };
}

export default async function Home() {
  const [categories, content, settings] = await Promise.all([
    getCategories(),
    getSiteContent(),
    getSiteSettings(),
  ]);

  if (settings.maintenanceMode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 text-center text-white">
        <h1 className="text-2xl font-extrabold">We&apos;ll be right back</h1>
        <p className="mt-3 max-w-md text-slate-300">
          Verifil is undergoing scheduled maintenance. Please check back
          shortly.
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Hero content={content.hero} trustStats={content.trustStats} />
        <TrustBar />
        <JobsPreview content={content.jobsPreview} />
        <HowItWorks content={content.howItWorks} />
        <Gallery />
        <Testimonials />
        <ApplySection categories={categories} content={content.applySection} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
