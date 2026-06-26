import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js 16 Proxy — Route Protection & Session Management
 *
 * Replaces the Next.js middleware.ts convention (renamed to proxy.ts in v16).
 *
 * Responsibilities:
 * 1. Refresh Supabase auth session cookies on every request
 * 2. Protect /admin/* routes — redirect unauthenticated users to /login
 *
 * Per Software Architecture Document Section 6:
 * "A Next.js Middleware file intercepts requests to /admin/* paths.
 *  The middleware decodes the token with the Supabase client,
 *  checking for active sessions and valid roles."
 */
export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Create Supabase client with cookie handling for session refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: Do not add logic between createServerClient and getUser().
  // This call refreshes the auth session token — must run on every request.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect all /admin/* routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isDummySupabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project-ref");
    if (!user && !isDummySupabase) {
      // No session — redirect to login
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // TODO (Sprint 3): Check user role from profiles/admins table
    // For now, any authenticated user can access admin (will be restricted later)
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static assets)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Public assets (images, fonts)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
