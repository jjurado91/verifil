import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Employer Portal | Verifil",
  robots: { index: false, follow: false },
};

export default async function EmployerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/employers/login");

  const { data: profile } = await supabase
    .from("employer_profiles")
    .select("company_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/employers/portal" className="flex items-center gap-2">
              <Image
                src="/logo/verifil-logo.png"
                alt="Verifil"
                width={397}
                height={100}
                className="h-7 w-auto"
              />
            </Link>
            <span className="hidden text-sm font-semibold text-slate-500 sm:inline">
              {profile?.company_name ?? "Employer Portal"}
            </span>
          </div>
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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
