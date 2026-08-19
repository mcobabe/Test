import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type SessionRole = "candidate" | "contractor_user" | "company_admin" | "abc_staff" | "abc_admin";

export type SessionUser = {
  userId: string;
  email: string;
  role: SessionRole;
  companyId?: string | null;
};

const COOKIE_NAME = "abc_workforce_session";

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not configured");
  return new TextEncoder().encode(value);
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
}

export async function readSessionToken(token?: string | null): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      role: payload.role as SessionRole,
      companyId: payload.companyId ? String(payload.companyId) : null,
    };
  } catch {
    return null;
  }
}

export async function currentSession() {
  const store = await cookies();
  return readSessionToken(store.get(COOKIE_NAME)?.value);
}

export const sessionCookieName = COOKIE_NAME;
