import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { computeFitScore } from "@/lib/matching";
import { JobForm } from "../JobForm";
import { updateJob } from "../actions";
import { getCategories } from "@/lib/categories";
import { getApprovedEmployers } from "@/lib/employers";
import { JobApplicantsBoard, type Applicant } from "../JobApplicantsBoard";
import { AddCandidateButton } from "../AddCandidateButton";
import { CandidateFilterSidebar } from "../../_shared/CandidateFilterSidebar";
import { CandidateSearchBar } from "../../_shared/CandidateSearchBar";
import { CandidatePagination } from "../../_shared/CandidatePagination";
import {
  parseCandidateFilters,
  PAGE_SIZE,
  type CandidateFilterParams,
} from "../../_shared/candidate-filters";

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<CandidateFilterParams>;
}) {
  const { id } = await params;
  const filters = parseCandidateFilters(await searchParams);

  const [
    { data: job },
    categories,
    employers,
    { data: applications },
    { data: allApplications },
  ] = await Promise.all([
    supabaseAdmin.from("jobs").select("*").eq("id", id).single(),
    getCategories(),
    getApprovedEmployers(),
    supabaseAdmin
      .from("job_applications")
      .select("id, candidate_id, status, candidates(full_name, score)")
      .eq("job_id", id),
    supabaseAdmin.from("job_applications").select("job_id, candidate_id, status"),
  ]);

  if (!job) notFound();

  // Candidate search/filter query for the "find & add" table.
  let candidateQuery = supabaseAdmin
    .from("candidates")
    .select(
      "id, full_name, trade, preferred_country, experience_years, status, score, phone, email",
    );

  if (filters.q) {
    candidateQuery = candidateQuery.or(
      `full_name.ilike.%${filters.q}%,phone.ilike.%${filters.q}%,email.ilike.%${filters.q}%`,
    );
  }
  if (filters.trade) candidateQuery = candidateQuery.eq("trade", filters.trade);
  if (filters.country)
    candidateQuery = candidateQuery.eq("preferred_country", filters.country);
  if (filters.minExp)
    candidateQuery = candidateQuery.gte("experience_years", Number(filters.minExp));
  if (filters.maxExp)
    candidateQuery = candidateQuery.lte("experience_years", Number(filters.maxExp));
  if (filters.status.length > 0)
    candidateQuery = candidateQuery.in("status", filters.status);

  const { data: candidatePool } = await candidateQuery;

  const applicants: Applicant[] = (applications ?? []).map((a) => {
    const candidate = a.candidates as unknown as {
      full_name: string;
      score: number | null;
    } | null;
    return {
      id: a.id,
      candidate_id: a.candidate_id,
      status: a.status,
      full_name: candidate?.full_name ?? "Unknown",
      score: candidate?.score ?? null,
    };
  });

  const appliedToThisJob = new Set(applicants.map((a) => a.candidate_id));

  const elsewhereActive = new Map<string, number>();
  for (const app of allApplications ?? []) {
    if (app.job_id === id || app.status === "rejected") continue;
    elsewhereActive.set(
      app.candidate_id,
      (elsewhereActive.get(app.candidate_id) ?? 0) + 1,
    );
  }

  // Score every candidate against this job and sort best-first — this
  // replaces the old separate "Matched Candidates" list.
  const scored = (candidatePool ?? [])
    .map((candidate) => ({
      candidate,
      ...computeFitScore(candidate, job),
    }))
    .sort((a, b) => b.score - a.score);

  const totalPages = Math.max(1, Math.ceil(scored.length / PAGE_SIZE));
  const pageItems = scored.slice(
    (filters.page - 1) * PAGE_SIZE,
    filters.page * PAGE_SIZE,
  );

  return (
    <div>
      <Link
        href="/admin/jobs"
        className="text-sm font-semibold text-slate-500 hover:text-slate-700"
      >
        ← Back to Jobs
      </Link>

      <h1 className="mt-2 text-xl font-extrabold text-slate-900">
        {job.role_title}
      </h1>
      <p className="text-sm text-slate-500">
        {job.agency_name} → {job.hiring_principal} · {job.country}
      </p>

      <div className="mt-6 max-w-2xl">
        <JobForm
          initial={job}
          action={updateJob.bind(null, id)}
          categories={categories}
          employers={employers}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Find &amp; Add Candidates
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Sorted by fit for this role — best matches first.
        </p>

        <form
          method="get"
          className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]"
        >
          <CandidateFilterSidebar
            basePath={`/admin/jobs/${id}`}
            filters={filters}
            categories={categories}
          />

          <div className="min-w-0">
            <CandidateSearchBar defaultValue={filters.q} />

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Trade</th>
                    <th className="px-4 py-3">Exp.</th>
                    <th className="px-4 py-3">Country</th>
                    <th className="px-4 py-3">Fit</th>
                    <th className="px-4 py-3">Placement</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageItems.map(({ candidate, score }) => {
                    const alreadyHere = appliedToThisJob.has(candidate.id);
                    const activeElsewhere = elsewhereActive.get(candidate.id) ?? 0;
                    return (
                      <tr
                        key={candidate.id}
                        className={score >= 70 ? "bg-brand-gold/10" : undefined}
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <Link
                            href={`/admin/candidates/${candidate.id}`}
                            className="hover:underline"
                          >
                            {candidate.full_name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {candidate.trade ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {candidate.experience_years != null
                            ? `${candidate.experience_years} yrs`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {candidate.preferred_country ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                              score >= 70
                                ? "bg-brand-gold/30 text-amber-800"
                                : "bg-brand-blue/10 text-brand-blue"
                            }`}
                          >
                            {score}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {activeElsewhere > 0 ? (
                            <span
                              className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700"
                              title="Already active in another job's pipeline"
                            >
                              In {activeElsewhere} other pipeline
                              {activeElsewhere === 1 ? "" : "s"}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {alreadyHere ? (
                            <span className="text-xs font-semibold text-slate-400">
                              Added
                            </span>
                          ) : (
                            <AddCandidateButton jobId={id} candidateId={candidate.id} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {pageItems.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-400">
                  No candidates match these filters.
                </p>
              )}
            </div>

            <CandidatePagination
              basePath={`/admin/jobs/${id}`}
              filters={filters}
              totalPages={totalPages}
            />
          </div>
        </form>
      </div>

      <div className="mt-10">
        <JobApplicantsBoard jobId={id} applicants={applicants} />
      </div>
    </div>
  );
}
