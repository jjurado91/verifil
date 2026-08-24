"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "./actions";

export function AddCategoryForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await createCategory(new FormData(event.currentTarget));
      formRef.current?.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex items-start gap-3"
    >
      <div className="flex-1">
        <input
          name="name"
          required
          placeholder="New category name"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        />
        {error && (
          <p className="mt-1.5 text-sm font-medium text-brand-red">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
      >
        {pending ? "Adding…" : "+ Add Category"}
      </button>
    </form>
  );
}
