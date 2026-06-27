import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Circuit Breaker / Cooldown state to prevent overloading the request queue when Supabase is down
let lastUnreachableTime = 0;
const SERVICE_COOLDOWN_MS = 15000; // 15 seconds cooldown

/**
 * Next.js Middleware/Proxy — Session Management & Authentication Check
 *
 * Responsibilities:
 * 1. Refresh Supabase auth session cookies on every request (single source of truth).
 * 2. Redirect unauthenticated users trying to access protected routes (/admin/*) to /login.
 * 3. Does NOT query the database or check roles/permissions (deferred to Server Components/Layouts).
 */
export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Create server-side Supabase client with cookie storage integration
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

  let user = null;
  let isUnreachable = false;

  const now = Date.now();
  if (now - lastUnreachableTime < SERVICE_COOLDOWN_MS) {
    isUnreachable = true;
  } else {
    // Refresh user token on every request - single source of truth
    // Wrapped in try/catch to gracefully handle connection timeouts and network errors
    try {
      const {
        data: { user: fetchedUser },
      } = await supabase.auth.getUser();
      user = fetchedUser;
    } catch (err) {
      console.error(
        "Supabase Auth service is temporarily unreachable in proxy:",
        err instanceof Error ? err.message : err
      );
      isUnreachable = true;
      lastUnreachableTime = Date.now();
    }
  }

  const pathname = request.nextUrl.pathname;

  // Protect all /admin/* routes from anonymous guests
  if (pathname.startsWith("/admin")) {
    const isDummySupabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project-ref");
    
    // If Supabase is unreachable and it's not a dummy setup, redirect to login with error parameter
    if (isUnreachable && !isDummySupabase) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("error", "service_unreachable");
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!user && !isDummySupabase) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users attempting to access /login back home
  if (pathname === "/login" && user) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
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
     * - Public media assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
