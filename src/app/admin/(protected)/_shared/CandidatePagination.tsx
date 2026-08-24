import Link from "next/link";
import type { ParsedCandidateFilters } from "./candidate-filters";

function buildHref(basePath: string, filters: ParsedCandidateFilters, page: number) {
  const qs = new URLSearchParams();
  if (filters.q) qs.set("q", filters.q);
  if (filters.trade) qs.set("trade", filters.trade);
  if (filters.country) qs.set("country", filters.country);
  if (filters.minExp) qs.set("min_exp", filters.minExp);
  if (filters.maxExp) qs.set("max_exp", filters.maxExp);
  filters.status.forEach((s) => qs.append("status", s));
  if (page > 1) qs.set("page", String(page));
  const query = qs.toString();
  return `${basePath}${query ? `?${query}` : ""}`;
}

export function CandidatePagination({
  basePath,
  filters,
  totalPages,
}: {
  basePath: string;
  filters: ParsedCandidateFilters;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const current = filters.page;

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <Link
        href={buildHref(basePath, filters, Math.max(1, current - 1))}
        aria-disabled={current === 1}
        className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
          current === 1
            ? "pointer-events-none border-slate-100 text-slate-300"
            : "border-slate-300 text-slate-600 hover:bg-slate-100"
        }`}
      >
        Previous
      </Link>
      <span className="px-2 text-sm text-slate-500">
        Page {current} of {totalPages}
      </span>
      <Link
        href={buildHref(basePath, filters, Math.min(totalPages, current + 1))}
        aria-disabled={current === totalPages}
        className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
          current === totalPages
            ? "pointer-events-none border-slate-100 text-slate-300"
            : "border-slate-300 text-slate-600 hover:bg-slate-100"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
