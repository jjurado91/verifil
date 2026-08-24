"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSubmission } from "./submissions-actions";

function isImage(fileName: string) {
  return /\.(png|jpe?g|gif|webp|bmp)$/i.test(fileName);
}
function isPdf(fileName: string) {
  return /\.pdf$/i.test(fileName);
}

export function SubmissionRowActions({
  id,
  fileName,
  applicantName,
}: {
  id: string;
  fileName: string;
  applicantName: string;
}) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPreview() {
    setLoadingPreview(true);
    setError(null);
    try {
      const res = await fetch(`/admin/preview/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load preview.");
      setPreviewUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load preview.");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        `Delete ${applicantName}'s CV submission? This can't be undone.`,
      )
    )
      return;
    setDeleting(true);
    try {
      await deleteSubmission(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openPreview}
          disabled={loadingPreview}
          title="Preview"
          className="text-slate-500 hover:text-brand-blue disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
            <path
              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <a
          href={`/admin/download/${id}`}
          title="Download"
          className="text-slate-500 hover:text-brand-blue"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
            <path
              d="M12 15V3m0 12-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
          className="text-slate-500 hover:text-brand-red disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
            <path
              d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="flex h-full max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <p className="text-sm font-bold text-slate-900">
                {applicantName}&apos;s CV — {fileName}
              </p>
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-700"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100">
              {isPdf(fileName) ? (
                <iframe src={previewUrl} className="h-full w-full" title="CV preview" />
              ) : isImage(fileName) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={`${applicantName}'s CV`}
                  className="mx-auto max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    This file type can&apos;t be previewed inline.
                  </p>
                  <a
                    href={`/admin/download/${id}`}
                    className="rounded-full bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:bg-brand-blue-dark"
                  >
                    Download instead
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
