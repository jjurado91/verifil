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

export default function EmployerSignupPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const email = form.get("email") as string;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("Sign up failed. Please try again.");

      const { error: profileError } = await supabase
        .from("employer_profiles")
        .insert({
          id: data.user.id,
          company_name: form.get("companyName") as string,
          contact_name: form.get("contactName") as string,
          contact_email: email,
          phone: (form.get("phone") as string) || null,
        });

      if (profileError) {
        // Session wasn't established (email confirmation still required) —
        // RLS blocked the profile insert. Row gets created on first login instead.
        if (!data.session) {
          setCheckEmail(true);
          return;
        }
        throw profileError;
      }

      if (!data.session) {
        setCheckEmail(true);
        return;
      }

      router.push("/employers/portal");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        {checkEmail ? (
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-slate-900">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              We sent a confirmation link to finish setting up your account.
              Once confirmed, log in to reach your portal.
            </p>
            <Link
              href="/employers/login"
              className="mt-6 inline-block rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
            >
              Go to Log In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-extrabold text-slate-900">
              Create your Employer Account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Post job openings and manage your listings directly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div>
                <label className={labelClass}>Company name</label>
                <input name="companyName" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contact name</label>
                <input name="contactName" required className={inputClass} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Work email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone (optional)</label>
                  <input name="phone" className={inputClass} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    className={inputClass}
                  />
                </div>
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
                {submitting ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/employers/login"
                className="font-semibold text-brand-blue hover:underline"
              >
                Log in
              </Link>
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
