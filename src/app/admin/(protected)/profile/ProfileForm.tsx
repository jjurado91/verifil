"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateOwnName } from "./actions";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
const labelClass = "mb-1.5 block text-sm font-bold text-slate-700";

export function ProfileForm({
  name,
  email,
  isSuperAdmin,
}: {
  name: string;
  email: string;
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await updateOwnName(new FormData(event.currentTarget));
      setMessage({ type: "success", text: "Profile updated." });
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label className={labelClass}>Name</label>
        <input name="name" required defaultValue={name} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input
          value={email}
          disabled
          className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-400`}
        />
        <p className="mt-1 text-xs text-slate-400">
          Email is tied to your login and can&apos;t be changed here.
        </p>
      </div>

      {isSuperAdmin && (
        <span className="w-fit rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-blue">
          Superadmin
        </span>
      )}

      {message && (
        <p
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-brand-red"
          }`}
        >
          {message.text}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
