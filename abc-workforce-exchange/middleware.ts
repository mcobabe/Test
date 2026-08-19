import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "abc_workforce_session";

function requiredRole(pathname: string) {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/member")) return "member";
  if (pathname.startsWith("/candidate") && !pathname.startsWith("/candidate/signup")) return "candidate";
  return null;
}

export async function middleware(request: NextRequest) {
  const needed = requiredRole(request.nextUrl.pathname);
  if (!needed) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secretValue = process.env.SESSION_SECRET;
  if (!token || !secretValue) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secretValue));
    const role = String(payload.role ?? "");
    const allowed =
      (needed === "candidate" && role === "candidate") ||
      (needed === "member" && ["contractor_user", "company_admin", "abc_staff", "abc_admin"].includes(role)) ||
      (needed === "admin" && ["abc_staff", "abc_admin"].includes(role));

    if (!allowed) {
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/candidate/:path*", "/member/:path*", "/admin/:path*"],
};
