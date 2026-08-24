import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { CountryOptions } from "@/components/CountryOptions";
import { getCategories } from "@/lib/categories";
import { JobsKanban } from "./JobsKanban";
import { JobsTable } from "./JobsTable";
import type { ApplicationStatus } from "@/lib/applications";

const STATUSES = ["open", "filled", "closed"];
const ADDED_BY_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "employer", label: "Employer" },
];

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    added_by?: string | string[];
    country?: string;
    category?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;
  const statusFilter = toArray(params.status);
  const addedByFilter = toArray(params.added_by);
  const countryFilter = params.country ?? "";
  const categoryFilter = params.category ?? "";
  const view = params.view === "kanban" ? "kanban" : "table";

  let query = supabaseAdmin
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter.length > 0) query = query.in("status", statusFilter);
  if (addedByFilter.length > 0)
    query = query.in("added_by_role", addedByFilter);
  if (countryFilter) query = query.eq("country", countryFilter);
  if (categoryFilter) query = query.eq("category", categoryFilter);

  const [{ data: jobs, error }, categories, { data: applicationStatuses }] =
    await Promise.all([
      query,
      getCategories(),
      supabaseAdmin.from("job_applications").select("job_id, status"),
    ]);

  const hasFilters =
    statusFilter.length > 0 ||
    addedByFilter.length > 0 ||
    Boolean(countryFilter) ||
    Boolean(categoryFilter);

  const viewHref = (v: "table" | "kanban") => {
    const qs = new URLSearchParams();
    statusFilter.forEach((s) => qs.append("status", s));
    addedByFilter.forEach((a) => qs.append("added_by", a));
    if (countryFilter) qs.set("country", countryFilter);
    if (categoryFilter) qs.set("category", categoryFilter);
    if (v !== "table") qs.set("view", v);
    const query = qs.toString();
    return `/admin/jobs${query ? `?${query}` : ""}`;
  };

  const exportQs = new URLSearchParams();
  statusFilter.forEach((s) => exportQs.append("status", s));
  addedByFilter.forEach((a) => exportQs.append("added_by", a));
  if (countryFilter) exportQs.set("country", countryFilter);
  if (categoryFilter) exportQs.set("category", categoryFilter);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Jobs</h1>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex rounded-full border border-slate-200 bg-white p-1">
            <Link
              href={viewHref("table")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                view === "table"
                  ? "bg-brand-blue text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Table
            </Link>
            <Link
              href={viewHref("kanban")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                view === "kanban"
                  ? "bg-brand-blue text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Kanban
            </Link>
          </div>
          <a
            href={`/admin/jobs/export?${exportQs.toString()}`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Export CSV
          </a>
          <Link
            href="/admin/jobs/new"
            className="rounded-full bg-brand-blue px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
          >
            + Add Job
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <form method="get" className="h-fit rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Filters</h2>
            {hasFilters && (
              <Link
                href="/admin/jobs"
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                Clear
              </Link>
            )}
          </div>

          <fieldset className="mt-4">
            <legend className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Status
            </legend>
            <div className="mt-2 flex flex-col gap-1.5">
              {STATUSES.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <input
                    type="checkbox"
                    name="status"
                    value={s}
                    defaultChecked={statusFilter.includes(s)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Added By
            </legend>
            <div className="mt-2 flex flex-col gap-1.5">
              {ADDED_BY_ROLES.map((role) => (
                <label
                  key={role.value}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <input
                    type="checkbox"
                    name="added_by"
                    value={role.value}
                    defaultChecked={addedByFilter.includes(role.value)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                  />
                  {role.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Country
            </label>
            <select
              name="country"
              defaultValue={countryFilter}
              className="mt-2 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            >
              <option value="">All countries</option>
              <CountryOptions />
            </select>
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Category
            </label>
            <select
              name="category"
              defaultValue={categoryFilter}
              className="mt-2 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-brand-blue py-2 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
          >
            Apply Filters
          </button>
        </form>

        <div className="min-w-0">
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red">
              Failed to load jobs: {error.message}
            </p>
          )}

          {view === "kanban" ? (
            <JobsKanban
              jobs={jobs ?? []}
              applicationStatuses={
                (applicationStatuses ?? []) as {
                  job_id: string;
                  status: ApplicationStatus;
                }[]
              }
            />
          ) : (
            <JobsTable jobs={jobs ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}
