"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function strOrNull(value: FormDataEntryValue | null) {
  const s = (value as string | null)?.trim();
  return s ? s : null;
}

function numOrNull(value: FormDataEntryValue | null) {
  if (!value || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function requireEmployer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/employers/login");

  const { data: profile } = await supabase
    .from("employer_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/employers/login");
}

export async function createEmployerJob(formData: FormData) {
  const { supabase, user, profile } = await requireEmployer();

  const companyName = profile?.company_name ?? "Employer";

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      employer_id: user.id,
      agency_name: companyName,
      hiring_principal: companyName,
      added_by_name: companyName,
      added_by_role: "employer",
      country: formData.get("country") as string,
      category: formData.get("category") as string,
      subcategory: strOrNull(formData.get("subcategory")),
      role_title: formData.get("role_title") as string,
      salary_min: numOrNull(formData.get("salary_min")),
      salary_max: numOrNull(formData.get("salary_max")),
      salary_currency: (formData.get("salary_currency") as string) || "USD",
      contract_length: strOrNull(formData.get("contract_length")),
      openings: numOrNull(formData.get("openings")) ?? 1,
      status: (formData.get("status") as string) || "open",
      notes: strOrNull(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create job");

  revalidatePath("/employers/portal");
  redirect(`/employers/portal/jobs/${data.id}`);
}

export async function updateEmployerJob(id: string, formData: FormData) {
  const { supabase } = await requireEmployer();

  const { error } = await supabase
    .from("jobs")
    .update({
      country: formData.get("country") as string,
      category: formData.get("category") as string,
      subcategory: strOrNull(formData.get("subcategory")),
      role_title: formData.get("role_title") as string,
      salary_min: numOrNull(formData.get("salary_min")),
      salary_max: numOrNull(formData.get("salary_max")),
      salary_currency: (formData.get("salary_currency") as string) || "USD",
      contract_length: strOrNull(formData.get("contract_length")),
      openings: numOrNull(formData.get("openings")) ?? 1,
      status: (formData.get("status") as string) || "open",
      notes: strOrNull(formData.get("notes")),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/employers/portal");
  revalidatePath(`/employers/portal/jobs/${id}`);
  redirect(`/employers/portal/jobs/${id}`);
}

export async function deleteEmployerJob(id: string) {
  const { supabase } = await requireEmployer();

  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/employers/portal");
  redirect("/employers/portal");
}
