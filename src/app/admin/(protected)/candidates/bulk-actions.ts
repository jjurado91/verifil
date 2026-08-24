"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");
}

export async function bulkAddToJobPipeline(
  jobId: string,
  candidateIds: string[],
) {
  await requireAdmin();
  if (!jobId || candidateIds.length === 0) return;

  const rows = candidateIds.map((candidate_id) => ({
    job_id: jobId,
    candidate_id,
    status: "screened" as const,
  }));

  const { error } = await supabaseAdmin
    .from("job_applications")
    .upsert(rows, { onConflict: "job_id,candidate_id", ignoreDuplicates: true });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/candidates");
  revalidatePath(`/admin/jobs/${jobId}`);
}

export async function bulkUpdateCandidateStatus(
  candidateIds: string[],
  status: string,
) {
  await requireAdmin();
  if (candidateIds.length === 0) return;

  const { error } = await supabaseAdmin
    .from("candidates")
    .update({ status, updated_at: new Date().toISOString() })
    .in("id", candidateIds);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/candidates");
}
