import Link from "next/link";
import { CountryOptions } from "@/components/CountryOptions";
import {
  CANDIDATE_STATUSES,
  hasActiveCandidateFilters,
  type ParsedCandidateFilters,
} from "./candidate-filters";

/**
 * Filter fields only — no <form> wrapper, no submit button, no search
 * input. Meant to be rendered inside a parent <form method="get"> that
 * also contains a search bar and the results table, so one submit
 * carries every param together.
 */
export function CandidateFilterSidebar({
  basePath,
  filters,
  categories,
}: {
  basePath: string;
  filters: ParsedCandidateFilters;
  categories: string[];
}) {
  const hasFilters = hasActiveCandidateFilters(filters);

  return (
    <div className="h-fit rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Filters</h2>
        {hasFilters && (
          <Link
            href={basePath}
            className="text-xs font-semibold text-brand-blue hover:underline"
          >
            Clear
          </Link>
        )}
      </div>

      <div className="mt-4">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Trade / Occupation
        </label>
        <select
          name="trade"
          defaultValue={filters.trade}
          className="mt-2 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        >
          <option value="">All trades</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Preferred Country
        </label>
        <select
          name="country"
          defaultValue={filters.country}
          className="mt-2 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        >
          <option value="">All countries</option>
          <CountryOptions />
        </select>
      </div>

      <div className="mt-4">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Years of experience
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            name="min_exp"
            min={0}
            placeholder="Min"
            defaultValue={filters.minExp}
            className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
          <span className="text-slate-300">–</span>
          <input
            type="number"
            name="max_exp"
            min={0}
            placeholder="Max"
            defaultValue={filters.maxExp}
            className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Availability / Status
        </legend>
        <div className="mt-2 flex flex-col gap-1.5">
          {CANDIDATE_STATUSES.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2 text-sm capitalize text-slate-600"
            >
              <input
                type="checkbox"
                name="status"
                value={s}
                defaultChecked={filters.status.includes(s)}
                className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="mt-5 w-full rounded-full bg-brand-blue py-2 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
      >
        Apply Filters
      </button>
    </div>
  );
}
