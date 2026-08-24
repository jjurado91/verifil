import { JobForm } from "../JobForm";
import { createJob } from "../actions";
import { getCategories } from "@/lib/categories";
import { getApprovedEmployers } from "@/lib/employers";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ employer_id?: string }>;
}) {
  const { employer_id } = await searchParams;
  const [categories, employers] = await Promise.all([
    getCategories(),
    getApprovedEmployers(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Add Job</h1>
      <p className="mt-1 text-sm text-slate-500">
        Enter details for a job opening ingested from an agency or hiring
        principal.
      </p>
      <div className="mt-4">
        <JobForm
          action={createJob}
          categories={categories}
          employers={employers}
          initial={employer_id ? { employer_id } : undefined}
        />
      </div>
    </div>
  );
}
