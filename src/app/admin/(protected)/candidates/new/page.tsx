import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { CandidateForm } from "../CandidateForm";
import { createCandidate } from "../actions";
import { getCategories } from "@/lib/categories";
import { getAdminNames } from "@/lib/admins";

export default async function NewCandidatePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  if (!from) notFound();

  const [{ data: submission }, categories, admins] = await Promise.all([
    supabaseAdmin.from("cv_submissions").select("*").eq("id", from).single(),
    getCategories(),
    getAdminNames(),
  ]);

  if (!submission) notFound();

  const orConditions = [`phone.eq.${submission.mobile}`];
  if (submission.email) orConditions.push(`email.eq.${submission.email}`);
  const { data: duplicates } = await supabaseAdmin
    .from("candidates")
    .select("id, full_name, phone, email")
    .or(orConditions.join(","));

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">
        Create Candidate Profile
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Prefilled from {submission.full_name}&apos;s CV submission. Fill in
        the rest from a call or chat with the applicant.
      </p>

      {duplicates && duplicates.length > 0 && (
        <div className="mt-4 max-w-2xl rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-800">
            Possible duplicate — matching phone or email already exists
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            {duplicates.map((d) => (
              <Link
                key={d.id}
                href={`/admin/candidates/${d.id}`}
                className="text-sm font-semibold text-amber-900 hover:underline"
              >
                {d.full_name} — {d.phone ?? d.email}
              </Link>
            ))}
          </div>
          <p className="mt-2 text-xs text-amber-700">
            You can still create a new profile below if this is genuinely a
            different person.
          </p>
        </div>
      )}

      <div className="mt-4">
        <CandidateForm
          initial={{
            cv_submission_id: submission.id,
            full_name: submission.full_name,
            phone: submission.mobile,
            email: submission.email,
            trade: submission.trade,
            experience_years: submission.experience_years,
            preferred_country:
              submission.preferred_country === "No preference"
                ? null
                : submission.preferred_country,
            cv_file_path: submission.cv_file_path,
            cv_file_name: submission.cv_file_name,
          }}
          action={createCandidate}
          categories={categories}
          admins={admins}
        />
      </div>
    </div>
  );
}
