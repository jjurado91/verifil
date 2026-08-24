export type JobListing = {
  id: string;
  role: string;
  category: string;
  country: string;
  countryFlag: string;
  salaryRange: string;
  contract: string;
};

// Placeholder listings — replace with live data from Supabase once connected.
// Employer identities are intentionally withheld; only country, role, and pay are shown.
export const jobListings: JobListing[] = [
  {
    id: "construction-qa",
    role: "Construction Worker",
    category: "Construction",
    country: "Qatar",
    countryFlag: "🇶🇦",
    salaryRange: "$450 – $600 / month",
    contract: "2-year contract",
  },
  {
    id: "warehouse-ca",
    role: "Warehouse / Logistics Operator",
    category: "Logistics",
    country: "Canada",
    countryFlag: "🇨🇦",
    salaryRange: "$2,800 – $3,400 / month",
    contract: "3-year contract",
  },
  {
    id: "welder-sa",
    role: "Welder / Fabricator",
    category: "Construction",
    country: "Saudi Arabia",
    countryFlag: "🇸🇦",
    salaryRange: "$550 – $750 / month",
    contract: "2-year contract",
  },
  {
    id: "caregiver-jp",
    role: "Caregiver",
    category: "Healthcare & Care",
    country: "Japan",
    countryFlag: "🇯🇵",
    salaryRange: "$1,400 – $1,800 / month",
    contract: "3-year contract",
  },
  {
    id: "electrician-uae",
    role: "Electrician",
    category: "Construction",
    country: "UAE",
    countryFlag: "🇦🇪",
    salaryRange: "$500 – $700 / month",
    contract: "2-year contract",
  },
  {
    id: "driver-de",
    role: "Heavy Equipment Driver",
    category: "Logistics",
    country: "Germany",
    countryFlag: "🇩🇪",
    salaryRange: "$2,600 – $3,000 / month",
    contract: "2-year contract",
  },
];

export const trustStats = [
  { value: "100%", label: "Verified employers" },
  { value: "0", label: "Hidden fees" },
  { value: "24/7", label: "Applicant support" },
  { value: "POEA", label: "Compliant process" },
];

export const processSteps = [
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
];

export type Testimonial = {
  name: string;
  role: string;
  country: string;
  quote: string;
  photo: string;
};

// Placeholder testimonials with stock photography — swap for real, consented
// OFW stories and photos before launch.
export const testimonials: Testimonial[] = [
  {
    name: "Rico M.",
    role: "Welder",
    country: "Deployed to Saudi Arabia",
    quote:
      "Wala akong binayaran na hindi malinaw. Alam ko kung nasaan ang application ko sa bawat step.",
    photo: "/images/testimonials/rico.webp",
  },
  {
    name: "Analyn T.",
    role: "Caregiver",
    country: "Deployed to Japan",
    quote:
      "Mabilis ang processing at may sumusuporta sa akin kahit nasa abroad na ako.",
    photo: "/images/testimonials/analyn.webp",
  },
  {
    name: "Jomar D.",
    role: "Warehouse Operator",
    country: "Deployed to Canada",
    quote:
      "Sa Verifil, alam ko na legit ang employer bago pa ako mag-apply.",
    photo: "/images/testimonials/jomar.webp",
  },
];

export type GalleryImage = {
  src: string;
  alt: string;
  featured?: boolean;
};

// Placeholder gallery — to be replaced with real, consented photos of deployed OFWs.
export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/rebar-work.webp", alt: "Construction worker tying rebar on site", featured: true },
  { src: "/images/gallery/site-inspection.webp", alt: "Workers reviewing a construction site" },
  { src: "/images/gallery/carpentry.webp", alt: "Carpenter measuring and cutting wood" },
  { src: "/images/gallery/scaffolding-team.webp", alt: "Team of workers on scaffolding" },
  { src: "/images/gallery/welding-sparks.webp", alt: "Welder at work with sparks flying" },
  { src: "/images/gallery/cement-pour.webp", alt: "Worker pouring cement on site" },
  { src: "/images/gallery/hammer-work.webp", alt: "Construction worker using a hammer" },
  { src: "/images/gallery/worker-portrait.webp", alt: "Portrait of a construction worker" },
];
