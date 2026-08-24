import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { isAdminAuthenticated, getAdminName } from "@/lib/admin-auth";
import { logout } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin | Verifil",
  robots: { index: false, follow: false },
};

const navLinks = [
  { href: "/admin", label: "Submissions" },
  { href: "/admin/candidates", label: "Candidates" },
  { href: "/admin/jobs", label: "Jobs" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const adminName = await getAdminName();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Image
              src="/logo/verifil-logo.png"
              alt="Verifil"
              width={397}
              height={100}
              className="h-7 w-auto"
            />
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-slate-500 sm:inline">
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
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
