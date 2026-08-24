"use server";

import { redirect } from "next/navigation";
import { setAdminSession, clearAdminSession } from "@/lib/admin-auth";

export async function login(_prevState: string | null, formData: FormData) {
  const password = formData.get("password");
  const name = (formData.get("name") as string)?.trim();
  if (password !== process.env.ADMIN_PASSWORD) {
    return "Incorrect password.";
  }
  if (!name) {
    return "Please enter your name.";
  }
  await setAdminSession(name);
  redirect("/admin");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin");
}
