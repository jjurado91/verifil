import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EmployerJobForm } from "../../EmployerJobForm";
import { updateEmployerJob, deleteEmployerJob } from "../../actions";
import { DeleteJobButton } from "./DeleteJobButton";
import { getCategories } from "@/lib/categories";

export default async function EmployerJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: job }, categories] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", id).single(),
    getCategories(),
  ]);

  if (!job) notFound();

  return (
    <div>
      <Link
        href="/employers/portal"
        className="text-sm font-semibold text-slate-500 hover:text-slate-700"
      >
        ← Back to Your Job Listings
      </Link>

      <h1 className="mt-2 text-xl font-extrabold text-slate-900">
        {job.role_title}
      </h1>

      <div className="mt-6">
        <EmployerJobForm
          initial={job}
          action={updateEmployerJob.bind(null, id)}
          categories={categories}
        />
      </div>

      <DeleteJobButton action={deleteEmployerJob.bind(null, id)} />
    </div>
  );
}
