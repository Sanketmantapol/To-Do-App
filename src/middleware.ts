import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
 const sessionCookie = req.cookies.get("better-auth.session_token") || 
                       req.cookies.get("__Secure-better-auth.session_token")

  const authRoutes = ["/login", "/register", "/signup", "/forgot-password"]

  if (sessionCookie && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/todos", req.url))
  }

  if (!sessionCookie && pathname.startsWith("/todos")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/signup",
    "/forgot-password",
    "/todos/:path*",
  ],
}

