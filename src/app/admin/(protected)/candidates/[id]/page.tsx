import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { computeFitScore } from "@/lib/matching";
import { CandidateForm } from "../CandidateForm";
import { updateCandidate } from "../actions";
import { getCategories } from "@/lib/categories";
import { getAdminNames } from "@/lib/admins";
import { CandidateTimeline, type TimelineItem } from "../CandidateTimeline";
import { CandidateDocuments } from "../CandidateDocuments";
import type { ApplicationStatus } from "@/lib/applications";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [
    { data: candidate },
    { data: jobs },
    categories,
    admins,
    { data: pipeline },
    { data: notes },
    { data: documents },
  ] = await Promise.all([
    supabaseAdmin.from("candidates").select("*").eq("id", id).single(),
    supabaseAdmin
      .from("jobs")
      .select("id, role_title, agency_name, country, category, subcategory, status"),
    getCategories(),
    getAdminNames(),
    supabaseAdmin
      .from("job_applications")
      .select("id, job_id, status, updated_at, jobs(role_title)")
      .eq("candidate_id", id),
    supabaseAdmin
      .from("candidate_notes")
      .select("id, body, author_name, created_at")
      .eq("candidate_id", id),
    supabaseAdmin
      .from("candidate_documents")
      .select("id, doc_type, file_name, uploaded_at")
      .eq("candidate_id", id)
      .order("uploaded_at", { ascending: false }),
  ]);

  if (!candidate) notFound();

  const matches = (jobs ?? [])
    .map((job) => ({ job, ...computeFitScore(candidate, job) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  const timelineItems: TimelineItem[] = [
    { kind: "created", id: `created-${candidate.id}`, date: candidate.created_at },
    ...(notes ?? []).map((n) => ({
      kind: "note" as const,
      id: n.id,
      date: n.created_at,
      body: n.body,
      author: n.author_name,
    })),
    ...(pipeline ?? []).map((p) => {
      const job = p.jobs as unknown as { role_title: string } | null;
      return {
        kind: "pipeline" as const,
        id: p.id,
        date: p.updated_at,
        jobId: p.job_id,
        roleTitle: job?.role_title ?? "Unknown role",
        status: p.status as ApplicationStatus,
      };
    }),
  ];

  return (
    <div>
      <Link
        href="/admin/candidates"
        className="text-sm font-semibold text-slate-500 hover:text-slate-700"
      >
        ← Back to Candidates
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {candidate.full_name}
          </h1>
          <p className="text-sm text-slate-500">
            {candidate.trade ?? "No trade set"} ·{" "}
            {candidate.experience_years != null
              ? `${candidate.experience_years} yrs experience`
              : "Experience unknown"}
          </p>
        </div>
        <a
          href={`/admin/candidates/${id}/download`}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
        >
          Download CV ({candidate.cv_file_name})
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <CandidateForm
          initial={candidate}
          action={updateCandidate.bind(null, id)}
          showScoring
          categories={categories}
          admins={admins}
        />

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Matched Jobs
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {matches.map(({ job, score, reasons }) => (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-blue hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    {job.role_title}
                  </span>
                  <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-extrabold text-brand-blue">
                    {score}% fit
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {job.agency_name} · {job.country}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {reasons.join(" · ")}
                </p>
              </Link>
            ))}
            {matches.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                No matching jobs yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-2xl">
        <CandidateDocuments candidateId={id} documents={documents ?? []} />
      </div>

      <div className="mt-8 max-w-2xl">
        <CandidateTimeline candidateId={id} items={timelineItems} />
      </div>
    </div>
  );
}
