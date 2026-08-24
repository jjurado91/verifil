import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { SubmissionRowActions } from "./SubmissionRowActions";

export default async function AdminPage() {
  const { data: submissions, error } = await supabaseAdmin
    .from("cv_submissions")
    .select("*, candidates(id)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">
        CV Submissions
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Raw applications from the public landing page. Turn one into a full
        candidate profile once you&apos;re ready to work it.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red">
          Failed to load submissions: {error.message}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Trade</th>
              <th className="px-4 py-3">Exp.</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">CV</th>
              <th className="px-4 py-3">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions?.map((row) => {
              const candidateId = (
                row.candidates as { id: string }[] | null
              )?.[0]?.id;
              return (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {row.full_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{row.mobile}</div>
                    {row.email && (
                      <div className="text-xs text-slate-400">
                        {row.email}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.trade}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.experience_years} yrs
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.preferred_country ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <SubmissionRowActions
                      id={row.id}
                      fileName={row.cv_file_name}
                      applicantName={row.full_name}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {candidateId ? (
                      <Link
                        href={`/admin/candidates/${candidateId}`}
                        className="font-semibold text-brand-blue hover:underline"
                      >
                        View profile
                      </Link>
                    ) : (
                      <Link
                        href={`/admin/candidates/new?from=${row.id}`}
                        className="font-semibold text-brand-red hover:underline"
                      >
                        Create profile
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {submissions?.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No submissions yet.
          </p>
        )}
      </div>
    </div>
  );
}
