"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { bulkAddToJobPipeline, bulkUpdateCandidateStatus } from "./bulk-actions";

const statusStyles: Record<string, string> = {
  new: "bg-brand-offwhite text-slate-600",
  screening: "bg-amber-100 text-amber-700",
  verified: "bg-blue-100 text-blue-700",
  matched: "bg-green-100 text-green-700",
  deployed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export type CandidateRow = {
  id: string;
  full_name: string;
  trade: string | null;
  experience_years: number | null;
  preferred_country: string | null;
  score: number | null;
  status: string;
  assigned_admin_name: string | null;
  pipeline: { active: number; rejected: number } | null;
};

export function CandidatesTable({
  rows,
  jobs,
}: {
  rows: CandidateRow[];
  jobs: { id: string; role_title: string }[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const allSelected = rows.length > 0 && selected.size === rows.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleAddToJob() {
    if (!selectedJob || selected.size === 0) return;
    setBusy(true);
    try {
      await bulkAddToJobPipeline(selectedJob, Array.from(selected));
      setSelected(new Set());
      setSelectedJob("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleBulkStatus() {
    if (!bulkStatus || selected.size === 0) return;
    setBusy(true);
    try {
      await bulkUpdateCandidateStatus(Array.from(selected), bulkStatus);
      setSelected(new Set());
      setBulkStatus("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-brand-blue/30 bg-brand-blue/5 px-4 py-3">
          <span className="text-sm font-bold text-brand-blue">
            {selected.size} selected
          </span>

          <div className="flex items-center gap-2">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            >
              <option value="">Add to job…</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.role_title}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!selectedJob || busy}
              onClick={handleAddToJob}
              className="rounded-full bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
            >
              Add
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            >
              <option value="">Set status…</option>
              <option value="new">New</option>
              <option value="screening">Screening</option>
              <option value="verified">Verified</option>
              <option value="matched">Matched</option>
              <option value="deployed">Deployed</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              type="button"
              disabled={!bulkStatus || busy}
              onClick={handleBulkStatus}
              className="rounded-full bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
            >
              Apply
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                />
              </th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Trade</th>
              <th className="px-4 py-3">Exp.</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Pipeline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">CV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((c) => (
              <tr
                key={c.id}
                className={selected.has(c.id) ? "bg-brand-blue/5" : "hover:bg-slate-50"}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggleOne(c.id)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  <Link href={`/admin/candidates/${c.id}`} className="hover:underline">
                    {c.full_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{c.trade ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">
                  {c.experience_years != null ? `${c.experience_years} yrs` : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">{c.preferred_country ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">
                  {c.score != null ? `${c.score}` : "—"}
                </td>
                <td className="px-4 py-3">
                  {c.pipeline ? (
                    <span className="text-xs font-semibold">
                      <span className="text-green-600">{c.pipeline.active} active</span>
                      {c.pipeline.rejected > 0 && (
                        <>
                          {" · "}
                          <span className="text-brand-red">{c.pipeline.rejected} rejected</span>
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[c.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {c.assigned_admin_name ?? <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/admin/candidates/${c.id}/download`}
                    className="font-semibold text-brand-blue hover:underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No candidates match these filters.
          </p>
        )}
      </div>
    </div>
  );
}
