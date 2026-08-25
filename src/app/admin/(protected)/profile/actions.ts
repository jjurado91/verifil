"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function updateOwnName(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Name can't be empty.");

  const { error } = await supabaseAdmin
    .from("admin_profiles")
    .update({ name })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin", "layout");
}
