"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");
}

export async function setEmployerStatus(
  employerId: string,
  status: "approved" | "rejected" | "pending",
) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("employer_profiles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", employerId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/employers");
}
