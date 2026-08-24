import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

const DAY_MS = 24 * 60 * 60 * 1000;

function getDateWindows() {
  const now = Date.now();
  return {
    now,
    sevenDaysAgo: new Date(now - 7 * DAY_MS).toISOString(),
    fourteenDaysAgo: new Date(now - 14 * DAY_MS).toISOString(),
    thirtyDaysAgo: new Date(now - 30 * DAY_MS).toISOString(),
  };
}

function StatCard({
  value,
  label,
  href,
  tone = "default",
}: {
  value: number | string;
  label: string;
  href?: string;
  tone?: "default" | "warning";
}) {
  const content = (
    <div
      className={`rounded-xl border p-5 transition ${
        tone === "warning"
          ? "border-amber-200 bg-amber-50 hover:border-amber-300"
          : "border-slate-200 bg-white hover:border-brand-blue"
      } ${href ? "hover:shadow-sm" : ""}`}
    >
      <p
        className={`text-3xl font-extrabold ${tone === "warning" ? "text-amber-700" : "text-slate-900"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default async function DashboardPage() {
  const { now, sevenDaysAgo, fourteenDaysAgo, thirtyDaysAgo } = getDateWindows();

  const [
    { count: newSubmissions },
    { count: pendingEmployers },
    { data: staleApplications },
    { data: openJobs },
  ] = await Promise.all([
    supabaseAdmin
      .from("cv_submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    supabaseAdmin
      .from("employer_profiles")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabaseAdmin
      .from("job_applications")
      .select("id, status, updated_at, candidates(id, full_name), jobs(id, role_title)")
      .not("status", "in", "(approved,rejected)")
      .lte("updated_at", fourteenDaysAgo),
    supabaseAdmin
      .from("jobs")
      .select("id, role_title, country, created_at")
      .eq("status", "open")
      .lte("created_at", thirtyDaysAgo),
  ]);

  // Jobs open 30+ days with zero active (non-rejected) applicants.
  const openJobIds = (openJobs ?? []).map((j) => j.id);
  let staleJobs: typeof openJobs = [];
  if (openJobIds.length > 0) {
    const { data: activeApps } = await supabaseAdmin
      .from("job_applications")
      .select("job_id")
      .in("job_id", openJobIds)
      .neq("status", "rejected");
    const jobsWithActivity = new Set((activeApps ?? []).map((a) => a.job_id));
    staleJobs = (openJobs ?? []).filter((j) => !jobsWithActivity.has(j.id));
  }

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Dashboard</h1>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          value={newSubmissions ?? 0}
          label="New CVs (last 7 days)"
          href="/admin"
        />
        <StatCard
          value={pendingEmployers ?? 0}
          label="Pending employer approvals"
          href="/admin/employers"
          tone={pendingEmployers ? "warning" : "default"}
        />
        <StatCard
          value={staleApplications?.length ?? 0}
          label="Candidates stalled 14+ days"
          tone={staleApplications?.length ? "warning" : "default"}
        />
        <StatCard
          value={staleJobs?.length ?? 0}
          label="Open jobs, no activity 30+ days"
          tone={staleJobs?.length ? "warning" : "default"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Stalled Candidates
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {(staleApplications ?? []).map((app) => {
              const candidate = app.candidates as unknown as {
                id: string;
                full_name: string;
              } | null;
              const job = app.jobs as unknown as {
                id: string;
                role_title: string;
              } | null;
              if (!candidate || !job) return null;
              const days = Math.floor(
                (now - new Date(app.updated_at).getTime()) / DAY_MS,
              );
              return (
                <Link
                  key={app.id}
                  href={`/admin/candidates/${candidate.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 transition hover:border-brand-blue hover:shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {candidate.full_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {job.role_title} · {app.status}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {days}d
                  </span>
                </Link>
              );
            })}
            {(staleApplications ?? []).length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                Nothing stalled — pipeline is moving.
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Jobs With No Activity
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {(staleJobs ?? []).map((job) => {
              const days = Math.floor(
                (now - new Date(job.created_at).getTime()) / DAY_MS,
              );
              return (
                <Link
                  key={job.id}
                  href={`/admin/jobs/${job.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 transition hover:border-brand-blue hover:shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {job.role_title}
                    </p>
                    <p className="text-xs text-slate-400">{job.country}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {days}d open
                  </span>
                </Link>
              );
            })}
            {(staleJobs ?? []).length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                No stale job postings.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
