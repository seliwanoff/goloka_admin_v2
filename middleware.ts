// middleware.ts (in your root directory)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
//   const token =
//     request.cookies.get("auth_token")?.value ||
    request.headers.get("authorization");

  // Public paths that don't require authentication
//   const publicPaths = ["/signin", "/signup", "/forget_password", ".dashboard/root"];
//   const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Auth check and redirects
//   if (!token && !isPublicPath && pathname !== "/") {
//     // Redirect to signin if accessing protected route without auth
//     const signInUrl = new URL("/signin", request.url);
//     signInUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(signInUrl);
//   }

//   if (token && (isPublicPath || pathname === "/")) {
//     // Redirect to dashboard if authenticated user tries to access public routes
//     return NextResponse.redirect(new URL("/dashboard/root", request.url));
//   }

  // Redirect root to signin
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};
