import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmployerProfileForm } from "../EmployerProfileForm";
import { EmployerStatusActions } from "../EmployerStatusActions";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const jobStatusStyles: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  filled: "bg-brand-offwhite text-slate-600",
  closed: "bg-slate-200 text-slate-500",
};

export default async function EmployerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: employer }, { data: jobs }] = await Promise.all([
    supabaseAdmin.from("employer_profiles").select("*").eq("id", id).single(),
    supabaseAdmin
      .from("jobs")
      .select("id, role_title, country, category, openings, status, created_at")
      .eq("employer_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!employer) notFound();

  return (
    <div>
      <Link
        href="/admin/employers"
        className="text-sm font-semibold text-slate-500 hover:text-slate-700"
      >
        ← Back to Employers
      </Link>

      <div className="mt-2 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {employer.company_name}
          </h1>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[employer.status] ?? "bg-slate-100 text-slate-600"}`}
          >
            {employer.status}
          </span>
        </div>
        <EmployerStatusActions id={id} status={employer.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <EmployerProfileForm
          id={id}
          companyName={employer.company_name}
          contactName={employer.contact_name}
          contactEmail={employer.contact_email}
          phone={employer.phone}
        />

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Jobs Posted
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {jobs?.map((job) => (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-blue hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    {job.role_title}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${jobStatusStyles[job.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {job.country} · {job.category} · {job.openings} opening
                  {job.openings === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
            {jobs?.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                No jobs posted yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
