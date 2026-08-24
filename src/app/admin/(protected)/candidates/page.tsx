import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

const statusStyles: Record<string, string> = {
  new: "bg-brand-offwhite text-slate-600",
  screening: "bg-amber-100 text-amber-700",
  verified: "bg-blue-100 text-blue-700",
  matched: "bg-green-100 text-green-700",
  deployed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function CandidatesPage() {
  const { data: candidates, error } = await supabaseAdmin
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Candidates</h1>
      <p className="mt-1 text-sm text-slate-500">
        Full profiles built from CV submissions. Create one from the
        Submissions tab.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red">
          Failed to load candidates: {error.message}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Trade</th>
              <th className="px-4 py-3">Exp.</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">CV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates?.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  <Link href={`/admin/candidates/${c.id}`} className="hover:underline">
                    {c.full_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{c.trade ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">
                  {c.experience_years != null ? `${c.experience_years} yrs` : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {c.preferred_country ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {c.score != null ? `${c.score}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[c.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/admin/candidates/${c.id}/download`}
                    className="font-semibold text-brand-blue hover:underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {candidates?.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No candidate profiles yet.
          </p>
        )}
      </div>
    </div>
  );
}
