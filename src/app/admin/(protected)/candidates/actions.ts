"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");
}

function strOrNull(value: FormDataEntryValue | null) {
  const s = (value as string | null)?.trim();
  return s ? s : null;
}

function numOrNull(value: FormDataEntryValue | null) {
  if (!value || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function createCandidate(formData: FormData) {
  await requireAdmin();

  const submissionId = strOrNull(formData.get("cv_submission_id"));

  const { data, error } = await supabaseAdmin
    .from("candidates")
    .insert({
      cv_submission_id: submissionId,
      full_name: formData.get("full_name") as string,
      birthday: strOrNull(formData.get("birthday")),
      phone: strOrNull(formData.get("phone")),
      email: strOrNull(formData.get("email")),
      address: strOrNull(formData.get("address")),
      civil_status: strOrNull(formData.get("civil_status")),
      nationality: (formData.get("nationality") as string) || "Filipino",
      trade: strOrNull(formData.get("trade")),
      experience_years: numOrNull(formData.get("experience_years")),
      preferred_country: strOrNull(formData.get("preferred_country")),
      cv_file_path: formData.get("cv_file_path") as string,
      cv_file_name: formData.get("cv_file_name") as string,
      status: (formData.get("status") as string) || "new",
    })
    .select("id")
    .single();

  if (error || !data)
    throw new Error(error?.message ?? "Failed to create candidate");

  // The submission has been turned into a full profile — remove it from
  // the CV Submissions queue. The candidate row already has its own copy
  // of cv_file_path, so the storage object stays untouched.
  if (submissionId) {
    await supabaseAdmin.from("cv_submissions").delete().eq("id", submissionId);
  }

  revalidatePath("/admin/candidates");
  revalidatePath("/admin");
  redirect(`/admin/candidates/${data.id}`);
}

export async function updateCandidate(id: string, formData: FormData) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("candidates")
    .update({
      full_name: formData.get("full_name") as string,
      birthday: strOrNull(formData.get("birthday")),
      phone: strOrNull(formData.get("phone")),
      email: strOrNull(formData.get("email")),
      address: strOrNull(formData.get("address")),
      civil_status: strOrNull(formData.get("civil_status")),
      nationality: (formData.get("nationality") as string) || "Filipino",
      trade: strOrNull(formData.get("trade")),
      experience_years: numOrNull(formData.get("experience_years")),
      preferred_country: strOrNull(formData.get("preferred_country")),
      score: numOrNull(formData.get("score")),
      score_notes: strOrNull(formData.get("score_notes")),
      status: (formData.get("status") as string) || "new",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/candidates");
  revalidatePath(`/admin/candidates/${id}`);
  redirect(`/admin/candidates/${id}`);
}
