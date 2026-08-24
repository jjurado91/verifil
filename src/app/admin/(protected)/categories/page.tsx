import { supabaseAdmin } from "@/lib/supabase-admin";
import { CategoryRow } from "./CategoryRow";
import { AddCategoryForm } from "./AddCategoryForm";

export default async function CategoriesPage() {
  const { data: categories, error } = await supabaseAdmin
    .from("job_categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-extrabold text-slate-900">Job Categories</h1>
      <p className="mt-1 text-sm text-slate-500">
        These populate every category dropdown across the site — the
        applicant CV form, admin job/candidate forms, and the employer
        portal. Editing or removing a category doesn&apos;t change the value
        already saved on existing jobs or candidates.
      </p>

      <div className="mt-6">
        <AddCategoryForm />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red">
          Failed to load categories: {error.message}
        </p>
      )}

      <ul className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {categories?.map((category) => (
          <CategoryRow key={category.id} id={category.id} name={category.name} />
        ))}
        {categories?.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-slate-400">
            No categories yet.
          </li>
        )}
      </ul>
    </div>
  );
}
