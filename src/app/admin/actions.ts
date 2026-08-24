"use server";

import { redirect } from "next/navigation";
import { setAdminSession, clearAdminSession } from "@/lib/admin-auth";

export async function login(_prevState: string | null, formData: FormData) {
  const password = formData.get("password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return "Incorrect password.";
  }
  await setAdminSession();
  redirect("/admin");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin");
}
