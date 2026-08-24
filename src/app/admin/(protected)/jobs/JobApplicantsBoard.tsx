"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_STYLES,
  type ApplicationStatus,
} from "@/lib/applications";
import { addApplicant, updateApplicantStatus, removeApplicant } from "./applications-actions";

export type Applicant = {
  id: string;
  candidate_id: string;
  status: ApplicationStatus;
  full_name: string;
  score: number | null;
};

export function JobApplicantsBoard({
  jobId,
  applicants,
  availableCandidates,
}: {
  jobId: string;
  applicants: Applicant[];
  availableCandidates: { id: string; full_name: string }[];
}) {
  const router = useRouter();
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCandidate) return;
    setAdding(true);
    setError(null);
    try {
      await addApplicant(jobId, selectedCandidate);
      setSelectedCandidate("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add.");
    } finally {
      setAdding(false);
    }
  }

  async function handleStatusChange(applicant: Applicant, status: ApplicationStatus) {
    await updateApplicantStatus(applicant.id, jobId, applicant.candidate_id, status);
    router.refresh();
  }

  async function handleRemove(applicant: Applicant) {
    if (!confirm(`Remove ${applicant.full_name} from this job's pipeline?`)) return;
    await removeApplicant(applicant.id, jobId, applicant.candidate_id);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Candidates
        </h2>
      </div>

      <form onSubmit={handleAdd} className="mt-3 flex items-center gap-2">
        <select
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        >
          <option value="">Add a candidate…</option>
          {availableCandidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!selectedCandidate || adding}
          className="shrink-0 rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {adding ? "Adding…" : "+ Add"}
        </button>
      </form>
      {error && <p className="mt-1.5 text-sm text-brand-red">{error}</p>}
      {availableCandidates.length === 0 && (
        <p className="mt-1.5 text-xs text-slate-400">
          All existing candidates are already in this job&apos;s pipeline.
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {APPLICATION_STATUSES.map((status) => (
          <div key={status} className="rounded-xl bg-slate-50 p-2">
            <p className="px-1.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              {APPLICATION_STATUS_LABELS[status]}
            </p>
            <div className="mt-1 flex flex-col gap-2">
              {applicants
                .filter((a) => a.status === status)
                .map((applicant) => (
                  <div
                    key={applicant.id}
                    className="rounded-lg border border-slate-200 bg-white p-2.5"
                  >
                    <Link
                      href={`/admin/candidates/${applicant.candidate_id}`}
                      className="text-sm font-semibold text-slate-900 hover:underline"
                    >
                      {applicant.full_name}
                    </Link>
                    {applicant.score != null && (
                      <p className="text-xs text-slate-400">
                        Score: {applicant.score}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        value={applicant.status}
                        onChange={(e) =>
                          handleStatusChange(
                            applicant,
                            e.target.value as ApplicationStatus,
                          )
                        }
                        className={`flex-1 rounded-md border-0 px-1.5 py-1 text-xs font-semibold outline-none ${APPLICATION_STATUS_STYLES[applicant.status]}`}
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {APPLICATION_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemove(applicant)}
                        className="text-xs font-semibold text-slate-400 hover:text-brand-red"
                        title="Remove from pipeline"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              {applicants.filter((a) => a.status === status).length === 0 && (
                <p className="px-1.5 py-2 text-xs text-slate-300">—</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
