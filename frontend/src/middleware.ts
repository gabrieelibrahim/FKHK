import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const ADMIN_ROLES = ["admin", "superadmin", "admin_kaset", "admin_psdm", "admin_bph"];
const isAdminRole = (role?: unknown) => typeof role === "string" && ADMIN_ROLES.includes(role);

const protectedRoutes = ["/dashboard", "/admin", "/profile", "/events/create", "/dashboard/submit", "/dashboard/my-articles"];
const authRoutes = ["/auth/login"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("fkhk_token")?.value;
  const { pathname } = request.nextUrl;

  if (token && authRoutes.includes(pathname)) {
    try {
      const { payload } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET as string)
      );
      return NextResponse.redirect(
        new URL(isAdminRole(payload.role) ? "/admin" : "/dashboard", request.url)
      );
    } catch {
      // Allow the login page to handle an invalid or expired token.
    }
  }

  if (protectedRoutes.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Dev mode: accept mock tokens starting with "mock_token_"
    if (token.startsWith("mock_token_")) {
      return NextResponse.next();
    }

    try {
      await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET as string)
      );
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("fkhk_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*", "/events/create/:path*"],
};
