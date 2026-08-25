"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };
type NavEntry = NavLink | { label: string; items: NavLink[] };

function isGroup(entry: NavEntry): entry is { label: string; items: NavLink[] } {
  return "items" in entry;
}

const baseNav: NavEntry[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  {
    label: "Candidates",
    items: [
      { href: "/admin", label: "CV Submissions" },
      { href: "/admin/candidates", label: "Profiles" },
    ],
  },
  {
    label: "Jobs",
    items: [
      { href: "/admin/employers", label: "Employers" },
      { href: "/admin/jobs", label: "Roles" },
      { href: "/admin/categories", label: "Job Categories" },
    ],
  },
];

const superAdminGroup: NavEntry = {
  label: "Superadmin",
  items: [
    { href: "/admin/superadmin/settings", label: "Settings" },
    { href: "/admin/superadmin/seo", label: "SEO" },
    { href: "/admin/superadmin/homepage", label: "Edit Homepage" },
  ],
};

function DesktopDropdown({
  group,
  active,
}: {
  group: { label: string; items: NavLink[] };
  active: boolean;
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
        className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
          active
            ? "bg-brand-blue/10 text-brand-blue"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        {group.label}
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-40 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminNav({
  adminName,
  logout,
  isSuperAdmin,
}: {
  adminName: string;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = isSuperAdmin ? [...baseNav, superAdminGroup] : baseNav;

  function isEntryActive(entry: NavEntry) {
    if (isGroup(entry)) return entry.items.some((i) => pathname === i.href);
    return pathname === entry.href;
  }

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 md:flex">
        {nav.map((entry) =>
          isGroup(entry) ? (
            <DesktopDropdown key={entry.label} group={entry} active={isEntryActive(entry)} />
          ) : (
            <Link
              key={entry.href}
              href={entry.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                pathname === entry.href
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {entry.label}
            </Link>
          ),
        )}
      </nav>

      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          {open ? (
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-slate-200 bg-white px-4 py-3 shadow-md md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((entry) =>
              isGroup(entry) ? (
                <div key={entry.label} className="pt-2">
                  <p className="px-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                    {entry.label}
                  </p>
                  {entry.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-sm font-semibold ${
                        pathname === item.href
                          ? "bg-brand-blue/10 text-brand-blue"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={entry.href}
                  href={entry.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    pathname === entry.href
                      ? "bg-brand-blue/10 text-brand-blue"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {entry.label}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm font-semibold text-slate-500">
              {adminName}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
