import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  const session = await auth();

  const publicRoutes = ["/auth/login", "/auth/register"];
  const protectedRoutes = ["/"];
  const adminRoutes = ["/dashboard"];

  if (!session) {
    if (
      protectedRoutes.includes(req.nextUrl.pathname) ||
      adminRoutes.includes(req.nextUrl.pathname)
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  const userRole = session.user?.role || "user";

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL(userRole === "ADMIN" ? "/dashboard" : "/jobs", req.url)
    );
  }

  if (adminRoutes.includes(req.nextUrl.pathname) && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/jobs", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard"],
};
