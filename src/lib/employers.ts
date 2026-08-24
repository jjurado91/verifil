import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getApprovedEmployers(): Promise<
  { id: string; company_name: string }[]
> {
  const { data } = await supabaseAdmin
    .from("employer_profiles")
    .select("id, company_name")
    .eq("status", "approved")
    .order("company_name", { ascending: true });

  return data ?? [];
}
