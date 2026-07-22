import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const protectedRoutes = ["/dashboard", "/admin", "/profile", "/my-articles", "/articles/submit", "/my-events", "/events/create", "/dashboard/submit", "/dashboard/my-articles"];
const authRoutes = ["/auth/login"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("fkhk_token")?.value;
  const { pathname } = request.nextUrl;

  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*", "/my-articles/:path*", "/articles/submit/:path*", "/my-events/:path*", "/events/create/:path*"],
};
