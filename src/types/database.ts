/**
 * Database type definitions for Supabase.
 *
 * This file will be replaced by the auto-generated types from Supabase CLI:
 *   pnpm supabase gen types typescript --linked > src/types/database.ts
 *
 * The type structure below represents the schema defined in the
 * Database Architecture Document (v1.0).
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          kick_username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          kick_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          kick_username?: string | null;
          updated_at?: string;
        };
      };
      stream_state: {
        Row: {
          id: boolean;
          is_live: boolean;
          viewer_count: number;
          current_game: string | null;
          stream_title: string | null;
          started_at: string | null;
          last_checked_at: string;
        };
        Insert: {
          id?: boolean;
          is_live?: boolean;
          viewer_count?: number;
          current_game?: string | null;
          stream_title?: string | null;
          started_at?: string | null;
          last_checked_at?: string;
        };
        Update: {
          is_live?: boolean;
          viewer_count?: number;
          current_game?: string | null;
          stream_title?: string | null;
          started_at?: string | null;
          last_checked_at?: string;
        };
      };
      game_suggestions: {
        Row: {
          id: string;
          suggested_by: string | null;
          game_title: string;
          steam_appid: number | null;
          cover_image_url: string | null;
          votes_count: number;
          status: "pending" | "considering" | "approved" | "played" | "rejected";
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          suggested_by?: string | null;
          game_title: string;
          steam_appid?: number | null;
          cover_image_url?: string | null;
          votes_count?: number;
          status?: "pending" | "considering" | "approved" | "played" | "rejected";
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          game_title?: string;
          steam_appid?: number | null;
          cover_image_url?: string | null;
          votes_count?: number;
          status?: "pending" | "considering" | "approved" | "played" | "rejected";
          admin_note?: string | null;
          updated_at?: string;
        };
      };
      polls: {
        Row: {
          id: string;
          question: string;
          options: Json;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          options: Json;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          question?: string;
          options?: Json;
          is_active?: boolean;
          expires_at?: string | null;
        };
      };
      announcements: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: string;
          is_pinned: boolean;
          status: string;
          published_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content: string;
          is_pinned?: boolean;
          status?: string;
          published_at?: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          is_pinned?: boolean;
          status?: string;
          published_at?: string;
        };
      };
      clips: {
        Row: {
          id: string;
          kick_clip_id: string;
          title: string;
          duration: number;
          video_url: string;
          thumbnail_url: string;
          view_count: number;
          created_by: string;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          kick_clip_id: string;
          title: string;
          duration: number;
          video_url: string;
          thumbnail_url: string;
          view_count?: number;
          created_by: string;
          is_featured?: boolean;
          created_at: string;
        };
        Update: {
          title?: string;
          view_count?: number;
          is_featured?: boolean;
        };
      };
      faq: {
        Row: {
          id: string;
          category: string;
          question: string;
          answer: string;
          order_weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          question: string;
          answer: string;
          order_weight?: number;
          created_at?: string;
        };
        Update: {
          category?: string;
          question?: string;
          answer?: string;
          order_weight?: number;
        };
      };
      timeline: {
        Row: {
          id: string;
          title: string;
          description: string;
          event_date: string;
          category: string;
          media_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          event_date: string;
          category?: string;
          media_url?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          event_date?: string;
          category?: string;
          media_url?: string | null;
        };
      };
      gallery: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          slug: string;
          cover_image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          slug: string;
          cover_image_url?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          slug?: string;
          cover_image_url?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      suggestion_status: "pending" | "considering" | "approved" | "played" | "rejected";
    };
  };
};

// Convenience type aliases for Row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type StreamState = Database["public"]["Tables"]["stream_state"]["Row"];
export type GameSuggestion = Database["public"]["Tables"]["game_suggestions"]["Row"];
export type Poll = Database["public"]["Tables"]["polls"]["Row"];
export type Announcement = Database["public"]["Tables"]["announcements"]["Row"];
export type Clip = Database["public"]["Tables"]["clips"]["Row"];
export type FaqItem = Database["public"]["Tables"]["faq"]["Row"];
export type TimelineEntry = Database["public"]["Tables"]["timeline"]["Row"];
export type Gallery = Database["public"]["Tables"]["gallery"]["Row"];
export type SuggestionStatus = Database["public"]["Enums"]["suggestion_status"];
