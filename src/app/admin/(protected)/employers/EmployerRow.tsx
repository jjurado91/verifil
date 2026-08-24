import Link from "next/link";
import { EmployerStatusActions } from "./EmployerStatusActions";

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
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3 font-semibold text-slate-900">
        <Link href={`/admin/employers/${id}`} className="hover:underline">
          {companyName}
        </Link>
      </td>
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
        <EmployerStatusActions id={id} status={status} />
      </td>
    </tr>
  );
}
