import Link from "next/link";
import type { ParsedCandidateFilters } from "./candidate-filters";

export function MyCandidatesToggle({
  basePath,
  filters,
  adminName,
}: {
  basePath: string;
  filters: ParsedCandidateFilters;
  adminName: string;
}) {
  const isActive = filters.assigned === adminName;

  const qs = new URLSearchParams();
  if (filters.q) qs.set("q", filters.q);
  if (filters.trade) qs.set("trade", filters.trade);
  if (filters.country) qs.set("country", filters.country);
  if (filters.minExp) qs.set("min_exp", filters.minExp);
  if (filters.maxExp) qs.set("max_exp", filters.maxExp);
  filters.status.forEach((s) => qs.append("status", s));
  if (!isActive) qs.set("assigned", adminName);
  const href = `${basePath}${qs.toString() ? `?${qs.toString()}` : ""}`;

  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        isActive
          ? "border-brand-blue bg-brand-blue text-white"
          : "border-slate-300 text-slate-600 hover:bg-slate-100"
      }`}
    >
      My Candidates
    </Link>
  );
}
