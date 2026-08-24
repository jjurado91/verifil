import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "verifil_admin_session";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(session) && session === process.env.ADMIN_PASSWORD;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
