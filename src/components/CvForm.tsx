"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, COUNTRIES as COUNTRY_LIST } from "@/lib/taxonomy";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

const TRADES = CATEGORIES;
const COUNTRIES = ["No preference", ...COUNTRY_LIST];

// Real resume filenames are messy — slashes, unicode, excessive length —
// and this name becomes part of the storage object key, so sanitize it.
function sanitizeFileName(name: string) {
  const lastDot = name.lastIndexOf(".");
  const ext = lastDot > -1 ? name.slice(lastDot + 1).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) : "";
  const base = (lastDot > -1 ? name.slice(0, lastDot) : name)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return ext ? `${base || "resume"}.${ext}` : base || "resume";
}

export function CvForm() {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const cvFile = data.get("cv") as File | null;

    if (!cvFile || cvFile.size === 0) {
      setError("Please choose a file to upload.");
      return;
    }

    if (cvFile.size > MAX_FILE_BYTES) {
      setError("That file is over 10MB. Please upload a smaller file.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const filePath = `${crypto.randomUUID()}-${sanitizeFileName(cvFile.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, cvFile);
      if (uploadError) {
        console.error("Verifil CV upload failed:", uploadError);
        throw uploadError;
      }

      const { error: insertError } = await supabase
        .from("cv_submissions")
        .insert({
          full_name: data.get("fullName") as string,
          mobile: data.get("mobile") as string,
          email: (data.get("email") as string) || null,
          trade: data.get("trade") as string,
          experience_years: Number(data.get("experience")),
          preferred_country: data.get("country") as string,
          cv_file_path: filePath,
          cv_file_name: cvFile.name,
        });
      if (insertError) {
        console.error("Verifil CV submission insert failed:", insertError);
        throw insertError;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Verifil CV submission failed:", err);
      const detail =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : null;
      setError(
        `Something went wrong submitting your CV. Please try again in a moment.${
          detail ? ` (${detail})` : ""
        }`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7 text-green-600"
          >
            <path
              d="m5 13 4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-extrabold text-slate-900">
          Salamat! We received your CV.
        </h3>
        <p className="mt-2 text-slate-600">
          Our team will review your profile and reach out within 2–3 business
          days if there&apos;s a match. Keep your phone and email nearby.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-bold text-slate-700"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Juan Dela Cruz"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="mobile"
              className="mb-1.5 block text-sm font-bold text-slate-700"
            >
              Mobile / WhatsApp
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              placeholder="+63 9XX XXX XXXX"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-bold text-slate-700"
            >
              Email (optional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="trade"
              className="mb-1.5 block text-sm font-bold text-slate-700"
            >
              Trade / Occupation
            </label>
            <select
              id="trade"
              name="trade"
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            >
              <option value="" disabled>
                Select your trade
              </option>
              {TRADES.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="experience"
              className="mb-1.5 block text-sm font-bold text-slate-700"
            >
              Years of experience
            </label>
            <input
              id="experience"
              name="experience"
              type="number"
              min={0}
              max={50}
              required
              placeholder="e.g. 3"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="country"
            className="mb-1.5 block text-sm font-bold text-slate-700"
          >
            Preferred country
          </label>
          <select
            id="country"
            name="country"
            defaultValue={COUNTRIES[0]}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          >
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="cv"
            className="mb-1.5 block text-sm font-bold text-slate-700"
          >
            Upload your CV
          </label>
          <label
            htmlFor="cv"
            className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-brand-blue hover:bg-blue-50/40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 text-slate-400"
            >
              <path
                d="M12 16V4m0 0-4 4m4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-semibold text-slate-700">
              {fileName ?? "Tap to upload PDF, DOC, or image of your resume"}
            </span>
            <span className="text-xs text-slate-400">Max file size 10MB</span>
            <input
              id="cv"
              name="cv"
              type="file"
              required
              accept=".pdf,.doc,.docx,image/*"
              className="sr-only"
              onChange={(event) =>
                setFileName(event.target.files?.[0]?.name ?? null)
              }
            />
          </label>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-500">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
          />
          <span>
            I agree to let Verifil process my personal data and documents to
            match me with employers, in line with the Data Privacy Act of
            2012.
          </span>
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-brand-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 rounded-full bg-brand-red py-3.5 text-base font-bold text-white shadow-sm transition hover:brightness-95 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit My CV"}
        </button>

        <p className="text-center text-xs text-slate-400">
          100% free to apply. Verifil never charges applicants for submitting
          a CV.
        </p>
      </div>
    </form>
  );
}
