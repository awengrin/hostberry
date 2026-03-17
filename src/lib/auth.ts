import { cookies } from "next/headers";

const TOKEN_COOKIE = "hb_token";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value ?? null;
}

export async function setToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearToken() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}

export async function requireAuth(): Promise<string> {
  const token = await getToken();
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  return token;
}
