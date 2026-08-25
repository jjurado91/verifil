import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type HomepageContent = {
  hero: {
    headlinePrefix: string;
    headlineHighlight: string;
    headlineSuffix: string;
    subheadline: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  trustStats: { value: string; label: string }[];
  jobsPreview: {
    eyebrow: string;
    heading: string;
    subtext: string;
    hireCalloutText: string;
    hireCalloutButtonLabel: string;
  };
  howItWorks: {
    eyebrow: string;
    heading: string;
    steps: { step: string; title: string; description: string }[];
  };
  applySection: {
    heading: string;
    subtext: string;
  };
};

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  hero: {
    headlinePrefix: "Your",
    headlineHighlight: "trusted platform",
    headlineSuffix: "for work abroad",
    subheadline:
      "Submit your CV in minutes and get matched with verified employers overseas — no illegal recruiters, no hidden fees, no guesswork.",
    primaryCtaLabel: "Submit Your CV — It's Free",
    secondaryCtaLabel: "See Open Jobs",
  },
  trustStats: [
    { value: "100%", label: "Verified employers" },
    { value: "0", label: "Hidden fees" },
    { value: "24/7", label: "Applicant support" },
    { value: "POEA", label: "Compliant process" },
  ],
  jobsPreview: {
    eyebrow: "Open Opportunities",
    heading: "Roles hiring right now",
    subtext:
      "Employer details are kept private until you're matched — this protects you from fake job postings. What you see below is real: the role, the country, and the pay.",
    hireCalloutText:
      "Looking to hire instead? Get verified Filipino talent for your team.",
    hireCalloutButtonLabel: "Hire from the Philippines Now",
  },
  howItWorks: {
    eyebrow: "How It Works",
    heading: "From CV to deployment, fully tracked",
    steps: [
      {
        step: "1",
        title: "Submit your CV",
        description:
          "Create your profile and upload your CV in minutes — no walk-ins, no long lines.",
      },
      {
        step: "2",
        title: "Get verified",
        description:
          "Our team checks your documents and credentials so employers know you're the real deal.",
      },
      {
        step: "3",
        title: "Get matched",
        description:
          "We match you to open roles based on your skills, experience, and preferred country.",
      },
      {
        step: "4",
        title: "Deploy with support",
        description:
          "From contract signing to your first months abroad, we stay with you every step.",
      },
    ],
  },
  applySection: {
    heading: "Ready to work abroad?",
    subtext:
      "Fill out the form below. It takes less than 3 minutes and it's completely free — always.",
  },
};

function mergeWithDefaults(content: Partial<HomepageContent> | null): HomepageContent {
  if (!content) return DEFAULT_HOMEPAGE_CONTENT;
  return {
    hero: { ...DEFAULT_HOMEPAGE_CONTENT.hero, ...content.hero },
    trustStats: content.trustStats?.length
      ? content.trustStats
      : DEFAULT_HOMEPAGE_CONTENT.trustStats,
    jobsPreview: { ...DEFAULT_HOMEPAGE_CONTENT.jobsPreview, ...content.jobsPreview },
    howItWorks: {
      ...DEFAULT_HOMEPAGE_CONTENT.howItWorks,
      ...content.howItWorks,
      steps: content.howItWorks?.steps?.length
        ? content.howItWorks.steps
        : DEFAULT_HOMEPAGE_CONTENT.howItWorks.steps,
    },
    applySection: { ...DEFAULT_HOMEPAGE_CONTENT.applySection, ...content.applySection },
  };
}

export const getSiteContent = cache(async (): Promise<HomepageContent> => {
  const { data } = await supabaseAdmin
    .from("site_content")
    .select("content")
    .eq("id", "homepage")
    .maybeSingle();

  return mergeWithDefaults(
    (data?.content as Partial<HomepageContent> | null) ?? null,
  );
});
