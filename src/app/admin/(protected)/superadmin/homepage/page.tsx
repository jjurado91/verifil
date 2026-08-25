import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/site-content";
import { HomepageEditorForm } from "./HomepageEditorForm";

export default async function EditHomepagePage() {
  if (!(await isSuperAdmin())) redirect("/admin/dashboard");

  const content = await getSiteContent();

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Edit Landing Page</h1>
      <p className="mt-1 text-sm text-slate-500">
        Edit the copy on the public homepage. Layout and images stay as
        designed — only text content changes here.
      </p>
      <div className="mt-4">
        <HomepageEditorForm initial={content} />
      </div>
    </div>
  );
}
