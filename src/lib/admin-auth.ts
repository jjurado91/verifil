import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "verifil_admin_session";
const NAME_COOKIE_NAME = "verifil_admin_name";
const MAX_AGE = 60 * 60 * 8;

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(session) && session === process.env.ADMIN_PASSWORD;
}

export async function getAdminName() {
  const cookieStore = await cookies();
  return cookieStore.get(NAME_COOKIE_NAME)?.value ?? "Admin";
}

export async function setAdminSession(name: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
  cookieStore.set(NAME_COOKIE_NAME, name, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(NAME_COOKIE_NAME);
}
