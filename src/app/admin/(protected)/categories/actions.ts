"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Category name is required.");

  const { error } = await supabaseAdmin.from("job_categories").insert({ name });
  if (error) {
    throw new Error(
      error.code === "23505"
        ? "That category already exists."
        : error.message,
    );
  }

  revalidatePath("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Category name is required.");

  const { error } = await supabaseAdmin
    .from("job_categories")
    .update({ name })
    .eq("id", id);
  if (error) {
    throw new Error(
      error.code === "23505"
        ? "That category already exists."
        : error.message,
    );
  }

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("job_categories")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
}
