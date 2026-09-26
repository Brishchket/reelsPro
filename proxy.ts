// proxy.ts (repo root)
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const protectedRoutes = ["/dashboard"]

export default auth((req) => {
  const isProtected = protectedRoutes.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  )
  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}