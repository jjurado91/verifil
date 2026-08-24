"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, COUNTRIES } from "@/lib/taxonomy";

export type JobFormValues = {
  id?: string;
  agency_name?: string;
  hiring_principal?: string;
  country?: string;
  category?: string;
  subcategory?: string | null;
  role_title?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string;
  contract_length?: string | null;
  openings?: number;
  status?: string;
  notes?: string | null;
};

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
const labelClass = "mb-1.5 block text-sm font-bold text-slate-700";

export function JobForm({
  initial,
  action,
}: {
  initial?: JobFormValues;
  action: (formData: FormData) => Promise<void>;
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Agency name</label>
          <input
            name="agency_name"
            required
            defaultValue={initial?.agency_name}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Hiring principal</label>
          <input
            name="hiring_principal"
            required
            defaultValue={initial?.hiring_principal}
            placeholder="The actual employer abroad"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Role title</label>
        <input
          name="role_title"
          required
          defaultValue={initial?.role_title}
          placeholder="e.g. Construction Worker"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Country</label>
          <select
            name="country"
            required
            defaultValue={initial?.country ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Select country
            </option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            required
            defaultValue={initial?.category ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Subcategory</label>
          <input
            name="subcategory"
            defaultValue={initial?.subcategory ?? ""}
            placeholder="e.g. Rebar Carpenter"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className={labelClass}>Salary min</label>
          <input
            name="salary_min"
            type="number"
            min={0}
            step="0.01"
            defaultValue={initial?.salary_min ?? undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Salary max</label>
          <input
            name="salary_max"
            type="number"
            min={0}
            step="0.01"
            defaultValue={initial?.salary_max ?? undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <input
            name="salary_currency"
            defaultValue={initial?.salary_currency ?? "USD"}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Openings</label>
          <input
            name="openings"
            type="number"
            min={0}
            defaultValue={initial?.openings ?? 1}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Contract length</label>
          <input
            name="contract_length"
            defaultValue={initial?.contract_length ?? ""}
            placeholder="e.g. 2-year contract"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            defaultValue={initial?.status ?? "open"}
            className={inputClass}
          >
            <option value="open">Open</option>
            <option value="filled">Filled</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ""}
          className={inputClass}
        />
      </div>

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
          {submitting ? "Saving…" : initial?.id ? "Save changes" : "Create job"}
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
