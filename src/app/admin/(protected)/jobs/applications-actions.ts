"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { ApplicationStatus } from "@/lib/applications";

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");
}

function revalidateBoth(jobId: string, candidateId: string) {
  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath(`/admin/candidates/${candidateId}`);
  revalidatePath("/admin/candidates");
}

export async function addApplicant(jobId: string, candidateId: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin.from("job_applications").insert({
    job_id: jobId,
    candidate_id: candidateId,
  });
  if (error) throw new Error(error.message);

  revalidateBoth(jobId, candidateId);
}

export async function updateApplicantStatus(
  applicationId: string,
  jobId: string,
  candidateId: string,
  status: ApplicationStatus,
) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("job_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", applicationId);
  if (error) throw new Error(error.message);

  revalidateBoth(jobId, candidateId);
}

export async function removeApplicant(
  applicationId: string,
  jobId: string,
  candidateId: string,
) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("job_applications")
    .delete()
    .eq("id", applicationId);
  if (error) throw new Error(error.message);

  revalidateBoth(jobId, candidateId);
}
