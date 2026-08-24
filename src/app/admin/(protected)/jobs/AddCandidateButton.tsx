"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addApplicant } from "./applications-actions";

export function AddCandidateButton({
  jobId,
  candidateId,
}: {
  jobId: string;
  candidateId: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleAdd() {
    setPending(true);
    try {
      await addApplicant(jobId, candidateId);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={pending}
      className="rounded-full bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
    >
      {pending ? "Adding…" : "+ Add"}
    </button>
  );
}
