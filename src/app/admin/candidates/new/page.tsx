import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { CandidateForm } from "../CandidateForm";
import { createCandidate } from "../actions";

export default async function NewCandidatePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  if (!from) notFound();

  const { data: submission } = await supabaseAdmin
    .from("cv_submissions")
    .select("*")
    .eq("id", from)
    .single();

  if (!submission) notFound();

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">
        Create Candidate Profile
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Prefilled from {submission.full_name}&apos;s CV submission. Fill in
        the rest from a call or chat with the applicant.
      </p>
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
        />
      </div>
    </div>
  );
}
