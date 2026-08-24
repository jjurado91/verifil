import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PrintButton } from "./PrintButton";

export default async function CandidateEndorsementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: candidate } = await supabaseAdmin
    .from("candidates")
    .select("*")
    .eq("id", id)
    .single();

  if (!candidate) notFound();

  return (
    <div>
      <div className="print:hidden mb-6 flex items-center justify-between">
        <Link
          href={`/admin/candidates/${id}`}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          ← Back to Profile
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-10 print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <Image
            src="/logo/verifil-logo.png"
            alt="Verifil"
            width={397}
            height={100}
            className="h-9 w-auto"
          />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Candidate Endorsement
          </p>
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
          {candidate.full_name}
        </h1>
        <p className="mt-1 text-base font-semibold text-brand-blue">
          {candidate.trade ?? "Trade not specified"}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Experience
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {candidate.experience_years != null
                ? `${candidate.experience_years} years`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Nationality
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {candidate.nationality}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Preferred Country
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {candidate.preferred_country ?? "Open to any"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Civil Status
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {candidate.civil_status ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Birthday
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {candidate.birthday
                ? new Date(candidate.birthday).toLocaleDateString()
                : "—"}
            </dd>
          </div>
        </dl>

        {candidate.score_notes && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Assessment Summary
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {candidate.score_notes}
            </p>
          </div>
        )}

        <p className="mt-10 border-t border-slate-100 pt-6 text-xs text-slate-400">
          Endorsed via Verifil on {new Date().toLocaleDateString()}. Verified,
          vetted candidate — full documentation available on request.
        </p>
      </div>
    </div>
  );
}
