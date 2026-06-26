import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/features/admin/components/admin-layout-client";

/**
 * Server-Side Admin Authorization Guard Layout.
 *
 * Excludes client-side bypasses and performs authentication and role checking
 * directly against Supabase database tables server-side.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  
  // Initialize server-side Supabase client using requests cookies context
  const supabase = createServerClient(
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
            // Safe fallback when run inside server-only layout context
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDummySupabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project-ref");

  // 1. Authentication Check
  if (!user && !isDummySupabase) {
    redirect("/login?redirect=/admin");
  }

  // 2. Authorization Check (Database-driven Role Verification)
  let isAdmin = false;
  
  if (user) {
    const { data: adminRole } = await supabase
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
      
    isAdmin = !!adminRole;
  } else if (isDummySupabase) {
    // Local developer stub fallback
    isAdmin = true;
  }

  if (!isAdmin) {
    redirect("/forbidden");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
