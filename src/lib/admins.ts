import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getAdminNames(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("admin_profiles")
    .select("name")
    .order("name", { ascending: true });

  return (data ?? []).map((row) => row.name);
}
