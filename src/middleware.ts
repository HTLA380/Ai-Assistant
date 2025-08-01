import { type NextRequest, NextResponse } from "next/server"
import { ACCESS_TOKEN, REFRESH_TOKEN, refresh, validateToken } from "@/lib/auth"

const publicRoutes = ["/", "/login", "/register"]
const protectedRoutes = ["/dashboard", "/upload", "/agent"]

// Routes that are public but should behave differently for authenticated users,
// or routes that need session data for both guests and logged-in users.
const sessionRoutes = ["/chat"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get(ACCESS_TOKEN)
  const refreshToken = request.cookies.get(REFRESH_TOKEN)

  const isPublicRoute = publicRoutes.includes(pathname)
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isSessionRoute = sessionRoutes.includes(pathname)

  // Redirect authenticated users from public-only routes to the chat page.
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/chat", request.url))
  }

  // Redirect unauthenticated users from protected routes to the login page.
  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // For protected and session-aware routes, validate the token if it exists.
  if (accessToken && (isProtectedRoute || isSessionRoute)) {
    try {
      // Validate the access token.
      await validateToken(accessToken.value)
      return NextResponse.next()
    } catch (_) {
      // If token is invalid, try to refresh it.
      if (!refreshToken) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        // Explicitly clear all auth cookies on failure.
        response.cookies.delete(ACCESS_TOKEN)
        response.cookies.delete(REFRESH_TOKEN)
        // Only redirect if it's a strictly protected route.
        return isProtectedRoute ? response : NextResponse.next()
      }

      try {
        const newAccessToken = await refresh(refreshToken.value)
        const response = NextResponse.next()
        response.cookies.set(ACCESS_TOKEN, newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        })
        return response
      } catch (_) {
        // If refresh fails, clear tokens.
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete(ACCESS_TOKEN)
        response.cookies.delete(REFRESH_TOKEN)
        // Only redirect if it's a strictly protected route.
        // For /chat, just clear the cookies and let them proceed as a guest.
        if (isProtectedRoute) {
          return response
        } else {
          const nextResponse = NextResponse.next()
          nextResponse.cookies.delete(ACCESS_TOKEN)
          nextResponse.cookies.delete(REFRESH_TOKEN)
          return nextResponse
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
