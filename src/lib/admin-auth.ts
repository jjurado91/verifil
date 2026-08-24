import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * An "admin" is any authenticated Supabase user with a row in
 * admin_profiles. Employers authenticate through the same Supabase Auth
 * user pool but never get a row there, so this check alone separates
 * the two — no separate password/cookie scheme needed.
 */
export async function getAdminProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("name, email")
    .eq("id", user.id)
    .maybeSingle();

  return profile;
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminProfile());
}

export async function getAdminName() {
  const profile = await getAdminProfile();
  return profile?.name ?? "Admin";
}
