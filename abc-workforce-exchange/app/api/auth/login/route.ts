import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "@/lib/db";
import { createSessionToken, sessionCookieName, SessionRole } from "@/lib/session";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  role: SessionRole;
  is_active: boolean;
  company_id: string | null;
};

export async function POST(request: Request) {
  try {
    const body = LoginSchema.parse(await request.json());
    const result = await query<UserRow>(
      `select u.id, u.email, u.password_hash, u.role, u.is_active,
              (select cu.company_id from company_users cu where cu.user_id = u.id limit 1) as company_id
         from users u
        where lower(u.email) = lower($1)
        limit 1`,
      [body.email],
    );

    const user = result.rows[0];
    if (!user || !user.is_active || !user.password_hash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(body.password, user.password_hash);
    if (!valid) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.company_id,
    });

    const response = NextResponse.json({ ok: true, role: user.role });
    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Login is temporarily unavailable." }, { status: 500 });
  }
}
