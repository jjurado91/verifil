import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * An "admin" is any authenticated Supabase user with a row in
 * admin_profiles. Employers authenticate through the same Supabase Auth
 * user pool but never get a row there, so this check alone separates
 * the two — no separate password/cookie scheme needed.
 *
 * Wrapped in React's cache() so the several call sites that each want
 * to know "is this an admin" / "what's their name" within one request
 * (layout + page + any server actions) share a single Supabase round
 * trip instead of each re-validating the session from scratch.
 */
export const getAdminProfile = cache(async () => {
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
});

export async function isAdminAuthenticated() {
  return Boolean(await getAdminProfile());
}

export async function getAdminName() {
  const profile = await getAdminProfile();
  return profile?.name ?? "Admin";
}
