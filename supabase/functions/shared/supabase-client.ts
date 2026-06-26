import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

/**
 * Returns a standard Supabase client with standard anon privileges.
 */
export function getSupabaseClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
}

/**
 * Returns an administrative service-role client bypassing all RLS constraints.
 */
export function getSupabaseServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
}
