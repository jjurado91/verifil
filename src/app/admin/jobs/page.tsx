import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

const statusStyles: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  filled: "bg-brand-offwhite text-slate-600",
  closed: "bg-slate-200 text-slate-500",
};

export default async function JobsPage() {
  const { data: jobs, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Openings ingested from agencies and hiring principals.
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="rounded-full bg-brand-blue px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
        >
          + Add Job
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red">
          Failed to load jobs: {error.message}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Agency</th>
              <th className="px-4 py-3">Hiring Principal</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Openings</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs?.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  <Link href={`/admin/jobs/${job.id}`} className="hover:underline">
                    {job.role_title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{job.agency_name}</td>
                <td className="px-4 py-3 text-slate-600">
                  {job.hiring_principal}
                </td>
                <td className="px-4 py-3 text-slate-600">{job.country}</td>
                <td className="px-4 py-3 text-slate-600">
                  {job.category}
                  {job.subcategory && (
                    <span className="text-slate-400"> / {job.subcategory}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{job.openings}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[job.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs?.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No jobs yet.
          </p>
        )}
      </div>
    </div>
  );
}
