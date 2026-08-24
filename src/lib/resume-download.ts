import "server-only";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function resumeDownloadResponse(
  table: "cv_submissions" | "candidates",
  id: string,
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: row, error } = await supabaseAdmin
    .from(table)
    .select("cv_file_path, cv_file_name")
    .eq("id", id)
    .single();

  if (error || !row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabaseAdmin.storage
    .from("resumes")
    .createSignedUrl(row.cv_file_path, 60, {
      download: row.cv_file_name,
    });

  if (signError || !signed) {
    return NextResponse.json(
      { error: "Could not generate download link" },
      { status: 500 },
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}

export async function resumePreviewResponse(
  table: "cv_submissions" | "candidates",
  id: string,
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: row, error } = await supabaseAdmin
    .from(table)
    .select("cv_file_path, cv_file_name")
    .eq("id", id)
    .single();

  if (error || !row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // No `download` option — this signed URL renders inline instead of
  // forcing a Content-Disposition: attachment download.
  const { data: signed, error: signError } = await supabaseAdmin.storage
    .from("resumes")
    .createSignedUrl(row.cv_file_path, 60);

  if (signError || !signed) {
    return NextResponse.json(
      { error: "Could not generate preview link" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    url: signed.signedUrl,
    fileName: row.cv_file_name,
  });
}
