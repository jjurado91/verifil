"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

export default function AdminLoginPage() {
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
      const email = form.get("email") as string;
      const password = form.get("password") as string;

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw new Error("Incorrect email or password.");
      if (!data.user) throw new Error("Login failed. Please try again.");

      const { data: profile } = await supabase
        .from("admin_profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.auth.signOut();
        throw new Error("This account doesn't have admin access.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-xl font-extrabold text-slate-900">Admin Login</h1>
      <p className="mt-1 text-sm text-slate-500">
        Verifil internal team access.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          autoFocus
          placeholder="Email"
          className={inputClass}
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className={inputClass}
        />
        {error && (
          <p className="text-sm font-medium text-brand-red">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand-blue py-3 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
