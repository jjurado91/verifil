import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { CountryOptions } from "@/components/CountryOptions";
import { getCategories } from "@/lib/categories";

const statusStyles: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  filled: "bg-brand-offwhite text-slate-600",
  closed: "bg-slate-200 text-slate-500",
};

const STATUSES = ["open", "filled", "closed"];
const ADDED_BY_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "employer", label: "Employer" },
];

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function agingLabel(createdAt: string) {
  const days = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "Today";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    added_by?: string | string[];
    country?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;
  const statusFilter = toArray(params.status);
  const addedByFilter = toArray(params.added_by);
  const countryFilter = params.country ?? "";
  const categoryFilter = params.category ?? "";

  let query = supabaseAdmin
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter.length > 0) query = query.in("status", statusFilter);
  if (addedByFilter.length > 0)
    query = query.in("added_by_role", addedByFilter);
  if (countryFilter) query = query.eq("country", countryFilter);
  if (categoryFilter) query = query.eq("category", categoryFilter);

  const [{ data: jobs, error }, categories] = await Promise.all([
    query,
    getCategories(),
  ]);

  const hasFilters =
    statusFilter.length > 0 ||
    addedByFilter.length > 0 ||
    Boolean(countryFilter) ||
    Boolean(categoryFilter);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Openings ingested from agencies, hiring principals, and employer
            self-service.
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="rounded-full bg-brand-blue px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
        >
          + Add Job
        </Link>
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

        <div>
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red">
              Failed to load jobs: {error.message}
            </p>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Added By</th>
                  <th className="px-4 py-3">Added Date</th>
                  <th className="px-4 py-3"># Roles</th>
                  <th className="px-4 py-3">Aging</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs?.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="hover:underline"
                      >
                        {job.role_title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{job.country}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {job.category}
                      {job.subcategory && (
                        <span className="text-slate-400">
                          {" "}
                          / {job.subcategory}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{job.added_by_name ?? "—"}</div>
                      {job.added_by_role && (
                        <div className="text-xs capitalize text-slate-400">
                          {job.added_by_role}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{job.openings}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {agingLabel(job.created_at)}
                    </td>
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
                No jobs match these filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
