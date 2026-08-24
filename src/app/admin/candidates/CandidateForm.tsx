"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, COUNTRIES } from "@/lib/taxonomy";

export type CandidateFormValues = {
  id?: string;
  cv_submission_id?: string | null;
  full_name?: string;
  birthday?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  civil_status?: string | null;
  nationality?: string;
  trade?: string | null;
  experience_years?: number | null;
  preferred_country?: string | null;
  cv_file_path?: string;
  cv_file_name?: string;
  score?: number | null;
  score_notes?: string | null;
  status?: string;
};

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
const labelClass = "mb-1.5 block text-sm font-bold text-slate-700";

export function CandidateForm({
  initial,
  action,
  showScoring = false,
}: {
  initial?: CandidateFormValues;
  action: (formData: FormData) => Promise<void>;
  showScoring?: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await action(new FormData(event.currentTarget));
    } catch (err) {
      const digest = (err as { digest?: string })?.digest;
      if (digest?.startsWith("NEXT_REDIRECT")) throw err;
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid max-w-2xl gap-4 rounded-xl border border-slate-200 bg-white p-6"
    >
      {initial?.cv_submission_id && (
        <input
          type="hidden"
          name="cv_submission_id"
          value={initial.cv_submission_id}
        />
      )}
      {initial?.cv_file_path && (
        <input type="hidden" name="cv_file_path" value={initial.cv_file_path} />
      )}
      {initial?.cv_file_name && (
        <input type="hidden" name="cv_file_name" value={initial.cv_file_name} />
      )}

      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        Biodata
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full name</label>
          <input
            name="full_name"
            required
            defaultValue={initial?.full_name}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Birthday</label>
          <input
            name="birthday"
            type="date"
            defaultValue={initial?.birthday ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Phone</label>
          <input
            name="phone"
            defaultValue={initial?.phone ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            name="email"
            type="email"
            defaultValue={initial?.email ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <input
          name="address"
          defaultValue={initial?.address ?? ""}
          placeholder="Leave blank if not yet known — fill in from a call"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Civil status</label>
          <select
            name="civil_status"
            defaultValue={initial?.civil_status ?? ""}
            className={inputClass}
          >
            <option value="">Unknown</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Nationality</label>
          <input
            name="nationality"
            defaultValue={initial?.nationality ?? "Filipino"}
            className={inputClass}
          />
        </div>
      </div>

      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
        Work Profile
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Trade / Occupation</label>
          <select
            name="trade"
            defaultValue={initial?.trade ?? ""}
            className={inputClass}
          >
            <option value="">Select trade</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Years of experience</label>
          <input
            name="experience_years"
            type="number"
            min={0}
            max={60}
            defaultValue={initial?.experience_years ?? undefined}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Preferred country</label>
        <select
          name="preferred_country"
          defaultValue={initial?.preferred_country ?? ""}
          className={inputClass}
        >
          <option value="">No preference</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Status</label>
        <select
          name="status"
          defaultValue={initial?.status ?? "new"}
          className={inputClass}
        >
          <option value="new">New</option>
          <option value="screening">Screening</option>
          <option value="verified">Verified</option>
          <option value="matched">Matched</option>
          <option value="deployed">Deployed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {showScoring && (
        <>
          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Scoring
          </p>
          <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
            <div>
              <label className={labelClass}>Score (0–100)</label>
              <input
                name="score"
                type="number"
                min={0}
                max={100}
                defaultValue={initial?.score ?? undefined}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Notes</label>
              <input
                name="score_notes"
                defaultValue={initial?.score_notes ?? ""}
                placeholder="Criteria TBD — manual notes for now"
                className={inputClass}
              />
            </div>
          </div>
        </>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-brand-red">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {submitting
            ? "Saving…"
            : initial?.id
              ? "Save changes"
              : "Create profile"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
