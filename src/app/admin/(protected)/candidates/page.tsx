import { supabaseAdmin } from "@/lib/supabase-admin";
import { getCategories } from "@/lib/categories";
import { CandidateFilterSidebar } from "../_shared/CandidateFilterSidebar";
import { CandidateSearchBar } from "../_shared/CandidateSearchBar";
import { CandidatePagination } from "../_shared/CandidatePagination";
import { CandidatesTable, type CandidateRow } from "./CandidatesTable";
import {
  parseCandidateFilters,
  PAGE_SIZE,
  type CandidateFilterParams,
} from "../_shared/candidate-filters";

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

  const [
    { data: candidates, error, count },
    { data: applications },
    categories,
    { data: openJobs },
  ] = await Promise.all([
    query.range(from, to),
    supabaseAdmin.from("job_applications").select("candidate_id, status"),
    getCategories(),
    supabaseAdmin
      .from("jobs")
      .select("id, role_title")
      .eq("status", "open")
      .order("role_title", { ascending: true }),
  ]);

  const pipelineCounts = new Map<string, { active: number; rejected: number }>();
  for (const app of applications ?? []) {
    const counts = pipelineCounts.get(app.candidate_id) ?? { active: 0, rejected: 0 };
    if (app.status === "rejected") counts.rejected += 1;
    else counts.active += 1;
    pipelineCounts.set(app.candidate_id, counts);
  }

  const rows: CandidateRow[] = (candidates ?? []).map((c) => ({
    id: c.id,
    full_name: c.full_name,
    trade: c.trade,
    experience_years: c.experience_years,
    preferred_country: c.preferred_country,
    score: c.score,
    status: c.status,
    assigned_admin_name: c.assigned_admin_name,
    pipeline: pipelineCounts.get(c.id) ?? null,
  }));

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

          <div className="mt-4">
            <CandidatesTable rows={rows} jobs={openJobs ?? []} />
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
