import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { resilientFetch } from "./resilient-fetch";

/**
 * Creates a Supabase client for use in Server Components and API Routes.
 *
 * This client:
 * - Reads and writes cookies for session management (required for auth)
 * - Uses the public anon key (respects RLS)
 * - Is safe to use in RSC, Server Actions, and Route Handlers
 *
 * IMPORTANT: This is async because Next.js 15 requires awaiting cookies().
 *
 * Usage:
 *   const supabase = await createClient()
 *   const { data } = await supabase.from("polls").select("*")
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Cookies can't be set in RSC — this is expected
            // Session refresh will be handled by middleware
          }
        },
      },
      global: {
        fetch: resilientFetch,
      },
    }
  );
}

/**
 * Creates a Supabase admin client with service role privileges.
 *
 * IMPORTANT:
 * - This BYPASSES Row Level Security (RLS)
 * - ONLY use in secure server-side contexts (API Routes, Edge Functions)
 * - NEVER import this in Client Components or expose to the browser
 *
 * Usage:
 *   const supabase = createAdminClient()
 *   const { data } = await supabase.from("admins").select("*")
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: resilientFetch,
      },
    }
  );
}
