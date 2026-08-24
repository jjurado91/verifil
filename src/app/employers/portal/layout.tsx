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
    .select("company_name, status")
    .eq("id", user.id)
    .single();

  const logoutForm = (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
      >
        Log out
      </button>
    </form>
  );

  const header = (
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
        {logoutForm}
      </div>
    </div>
  );

  if (profile?.status !== "approved") {
    return (
      <div className="min-h-screen bg-slate-50">
        {header}
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
          {profile?.status === "rejected" ? (
            <>
              <h1 className="text-xl font-extrabold text-slate-900">
                Account not approved
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Your employer account application wasn&apos;t approved.
                Contact us at hire@verifiljobs.com if you think this is a
                mistake.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-extrabold text-slate-900">
                Your account is pending approval
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                We review every new employer account before you can post
                jobs. We&apos;ll notify you as soon as you&apos;re approved
                — usually within one business day.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {header}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
