import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/site-settings";
import { SeoForm } from "./SeoForm";

export default async function SeoSettingsPage() {
  if (!(await isSuperAdmin())) redirect("/admin/dashboard");

  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">SEO</h1>
      <p className="mt-1 text-sm text-slate-500">
        Controls the homepage&apos;s search-result and social-share
        appearance (title, description, preview image).
      </p>
      <div className="mt-4">
        <SeoForm initial={settings} />
      </div>
    </div>
  );
}
