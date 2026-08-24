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
  revalidatePath(`/admin/employers/${employerId}`);
}

export async function updateEmployerProfile(
  employerId: string,
  formData: FormData,
) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("employer_profiles")
    .update({
      company_name: formData.get("company_name") as string,
      contact_name: formData.get("contact_name") as string,
      contact_email: formData.get("contact_email") as string,
      phone: (formData.get("phone") as string) || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", employerId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/employers");
  revalidatePath(`/admin/employers/${employerId}`);
}
