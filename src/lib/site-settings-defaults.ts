export type SiteSettings = {
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialLinkedin: string | null;
  maintenanceMode: boolean;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  seoTitle: "Verifil - Your Trusted Platform for Filipino Talent Recruitment",
  seoDescription:
    "Submit your CV and get matched with verified employers abroad. No hidden fees. No fake agencies. Verifil is the trusted, tech-driven way to work overseas.",
  ogImageUrl: "/images/hero.webp",
  socialFacebook: "https://www.facebook.com/verifiljobs",
  socialInstagram: "https://www.instagram.com/verifiljobs",
  socialLinkedin: "https://www.linkedin.com/company/verifiljobs",
  maintenanceMode: false,
};
