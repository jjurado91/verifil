import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { JobsPreview } from "@/components/JobsPreview";
import { HowItWorks } from "@/components/HowItWorks";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { ApplySection } from "@/components/ApplySection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <JobsPreview />
        <HowItWorks />
        <Gallery />
        <Testimonials />
        <ApplySection />
      </main>
      <Footer />
    </>
  );
}
