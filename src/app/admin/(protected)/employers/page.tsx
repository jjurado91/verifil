import { supabaseAdmin } from "@/lib/supabase-admin";
import { EmployerRow } from "./EmployerRow";

export default async function EmployersPage() {
  const { data: employers, error } = await supabaseAdmin
    .from("employer_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Employers</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-brand-red">
          Failed to load employers: {error.message}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employers?.map((e) => (
              <EmployerRow
                key={e.id}
                id={e.id}
                companyName={e.company_name}
                contactName={e.contact_name}
                contactEmail={e.contact_email}
                phone={e.phone}
                status={e.status}
                createdAt={e.created_at}
              />
            ))}
          </tbody>
        </table>
        {employers?.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No employer accounts yet.
          </p>
        )}
      </div>
    </div>
  );
}
