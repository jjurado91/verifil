import Image from "next/image";
import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { LoginForm } from "./LoginForm";
import { logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin | Verifil",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) return <LoginForm />;

  const { data: submissions, error } = await supabaseAdmin
    .from("cv_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo/verifil-logo.png"
            alt="Verifil"
            width={397}
            height={100}
            className="h-8 w-auto"
          />
          <span className="text-sm font-bold text-slate-400">Admin</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Log out
          </button>
        </form>
      </div>

      <h1 className="mt-6 text-xl font-extrabold text-slate-900">
        CV Submissions
      </h1>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red">
          Failed to load submissions: {error.message}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Trade</th>
              <th className="px-4 py-3">Exp.</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">CV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions?.map((row) => (
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
                    <div className="text-xs text-slate-400">{row.email}</div>
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
                  <span className="rounded-full bg-brand-offwhite px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/admin/download/${row.id}`}
                    className="font-semibold text-brand-blue hover:underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
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
