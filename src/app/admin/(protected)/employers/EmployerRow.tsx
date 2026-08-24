"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setEmployerStatus } from "./actions";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export function EmployerRow({
  id,
  companyName,
  contactName,
  contactEmail,
  phone,
  status,
  createdAt,
}: {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone: string | null;
  status: string;
  createdAt: string;
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
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3 font-semibold text-slate-900">{companyName}</td>
      <td className="px-4 py-3 text-slate-600">
        <div>{contactName}</div>
        <div className="text-xs text-slate-400">{contactEmail}</div>
      </td>
      <td className="px-4 py-3 text-slate-600">{phone ?? "—"}</td>
      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
        {new Date(createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status] ?? "bg-slate-100 text-slate-600"}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-3">
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
      </td>
    </tr>
  );
}
