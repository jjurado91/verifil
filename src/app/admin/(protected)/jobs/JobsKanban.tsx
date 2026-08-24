import Link from "next/link";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/applications";

type Job = {
  id: string;
  role_title: string;
  country: string;
  category: string;
  openings: number;
  status: string;
};

const STAGE_RANK: Record<ApplicationStatus, number> = {
  screened: 1,
  for_interview: 2,
  for_endorsement: 3,
  approved: 4,
  rejected: 0,
};

const NO_MATCHES = "no_matches" as const;
const KANBAN_COLUMNS = [NO_MATCHES, ...APPLICATION_STATUSES.filter((s) => s !== "rejected")];

const statusStyles: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  filled: "bg-brand-offwhite text-slate-600",
  closed: "bg-slate-200 text-slate-500",
};

function columnLabel(column: string) {
  return column === NO_MATCHES
    ? "No Matches"
    : APPLICATION_STATUS_LABELS[column as ApplicationStatus];
}

/** Bucket a job by the furthest-along non-rejected candidate's status. */
function bucketJob(jobId: string, statusesByJob: Map<string, ApplicationStatus[]>): string {
  const statuses = statusesByJob.get(jobId) ?? [];
  const active = statuses.filter((s) => s !== "rejected");
  if (active.length === 0) return NO_MATCHES;

  let best: ApplicationStatus = active[0];
  for (const s of active) {
    if (STAGE_RANK[s] > STAGE_RANK[best]) best = s;
  }
  return best;
}

export function JobsKanban({
  jobs,
  applicationStatuses,
}: {
  jobs: Job[];
  applicationStatuses: { job_id: string; status: ApplicationStatus }[];
}) {
  const statusesByJob = new Map<string, ApplicationStatus[]>();
  for (const row of applicationStatuses) {
    const list = statusesByJob.get(row.job_id) ?? [];
    list.push(row.status);
    statusesByJob.set(row.job_id, list);
  }

  const columns = new Map<string, Job[]>(KANBAN_COLUMNS.map((c) => [c, []]));
  for (const job of jobs) {
    const bucket = bucketJob(job.id, statusesByJob);
    columns.get(bucket)!.push(job);
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {KANBAN_COLUMNS.map((column) => (
        <div key={column} className="rounded-xl bg-slate-50 p-2">
          <p className="flex items-center justify-between px-1.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            {columnLabel(column)}
            <span className="text-slate-400">{columns.get(column)!.length}</span>
          </p>
          <div className="mt-1 flex flex-col gap-2">
            {columns.get(column)!.map((job) => (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-2.5 transition hover:border-brand-blue hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {job.role_title}
                </p>
                <p className="text-xs text-slate-400">
                  {job.country} · {job.category}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {job.openings} opening{job.openings === 1 ? "" : "s"}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[job.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {job.status}
                  </span>
                </div>
              </Link>
            ))}
            {columns.get(column)!.length === 0 && (
              <p className="px-1.5 py-2 text-xs text-slate-300">—</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
