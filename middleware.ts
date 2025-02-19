import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export default async function middleware(req: NextRequest) {
  const session = await auth();

  console.log(session, "middleware session");

  const publicRoutes = ["/auth/login", "/auth/register"];
  const adminRoutes = ["/dashboard", "/application"];

  if (!session) {
    if (!publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  const userRole = session?.user?.role || "undefined";
  console.log(userRole, "middleware userRole");

  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (adminRoutes.includes(req.nextUrl.pathname) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard", "/jobs", "/application"],
};
