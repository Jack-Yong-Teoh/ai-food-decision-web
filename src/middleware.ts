// src/middleware.ts
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/profile",
  "/history",
  "/payment",
  "/user-management",
  "/lucky-pick-management",
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const accessToken = (await cookies()).get("ACCESS_TOKEN")?.value;

  if (protectedRoutes.some((route) => path.startsWith(route)) && !accessToken) {
    return NextResponse.redirect(new URL("/", req.url), 303);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
