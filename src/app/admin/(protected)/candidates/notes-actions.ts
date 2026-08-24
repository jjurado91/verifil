"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated, getAdminName } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function addCandidateNote(candidateId: string, body: string) {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");

  const trimmed = body.trim();
  if (!trimmed) throw new Error("Note can't be empty.");

  const authorName = await getAdminName();

  const { error } = await supabaseAdmin.from("candidate_notes").insert({
    candidate_id: candidateId,
    body: trimmed,
    author_name: authorName,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/candidates/${candidateId}`);
}
