import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { isAdminAuthenticated, getAdminName } from "@/lib/admin-auth";
import { logout } from "../actions";
import { AdminNav } from "./AdminNav";
import { GlobalSearch } from "./GlobalSearch";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin | Verifil",
  robots: { index: false, follow: false },
};

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
      <div className="relative border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/admin" className="shrink-0">
              <Image
                src="/logo/verifil-logo.png"
                alt="Verifil"
                width={397}
                height={100}
                className="h-7 w-auto"
              />
            </Link>
            <AdminNav adminName={adminName} logout={logout} />
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <GlobalSearch />
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
        <div className="border-t border-slate-100 px-4 py-2.5 sm:px-6 md:hidden">
          <GlobalSearch />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
