import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { Session, User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface AuthRepository {
  login(email: string, password: string): Promise<{ user: User; session: Session }>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<Session | null>;
  getCurrentUser(): Promise<User | null>;
  getCurrentProfile(): Promise<Profile | null>;
  refreshSession(): Promise<Session | null>;
  preparePasswordReset(email: string): Promise<void>;
  prepareMagicLink(email: string): Promise<void>;
  prepareOAuth(provider: "google" | "github"): Promise<{ url: string }>;
  isAdmin(userId: string): Promise<boolean>;
  getPermissions(userId: string): Promise<string | null>;
}

// ---------------------------------------------------------------------------
// Supabase Authentication & Profile Synchronization Implementation
// ---------------------------------------------------------------------------

class SupabaseAuthRepository implements AuthRepository {
  private getSupabase() {
    return createClient();
  }

  async login(email: string, password: string): Promise<{ user: User; session: Session }> {
    const supabase = this.getSupabase();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new RepositoryError(error.message, "AUTH_LOGIN_FAILED", error);
      if (!data.user || !data.session) {
        throw new RepositoryError("Authentication returned incomplete session data", "AUTH_LOGIN_FAILED");
      }

      // Profile Synchronization: Ensure user profile is registered in DB
      const user = data.user;
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileError && !profile) {
        // First login: sync info and insert profile
        const username = email.split("@")[0] || "user_" + user.id.substring(0, 8);
        await supabase.from("profiles").insert({
          id: user.id,
          username: username,
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`,
        });
      }

      return { user: data.user, session: data.session };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to authenticate user credentials";
      throw new RepositoryError(message, "AUTH_LOGIN_FAILED", err);
    }
  }

  async logout(): Promise<void> {
    const supabase = this.getSupabase();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new RepositoryError(error.message, "AUTH_LOGOUT_FAILED", error);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to log out user session";
      throw new RepositoryError(message, "AUTH_LOGOUT_FAILED", err);
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    const supabase = this.getSupabase();
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw new RepositoryError(error.message, "AUTH_GET_SESSION_FAILED", error);
      return session;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to fetch current user session";
      throw new RepositoryError(message, "AUTH_GET_SESSION_FAILED", err);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const supabase = this.getSupabase();
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw new RepositoryError(error.message, "AUTH_GET_USER_FAILED", error);
      return user;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to fetch current auth user";
      throw new RepositoryError(message, "AUTH_GET_USER_FAILED", err);
    }
  }

  async getCurrentProfile(): Promise<Profile | null> {
    const supabase = this.getSupabase();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw new RepositoryError(error.message, "AUTH_GET_PROFILE_FAILED", error);
      return data;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to fetch current user profile";
      throw new RepositoryError(message, "AUTH_GET_PROFILE_FAILED", err);
    }
  }

  async refreshSession(): Promise<Session | null> {
    const supabase = this.getSupabase();
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw new RepositoryError(error.message, "AUTH_REFRESH_SESSION_FAILED", error);
      return session;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to refresh user session";
      throw new RepositoryError(message, "AUTH_REFRESH_SESSION_FAILED", err);
    }
  }

  async preparePasswordReset(email: string): Promise<void> {
    const supabase = this.getSupabase();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw new RepositoryError(error.message, "AUTH_RESET_PASSWORD_FAILED", error);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to request password reset";
      throw new RepositoryError(message, "AUTH_RESET_PASSWORD_FAILED", err);
    }
  }

  async prepareMagicLink(email: string): Promise<void> {
    const supabase = this.getSupabase();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw new RepositoryError(error.message, "AUTH_MAGIC_LINK_FAILED", error);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to dispatch magic authentication link";
      throw new RepositoryError(message, "AUTH_MAGIC_LINK_FAILED", err);
    }
  }

  async prepareOAuth(provider: "google" | "github"): Promise<{ url: string }> {
    const supabase = this.getSupabase();
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw new RepositoryError(error.message, "AUTH_OAUTH_FAILED", error);
      if (!data?.url) throw new RepositoryError("OAuth url not returned by provider client", "AUTH_OAUTH_FAILED");
      return { url: data.url };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to initialize OAuth sequence";
      throw new RepositoryError(message, "AUTH_OAUTH_FAILED", err);
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    const supabase = this.getSupabase();
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw new RepositoryError(error.message, "AUTH_CHECK_ROLE_FAILED", error);
      return !!data;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      const message = err instanceof Error ? err.message : "Failed to run admin authorization query";
      throw new RepositoryError(message, "AUTH_CHECK_ROLE_FAILED", err);
    }
  }

  async getPermissions(userId: string): Promise<string | null> {
    const supabase = this.getSupabase();
    try {
      const { data: adminData } = await supabase
        .from("admins")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      if (adminData) return adminData.role;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      return profile ? "authenticated" : "anonymous";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch user permissions";
      throw new RepositoryError(message, "AUTH_PERMISSIONS_FAILED", err);
    }
  }
}

export const authRepository: AuthRepository = new SupabaseAuthRepository();
