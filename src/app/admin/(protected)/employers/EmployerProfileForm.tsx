"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateEmployerProfile } from "./actions";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
const labelClass = "mb-1.5 block text-sm font-bold text-slate-700";

export function EmployerProfileForm({
  id,
  companyName,
  contactName,
  contactEmail,
  phone,
}: {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone: string | null;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      await updateEmployerProfile(id, new FormData(event.currentTarget));
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid max-w-lg gap-4 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label className={labelClass}>Company name</label>
        <input
          name="company_name"
          required
          defaultValue={companyName}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Contact name</label>
        <input
          name="contact_name"
          required
          defaultValue={contactName}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Contact email</label>
          <input
            name="contact_email"
            type="email"
            required
            defaultValue={contactEmail}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input name="phone" defaultValue={phone ?? ""} className={inputClass} />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-brand-red">
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="text-sm font-medium text-green-600">Saved.</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-fit rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
