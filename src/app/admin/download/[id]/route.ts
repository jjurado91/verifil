import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { data: submission, error } = await supabaseAdmin
    .from("cv_submissions")
    .select("cv_file_path, cv_file_name")
    .eq("id", id)
    .single();

  if (error || !submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabaseAdmin.storage
    .from("resumes")
    .createSignedUrl(submission.cv_file_path, 60, {
      download: submission.cv_file_name,
    });

  if (signError || !signed) {
    return NextResponse.json(
      { error: "Could not generate download link" },
      { status: 500 },
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}
