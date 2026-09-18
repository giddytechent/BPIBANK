import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });
  const refreshTokenExpires =
    typeof token?.refreshTokenExpires === "number"
      ? token.refreshTokenExpires
      : undefined;
  const refreshTokenExpired =
    !refreshTokenExpires || Date.now() >= refreshTokenExpires;

  if (!token || token.error === "RefreshTokenExpired" || refreshTokenExpired) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
