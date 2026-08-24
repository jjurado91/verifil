"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden rounded-full bg-brand-blue px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
    >
      Print / Save as PDF
    </button>
  );
}
