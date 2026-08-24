import { resumeDownloadResponse } from "@/lib/resume-download";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return resumeDownloadResponse("cv_submissions", id);
}
