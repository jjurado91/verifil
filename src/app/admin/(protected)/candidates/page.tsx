import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getCategories } from "@/lib/categories";
import { CandidateFilterSidebar } from "../_shared/CandidateFilterSidebar";
import { CandidateSearchBar } from "../_shared/CandidateSearchBar";
import { CandidatePagination } from "../_shared/CandidatePagination";
import {
  parseCandidateFilters,
  PAGE_SIZE,
  type CandidateFilterParams,
} from "../_shared/candidate-filters";

const statusStyles: Record<string, string> = {
  new: "bg-brand-offwhite text-slate-600",
  screening: "bg-amber-100 text-amber-700",
  verified: "bg-blue-100 text-blue-700",
  matched: "bg-green-100 text-green-700",
  deployed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<CandidateFilterParams>;
}) {
  const filters = parseCandidateFilters(await searchParams);

  let query = supabaseAdmin
    .from("candidates")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.q) {
    query = query.or(
      `full_name.ilike.%${filters.q}%,phone.ilike.%${filters.q}%,email.ilike.%${filters.q}%`,
    );
  }
  if (filters.trade) query = query.eq("trade", filters.trade);
  if (filters.country) query = query.eq("preferred_country", filters.country);
  if (filters.minExp) query = query.gte("experience_years", Number(filters.minExp));
  if (filters.maxExp) query = query.lte("experience_years", Number(filters.maxExp));
  if (filters.status.length > 0) query = query.in("status", filters.status);

  const from = (filters.page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const [{ data: candidates, error, count }, { data: applications }, categories] =
    await Promise.all([
      query.range(from, to),
      supabaseAdmin.from("job_applications").select("candidate_id, status"),
      getCategories(),
    ]);

  const pipelineCounts = new Map<string, { active: number; rejected: number }>();
  for (const app of applications ?? []) {
    const counts = pipelineCounts.get(app.candidate_id) ?? { active: 0, rejected: 0 };
    if (app.status === "rejected") counts.rejected += 1;
    else counts.active += 1;
    pipelineCounts.set(app.candidate_id, counts);
  }

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Candidates</h1>

      <form
        method="get"
        className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]"
      >
        <CandidateFilterSidebar
          basePath="/admin/candidates"
          filters={filters}
          categories={categories}
        />

        <div className="min-w-0">
          <CandidateSearchBar defaultValue={filters.q} />

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red">
              Failed to load candidates: {error.message}
            </p>
          )}

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Trade</th>
                  <th className="px-4 py-3">Exp.</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Pipeline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">CV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates?.map((c) => {
                  const counts = pipelineCounts.get(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <Link href={`/admin/candidates/${c.id}`} className="hover:underline">
                          {c.full_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.trade ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {c.experience_years != null ? `${c.experience_years} yrs` : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {c.preferred_country ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {c.score != null ? `${c.score}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {counts ? (
                          <span className="text-xs font-semibold">
                            <span className="text-green-600">{counts.active} active</span>
                            {counts.rejected > 0 && (
                              <>
                                {" · "}
                                <span className="text-brand-red">{counts.rejected} rejected</span>
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
                      <td className="px-4 py-3">
                        <a
                          href={`/admin/candidates/${c.id}/download`}
                          className="font-semibold text-brand-blue hover:underline"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {candidates?.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-slate-400">
                No candidates match these filters.
              </p>
            )}
          </div>

          <CandidatePagination
            basePath="/admin/candidates"
            filters={filters}
            totalPages={totalPages}
          />
        </div>
      </form>
    </div>
  );
}
