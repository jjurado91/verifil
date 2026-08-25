"use server";

import { revalidatePath } from "next/cache";
import { isSuperAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { HomepageContent } from "@/lib/site-content";

async function requireSuperAdmin() {
  const authed = await isSuperAdmin();
  if (!authed) throw new Error("Unauthorized — superadmin access required.");
}

export async function saveHomepageContent(content: HomepageContent) {
  await requireSuperAdmin();

  const { error } = await supabaseAdmin
    .from("site_content")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", "homepage");
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/superadmin/homepage");
}

export async function saveSeoSettings(formData: FormData) {
  await requireSuperAdmin();

  const { error } = await supabaseAdmin
    .from("site_settings")
    .update({
      seo_title: (formData.get("seo_title") as string) || null,
      seo_description: (formData.get("seo_description") as string) || null,
      og_image_url: (formData.get("og_image_url") as string) || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/superadmin/seo");
}

export async function saveSiteSettings(formData: FormData) {
  await requireSuperAdmin();

  const { error } = await supabaseAdmin
    .from("site_settings")
    .update({
      social_facebook: (formData.get("social_facebook") as string) || null,
      social_instagram: (formData.get("social_instagram") as string) || null,
      social_linkedin: (formData.get("social_linkedin") as string) || null,
      maintenance_mode: formData.get("maintenance_mode") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/superadmin/settings");
}
