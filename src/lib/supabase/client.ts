import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { resilientFetch } from "./resilient-fetch";

/**
 * Creates a Supabase client for use in Client Components.
 *
 * This client uses the public anon key and respects Row Level Security (RLS).
 * It should NEVER have access to the service role key.
 *
 * Usage:
 *   const supabase = createClient()
 *   const { data } = await supabase.from("polls").select("*")
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: resilientFetch,
      },
    }
  );
}
