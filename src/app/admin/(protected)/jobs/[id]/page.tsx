import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { computeFitScore } from "@/lib/matching";
import { JobForm } from "../JobForm";
import { updateJob } from "../actions";
import { getCategories } from "@/lib/categories";
import { getApprovedEmployers } from "@/lib/employers";
import { JobApplicantsBoard, type Applicant } from "../JobApplicantsBoard";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [
    { data: job },
    { data: candidates },
    categories,
    employers,
    { data: applications },
  ] = await Promise.all([
    supabaseAdmin.from("jobs").select("*").eq("id", id).single(),
    supabaseAdmin
      .from("candidates")
      .select("id, full_name, trade, preferred_country, experience_years, status, score"),
    getCategories(),
    getApprovedEmployers(),
    supabaseAdmin
      .from("job_applications")
      .select("id, candidate_id, status, candidates(full_name, score)")
      .eq("job_id", id),
  ]);

  if (!job) notFound();

  const matches = (candidates ?? [])
    .map((candidate) => ({
      candidate,
      ...computeFitScore(candidate, job),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

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

  const applicantIds = new Set(applicants.map((a) => a.candidate_id));
  const availableCandidates = (candidates ?? [])
    .filter((c) => !applicantIds.has(c.id))
    .map((c) => ({ id: c.id, full_name: c.full_name }));

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

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <JobForm
          initial={job}
          action={updateJob.bind(null, id)}
          categories={categories}
          employers={employers}
        />

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Matched Candidates
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {matches.map(({ candidate, score, reasons }) => (
              <Link
                key={candidate.id}
                href={`/admin/candidates/${candidate.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-blue hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    {candidate.full_name}
                  </span>
                  <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-extrabold text-brand-blue">
                    {score}% fit
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {reasons.join(" · ")}
                </p>
              </Link>
            ))}
            {matches.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                No matching candidates yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <JobApplicantsBoard
          jobId={id}
          applicants={applicants}
          availableCandidates={availableCandidates}
        />
      </div>
    </div>
  );
}
