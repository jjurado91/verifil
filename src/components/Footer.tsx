import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-slate-950 py-10 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Image
            src="/logo/verifil-logo-white.png"
            alt="Verifil"
            width={397}
            height={100}
            className="h-9 w-auto"
          />
          <p className="max-w-md text-sm">
            Verifil is a technology platform built to make overseas
            recruitment transparent, verified, and fair for every Filipino
            worker.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Verifil. DMW License No.
            [pending]. All rights reserved.
          </p>
          <p>Placement fees, if any, follow POEA/DMW-mandated limits.</p>
        </div>
      </div>
    </footer>
  );
}
