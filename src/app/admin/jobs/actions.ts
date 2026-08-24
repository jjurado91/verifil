"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

function requireAdmin() {
  return isAdminAuthenticated().then((authed) => {
    if (!authed) throw new Error("Unauthorized");
  });
}

function numOrNull(value: FormDataEntryValue | null) {
  if (!value || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function createJob(formData: FormData) {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("jobs")
    .insert({
      agency_name: formData.get("agency_name") as string,
      hiring_principal: formData.get("hiring_principal") as string,
      country: formData.get("country") as string,
      category: formData.get("category") as string,
      subcategory: (formData.get("subcategory") as string) || null,
      role_title: formData.get("role_title") as string,
      salary_min: numOrNull(formData.get("salary_min")),
      salary_max: numOrNull(formData.get("salary_max")),
      salary_currency: (formData.get("salary_currency") as string) || "USD",
      contract_length: (formData.get("contract_length") as string) || null,
      openings: numOrNull(formData.get("openings")) ?? 1,
      status: (formData.get("status") as string) || "open",
      notes: (formData.get("notes") as string) || null,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create job");

  revalidatePath("/admin/jobs");
  redirect(`/admin/jobs/${data.id}`);
}

export async function updateJob(id: string, formData: FormData) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("jobs")
    .update({
      agency_name: formData.get("agency_name") as string,
      hiring_principal: formData.get("hiring_principal") as string,
      country: formData.get("country") as string,
      category: formData.get("category") as string,
      subcategory: (formData.get("subcategory") as string) || null,
      role_title: formData.get("role_title") as string,
      salary_min: numOrNull(formData.get("salary_min")),
      salary_max: numOrNull(formData.get("salary_max")),
      salary_currency: (formData.get("salary_currency") as string) || "USD",
      contract_length: (formData.get("contract_length") as string) || null,
      openings: numOrNull(formData.get("openings")) ?? 1,
      status: (formData.get("status") as string) || "open",
      notes: (formData.get("notes") as string) || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${id}`);
  redirect(`/admin/jobs/${id}`);
}
