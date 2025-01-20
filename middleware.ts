import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";
import { getCookie } from "cookies-next";

// 1. Specify protected and public routes
const protectedRoutes = ["/profile", "/create-listing"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  console.log("Running middleware...");
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const res = NextResponse.next();
  const sessionCookie = await getCookie("session", { req, res });
  const session = await decrypt(sessionCookie?.toString());

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    console.log("user not authenticated, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
