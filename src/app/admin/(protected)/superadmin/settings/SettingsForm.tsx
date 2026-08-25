"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/site-settings-defaults";
import { saveSiteSettings } from "../actions";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
const labelClass = "mb-1.5 block text-sm font-bold text-slate-700";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
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
      await saveSiteSettings(new FormData(event.currentTarget));
      setMessage({ type: "success", text: "Settings updated." });
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
      className="grid max-w-2xl gap-6 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Social Links
        </h2>
        <div className="mt-3 grid gap-4">
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input
              name="social_facebook"
              defaultValue={initial.socialFacebook ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input
              name="social_instagram"
              defaultValue={initial.socialInstagram ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              name="social_linkedin"
              defaultValue={initial.socialLinkedin ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Maintenance Mode
        </h2>
        <label className="mt-3 flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            name="maintenance_mode"
            defaultChecked={initial.maintenanceMode}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
          />
          <span>
            Show a &quot;we&apos;ll be right back&quot; page instead of the
            homepage. The admin panel and employer portal stay accessible.
          </span>
        </label>
      </div>

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
