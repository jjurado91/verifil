"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type SearchResults = {
  candidates: { id: string; full_name: string; trade: string | null }[];
  jobs: { id: string; role_title: string; country: string }[];
  employers: { id: string; company_name: string }[];
};

const EMPTY: SearchResults = { candidates: [], jobs: [], employers: [] };

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < 2) return;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/admin/search?q=${encodeURIComponent(trimmed)}`,
        );
        if (res.ok) setResults(await res.json());
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [trimmed]);

  const displayResults = trimmed.length < 2 ? EMPTY : results;
  const hasResults =
    displayResults.candidates.length > 0 ||
    displayResults.jobs.length > 0 ||
    displayResults.employers.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Search"
        className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-1.5 text-sm outline-none focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
      />

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-96 w-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {loading && (
            <p className="px-2 py-2 text-xs text-slate-400">Searching…</p>
          )}
          {!loading && !hasResults && (
            <p className="px-2 py-2 text-xs text-slate-400">No matches.</p>
          )}

          {displayResults.candidates.length > 0 && (
            <div className="mb-1">
              <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Candidates
              </p>
              {displayResults.candidates.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/candidates/${c.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span className="font-semibold">{c.full_name}</span>
                  {c.trade && (
                    <span className="text-slate-400"> · {c.trade}</span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {displayResults.jobs.length > 0 && (
            <div className="mb-1">
              <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Jobs
              </p>
              {displayResults.jobs.map((j) => (
                <Link
                  key={j.id}
                  href={`/admin/jobs/${j.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span className="font-semibold">{j.role_title}</span>
                  <span className="text-slate-400"> · {j.country}</span>
                </Link>
              ))}
            </div>
          )}

          {displayResults.employers.length > 0 && (
            <div>
              <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Employers
              </p>
              {displayResults.employers.map((e) => (
                <Link
                  key={e.id}
                  href={`/admin/employers/${e.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {e.company_name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
