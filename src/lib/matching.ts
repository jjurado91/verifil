import "server-only";

export type MatchCandidate = {
  id: string;
  full_name: string;
  trade: string | null;
  preferred_country: string | null;
  experience_years: number | null;
  status: string;
};

export type MatchJob = {
  id: string;
  role_title: string;
  agency_name: string;
  country: string;
  category: string;
  subcategory: string | null;
  status: string;
};

export type MatchResult = {
  score: number;
  reasons: string[];
};

function norm(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

/**
 * Rule-based fit score between a candidate and a job — deliberately not
 * AI-driven. Weights: category/trade match dominates, country preference
 * and subcategory overlap add secondary weight, experience nudges score.
 */
export function computeFitScore(
  candidate: MatchCandidate,
  job: MatchJob,
): MatchResult {
  let score = 0;
  const reasons: string[] = [];

  const trade = norm(candidate.trade);
  const category = norm(job.category);
  if (trade && category) {
    if (trade === category) {
      score += 55;
      reasons.push(`Trade matches category (${job.category})`);
    } else if (trade.includes(category) || category.includes(trade)) {
      score += 30;
      reasons.push(`Trade partially matches category (${job.category})`);
    }
  }

  const subcategory = norm(job.subcategory);
  if (subcategory && trade && (trade.includes(subcategory) || subcategory.includes(trade))) {
    score += 15;
    reasons.push(`Matches subcategory (${job.subcategory})`);
  }

  const preferredCountry = norm(candidate.preferred_country);
  const jobCountry = norm(job.country);
  if (preferredCountry && jobCountry) {
    if (preferredCountry === jobCountry) {
      score += 20;
      reasons.push(`Preferred country matches (${job.country})`);
    }
  } else if (!preferredCountry) {
    score += 5;
    reasons.push("No country preference — open to any location");
  }

  if (candidate.experience_years != null) {
    if (candidate.experience_years >= 3) {
      score += 10;
      reasons.push(`${candidate.experience_years} years of experience`);
    } else if (candidate.experience_years >= 1) {
      score += 5;
    }
  }

  if (job.status === "open") {
    score += 5;
  } else {
    reasons.push(`Job is currently ${job.status}`);
  }

  return { score: Math.min(100, Math.round(score)), reasons };
}
