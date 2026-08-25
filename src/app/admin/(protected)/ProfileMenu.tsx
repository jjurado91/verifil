"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ProfileMenu({
  adminName,
  logout,
}: {
  adminName: string;
  logout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white transition hover:brightness-95"
      >
        {getInitials(adminName)}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <p className="truncate px-3 py-1.5 text-xs font-semibold text-slate-400">
            {adminName}
          </p>
          <Link
            href="/admin/profile"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Profile
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
