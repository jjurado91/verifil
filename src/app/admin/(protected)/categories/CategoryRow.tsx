"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCategory, deleteCategory } from "./actions";

export function CategoryRow({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (value.trim() === name) {
      setEditing(false);
      return;
    }
    setPending(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("name", value);
      await updateCategory(id, formData);
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? Existing jobs/candidates keep their current value, but it won't be selectable anymore.`)) {
      return;
    }
    setPending(true);
    try {
      await deleteCategory(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
      setPending(false);
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setValue(name);
              setEditing(false);
            }
          }}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        />
      ) : (
        <span className="text-sm font-semibold text-slate-800">{name}</span>
      )}

      <div className="flex shrink-0 items-center gap-3 text-sm font-semibold">
        {error && <span className="text-xs text-brand-red">{error}</span>}
        {editing ? (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={handleSave}
              className="text-brand-blue hover:underline disabled:opacity-60"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setValue(name);
                setEditing(false);
              }}
              className="text-slate-500 hover:underline"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-brand-blue hover:underline"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={handleDelete}
              className="text-brand-red hover:underline disabled:opacity-60"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}
