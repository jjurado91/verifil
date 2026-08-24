"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setEmployerStatus } from "./actions";

export function EmployerStatusActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function updateStatus(next: "approved" | "rejected" | "pending") {
    setPending(true);
    try {
      await setEmployerStatus(id, next);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-3 text-sm font-semibold">
      {status !== "approved" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => updateStatus("approved")}
          className="text-green-600 hover:underline disabled:opacity-60"
        >
          Approve
        </button>
      )}
      {status !== "rejected" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => updateStatus("rejected")}
          className="text-brand-red hover:underline disabled:opacity-60"
        >
          Reject
        </button>
      )}
      {status !== "pending" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => updateStatus("pending")}
          className="text-slate-500 hover:underline disabled:opacity-60"
        >
          Reset
        </button>
      )}
    </div>
  );
}
