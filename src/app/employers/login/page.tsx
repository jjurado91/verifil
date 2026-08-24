"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
const labelClass = "mb-1.5 block text-sm font-bold text-slate-700";

export default function EmployerLoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const supabase = createClient();
      const form = new FormData(event.currentTarget);

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: form.get("email") as string,
          password: form.get("password") as string,
        });
      if (signInError) throw signInError;

      // Backfill the profile row if it wasn't created at signup time
      // (e.g. email confirmation was required then, so RLS blocked it).
      if (data.user) {
        const { data: existing } = await supabase
          .from("employer_profiles")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("employer_profiles").insert({
            id: data.user.id,
            company_name: "My Company",
            contact_name: data.user.email ?? "Employer",
            contact_email: data.user.email ?? "",
          });
        }
      }

      router.push("/employers/portal");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not log in. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16 sm:px-6">
        <h1 className="text-xl font-extrabold text-slate-900">
          Employer Log In
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your job listings on Verifil.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div>
            <label className={labelClass}>Email</label>
            <input name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              name="password"
              type="password"
              required
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-brand-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-full bg-brand-blue py-3 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
          >
            {submitting ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/employers/signup"
            className="font-semibold text-brand-blue hover:underline"
          >
            Create one
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
