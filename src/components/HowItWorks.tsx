import { processSteps } from "@/lib/data";

const stepIcons: Record<string, React.ReactNode> = {
  "1": (
    <path
      d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "2": (
    <path
      d="M9 12.5 11 14.5 15.5 9.5M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "3": (
    <path
      d="M4 12a8 8 0 1 1 4.5 7.2M4 12V7m0 5h5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "4": (
    <path
      d="M3 13.5 10 11l2.5-6.5L21 3l-1.5 8.5L13 14l-2.5 7L8 13.5H3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

const cardBg = [
  "from-brand-blue to-brand-blue-dark",
  "from-brand-gold to-amber-500",
  "from-brand-red to-rose-700",
  "from-brand-blue-dark to-slate-800",
];

function StepArrow() {
  return (
    <>
      {/* Down arrow for stacked mobile/tablet layout */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-7 w-7 shrink-0 text-slate-300 lg:hidden"
      >
        <path
          d="M12 4v14m0 0-5-5m5 5 5-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Right arrow for horizontal desktop layout */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="hidden h-6 w-6 shrink-0 -translate-y-6 text-slate-300 lg:block"
      >
        <path
          d="M4 12h14m0 0-5-5m5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-brand-offwhite py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-brand-red">
            How It Works
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            From CV to deployment, fully tracked
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-2">
          {processSteps.map((step, index) => (
            <div key={step.step} className="contents">
              <div className="flex w-full max-w-xs flex-col items-center text-center lg:max-w-[13rem]">
                <div
                  className={`relative flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md sm:h-32 sm:w-32 ${cardBg[index]}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-12 w-12 text-white"
                  >
                    {stepIcons[step.step]}
                  </svg>
                  <span className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-extrabold text-slate-900 shadow ring-2 ring-brand-offwhite">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600">
                  {step.description}
                </p>
              </div>

              {index < processSteps.length - 1 && <StepArrow />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
