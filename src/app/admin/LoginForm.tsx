"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-xl font-extrabold text-slate-900">Admin Login</h1>
      <p className="mt-1 text-sm text-slate-500">
        Verifil applicant submissions.
      </p>
      <form action={formAction} className="mt-6 flex flex-col gap-3">
        <input
          type="text"
          name="name"
          required
          autoFocus
          placeholder="Your name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        />
        {error && <p className="text-sm font-medium text-brand-red">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-blue py-3 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
