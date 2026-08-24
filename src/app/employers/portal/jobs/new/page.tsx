import { EmployerJobForm } from "../../EmployerJobForm";
import { createEmployerJob } from "../../actions";
import { getCategories } from "@/lib/categories";

export default async function NewEmployerJobPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Post a Job</h1>
      <p className="mt-1 text-sm text-slate-500">
        This listing will appear under your company on Verifil.
      </p>
      <div className="mt-4">
        <EmployerJobForm action={createEmployerJob} categories={categories} />
      </div>
    </div>
  );
}
