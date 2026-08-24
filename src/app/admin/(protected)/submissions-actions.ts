"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function deleteSubmission(id: string) {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");

  const { data: row } = await supabaseAdmin
    .from("cv_submissions")
    .select("cv_file_path")
    .eq("id", id)
    .single();

  // A candidate profile created from this submission points at the same
  // storage object (not a copy) — don't delete the file out from under it.
  const { data: sharedCandidate } = row?.cv_file_path
    ? await supabaseAdmin
        .from("candidates")
        .select("id")
        .eq("cv_file_path", row.cv_file_path)
        .maybeSingle()
    : { data: null };

  const { error } = await supabaseAdmin
    .from("cv_submissions")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (row?.cv_file_path && !sharedCandidate) {
    await supabaseAdmin.storage.from("resumes").remove([row.cv_file_path]);
  }

  revalidatePath("/admin");
}
