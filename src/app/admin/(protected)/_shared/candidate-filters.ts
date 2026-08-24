export type CandidateFilterParams = {
  q?: string;
  trade?: string;
  country?: string;
  min_exp?: string;
  max_exp?: string;
  status?: string | string[];
  page?: string;
};

export type ParsedCandidateFilters = {
  q: string;
  trade: string;
  country: string;
  minExp: string;
  maxExp: string;
  status: string[];
  page: number;
};

export function parseCandidateFilters(
  params: CandidateFilterParams,
): ParsedCandidateFilters {
  return {
    q: params.q?.trim() ?? "",
    trade: params.trade ?? "",
    country: params.country ?? "",
    minExp: params.min_exp ?? "",
    maxExp: params.max_exp ?? "",
    status: params.status
      ? Array.isArray(params.status)
        ? params.status
        : [params.status]
      : [],
    page: Math.max(1, Number(params.page) || 1),
  };
}

export function hasActiveCandidateFilters(f: ParsedCandidateFilters) {
  return Boolean(
    f.q || f.trade || f.country || f.minExp || f.maxExp || f.status.length,
  );
}

export const CANDIDATE_STATUSES = [
  "new",
  "screening",
  "verified",
  "matched",
  "deployed",
  "rejected",
];

export const PAGE_SIZE = 20;
