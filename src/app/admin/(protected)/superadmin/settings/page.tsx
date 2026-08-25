import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "./SettingsForm";

export default async function SiteSettingsPage() {
  if (!(await isSuperAdmin())) redirect("/admin/dashboard");

  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Site-wide settings for the public marketing site.
      </p>
      <div className="mt-4">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
