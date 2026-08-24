"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated, getAdminName } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");
  return getAdminName();
}

function numOrNull(value: FormDataEntryValue | null) {
  if (!value || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function resolveEmployer(formData: FormData) {
  const employerId = formData.get("employer_id") as string;
  const { data: employer, error } = await supabaseAdmin
    .from("employer_profiles")
    .select("id, company_name")
    .eq("id", employerId)
    .single();

  if (error || !employer) throw new Error("Please select a valid hiring principal.");
  return employer;
}

export async function createJob(formData: FormData) {
  const adminName = await requireAdmin();
  const employer = await resolveEmployer(formData);

  const { data, error } = await supabaseAdmin
    .from("jobs")
    .insert({
      agency_name: formData.get("agency_name") as string,
      hiring_principal: employer.company_name,
      employer_id: employer.id,
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
      added_by_name: adminName,
      added_by_role: "admin",
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create job");

  revalidatePath("/admin/jobs");
  redirect(`/admin/jobs/${data.id}`);
}

export async function updateJobStatus(id: string, status: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("jobs")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${id}`);
}

export async function updateJob(id: string, formData: FormData) {
  await requireAdmin();
  const employer = await resolveEmployer(formData);

  const { error } = await supabaseAdmin
    .from("jobs")
    .update({
      agency_name: formData.get("agency_name") as string,
      hiring_principal: employer.company_name,
      employer_id: employer.id,
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
