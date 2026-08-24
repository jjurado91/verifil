"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateJobStatus } from "./actions";

const statusStyles: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  filled: "bg-brand-offwhite text-slate-600",
  closed: "bg-slate-200 text-slate-500",
};

export type JobRow = {
  id: string;
  role_title: string;
  country: string;
  category: string;
  subcategory: string | null;
  added_by_name: string | null;
  added_by_role: string | null;
  created_at: string;
  openings: number;
  status: string;
};

function agingLabel(createdAt: string) {
  const days = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "Today";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export function JobsTable({ jobs }: { jobs: JobRow[] }) {
  const router = useRouter();
  const [rowUpdating, setRowUpdating] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: string) {
    setRowUpdating(id);
    try {
      await updateJobStatus(id, status);
      router.refresh();
    } finally {
      setRowUpdating(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[1040px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Added By</th>
            <th className="px-4 py-3">Added Date</th>
            <th className="px-4 py-3"># Roles</th>
            <th className="px-4 py-3">Aging</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-semibold text-slate-900">
                <Link href={`/admin/jobs/${job.id}`} className="hover:underline">
                  {job.role_title}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{job.country}</td>
              <td className="px-4 py-3 text-slate-600">
                {job.category}
                {job.subcategory && (
                  <span className="text-slate-400"> / {job.subcategory}</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <div>{job.added_by_name ?? "—"}</div>
                {job.added_by_role && (
                  <div className="text-xs capitalize text-slate-400">
                    {job.added_by_role}
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {new Date(job.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-slate-600">{job.openings}</td>
              <td className="px-4 py-3 text-slate-600">
                {agingLabel(job.created_at)}
              </td>
              <td className="px-4 py-3">
                <select
                  value={job.status}
                  disabled={rowUpdating === job.id}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-blue/30 disabled:opacity-60 ${statusStyles[job.status] ?? "bg-slate-100 text-slate-600"}`}
                >
                  <option value="open">Open</option>
                  <option value="filled">Filled</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {jobs.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-slate-400">
          No jobs match these filters.
        </p>
      )}
    </div>
  );
}
