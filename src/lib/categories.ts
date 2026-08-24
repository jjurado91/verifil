import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getCategories(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("job_categories")
    .select("name")
    .order("name", { ascending: true });

  return (data ?? []).map((row) => row.name);
}
