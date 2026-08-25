"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/site-settings-defaults";
import { saveSeoSettings } from "../actions";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
const labelClass = "mb-1.5 block text-sm font-bold text-slate-700";

export function SeoForm({ initial }: { initial: SiteSettings }) {
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
      await saveSeoSettings(new FormData(event.currentTarget));
      setMessage({ type: "success", text: "SEO settings updated." });
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
      className="grid max-w-2xl gap-4 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label className={labelClass}>Site title</label>
        <input
          name="seo_title"
          defaultValue={initial.seoTitle ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Meta description</label>
        <textarea
          name="seo_description"
          rows={3}
          defaultValue={initial.seoDescription ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Social share image URL</label>
        <input
          name="og_image_url"
          defaultValue={initial.ogImageUrl ?? ""}
          placeholder="/images/hero.webp"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-slate-400">
          Shown when the homepage link is shared on Facebook, LinkedIn, etc.
        </p>
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
