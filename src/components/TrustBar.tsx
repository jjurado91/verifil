const badges = [
  { label: "DMW Accredited", note: "License No. [pending]" },
  { label: "Data Privacy Act Compliant", note: "Your documents stay protected" },
  { label: "No Placement Fee Loopholes", note: "Transparent pricing only" },
  { label: "Verified Employers Only", note: "Every job screened before posting" },
];

export function TrustBar() {
  return (
    <section className="border-b border-slate-100 bg-brand-offwhite">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-4 sm:px-6">
        {badges.map((badge) => (
          <div key={badge.label} className="flex items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 h-6 w-6 shrink-0 text-brand-blue"
            >
              <path
                d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">
                {badge.label}
              </p>
              <p className="text-xs leading-tight text-slate-500">
                {badge.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
