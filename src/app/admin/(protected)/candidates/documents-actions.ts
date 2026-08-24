"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sanitizeFileName } from "@/lib/sanitize-filename";
import { DOCUMENT_TYPES, type DocumentType } from "@/lib/documents";

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function uploadCandidateDocument(
  candidateId: string,
  formData: FormData,
) {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  const docType = formData.get("doc_type") as DocumentType;

  if (!file || file.size === 0) throw new Error("Please choose a file.");
  if (file.size > MAX_FILE_BYTES) throw new Error("File is over 10MB.");
  if (!DOCUMENT_TYPES.includes(docType)) throw new Error("Invalid document type.");

  const filePath = `${candidateId}/${crypto.randomUUID()}-${sanitizeFileName(file.name, "document")}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("candidate-documents")
    .upload(filePath, file);
  if (uploadError) throw new Error(uploadError.message);

  const { error: insertError } = await supabaseAdmin
    .from("candidate_documents")
    .insert({
      candidate_id: candidateId,
      doc_type: docType,
      file_path: filePath,
      file_name: file.name,
    });
  if (insertError) throw new Error(insertError.message);

  revalidatePath(`/admin/candidates/${candidateId}`);
}

export async function deleteCandidateDocument(
  documentId: string,
  candidateId: string,
) {
  await requireAdmin();

  const { data: doc } = await supabaseAdmin
    .from("candidate_documents")
    .select("file_path")
    .eq("id", documentId)
    .single();

  const { error } = await supabaseAdmin
    .from("candidate_documents")
    .delete()
    .eq("id", documentId);
  if (error) throw new Error(error.message);

  if (doc?.file_path) {
    await supabaseAdmin.storage.from("candidate-documents").remove([doc.file_path]);
  }

  revalidatePath(`/admin/candidates/${candidateId}`);
}
