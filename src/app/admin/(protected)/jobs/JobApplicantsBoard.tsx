"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_STYLES,
  type ApplicationStatus,
} from "@/lib/applications";
import { updateApplicantStatus, removeApplicant } from "./applications-actions";

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
}: {
  jobId: string;
  applicants: Applicant[];
}) {
  const router = useRouter();

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
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Pipeline
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Add candidates from the table above — this board tracks where each
        one stands.
      </p>

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
