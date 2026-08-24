"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  type DocumentType,
} from "@/lib/documents";
import { uploadCandidateDocument, deleteCandidateDocument } from "./documents-actions";

export type CandidateDocument = {
  id: string;
  doc_type: DocumentType;
  file_name: string;
  uploaded_at: string;
};

export function CandidateDocuments({
  candidateId,
  documents,
}: {
  candidateId: string;
  documents: CandidateDocument[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setError(null);
    try {
      await uploadCandidateDocument(candidateId, new FormData(event.currentTarget));
      formRef.current?.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: CandidateDocument) {
    if (!confirm(`Delete ${doc.file_name}?`)) return;
    setDeletingId(doc.id);
    try {
      await deleteCandidateDocument(doc.id, candidateId);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Documents
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Passport, NBI clearance, medical exam, trade certs, visa — anything
        beyond the CV.
      </p>

      <form
        ref={formRef}
        onSubmit={handleUpload}
        className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold text-slate-600">
            Type
          </label>
          <select
            name="doc_type"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          >
            <option value="" disabled>
              Select type
            </option>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {DOCUMENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold text-slate-600">
            File
          </label>
          <input
            name="file"
            type="file"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none file:mr-2 file:rounded-full file:border-0 file:bg-brand-offwhite file:px-2.5 file:py-1 file:text-xs file:font-semibold"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="shrink-0 rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>
      {error && <p className="mt-1.5 text-sm text-brand-red">{error}</p>}

      <div className="mt-4 flex flex-col gap-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5"
          >
            <div>
              <span className="rounded-full bg-brand-offwhite px-2 py-0.5 text-xs font-semibold text-slate-600">
                {DOCUMENT_TYPE_LABELS[doc.doc_type]}
              </span>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {doc.file_name}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(doc.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold">
              <a
                href={`/admin/candidates/documents/${doc.id}/download`}
                className="text-brand-blue hover:underline"
              >
                Download
              </a>
              <button
                type="button"
                disabled={deletingId === doc.id}
                onClick={() => handleDelete(doc)}
                className="text-brand-red hover:underline disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
            No documents uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}
