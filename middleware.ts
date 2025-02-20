import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Refresh session if expired - required for Server Components
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Get the cookies instance
    const requestCookies = request.cookies.getAll();

    console.log("Middleware - Path:", request.nextUrl.pathname);
    console.log("Middleware - Session:", session ? "present" : "none");
    console.log("Middleware - Cookies:", requestCookies.length);

    // If there's no session and the user is trying to access a protected route
    if (
      !session &&
      (request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/trips"))
    ) {
      console.log(
        "Middleware - Redirecting to login, no session for protected route"
      );
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If there's a session and the user is trying to access auth pages
    if (
      session &&
      (request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/signup"))
    ) {
      console.log(
        "Middleware - Redirecting to dashboard, authenticated user on auth page"
      );
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
