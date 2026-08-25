import "server-only";
import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings-defaults";

export type { SiteSettings };
export { DEFAULT_SITE_SETTINGS };

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select(
      "seo_title, seo_description, og_image_url, social_facebook, social_instagram, social_linkedin, maintenance_mode",
    )
    .eq("id", "default")
    .maybeSingle();

  if (!data) return DEFAULT_SITE_SETTINGS;

  return {
    seoTitle: data.seo_title ?? DEFAULT_SITE_SETTINGS.seoTitle,
    seoDescription: data.seo_description ?? DEFAULT_SITE_SETTINGS.seoDescription,
    ogImageUrl: data.og_image_url ?? DEFAULT_SITE_SETTINGS.ogImageUrl,
    socialFacebook: data.social_facebook ?? DEFAULT_SITE_SETTINGS.socialFacebook,
    socialInstagram: data.social_instagram ?? DEFAULT_SITE_SETTINGS.socialInstagram,
    socialLinkedin: data.social_linkedin ?? DEFAULT_SITE_SETTINGS.socialLinkedin,
    maintenanceMode: data.maintenance_mode,
  };
});
