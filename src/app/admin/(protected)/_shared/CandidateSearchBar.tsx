export function CandidateSearchBar({
  defaultValue,
  assigned,
}: {
  defaultValue: string;
  assigned?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {assigned && <input type="hidden" name="assigned" value={assigned} />}
      <div className="relative flex-1">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="m20 20-3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search candidates by name, phone, or email…"
          className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
      >
        Search
      </button>
    </div>
  );
}
