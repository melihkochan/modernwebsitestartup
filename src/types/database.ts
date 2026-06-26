export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admins_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_daily: {
        Row: {
          average_viewers: number
          created_at: string
          date: string
          followers_gained: number
          hours_streamed: number
          id: string
          peak_viewers: number
          updated_at: string
        }
        Insert: {
          average_viewers?: number
          created_at?: string
          date: string
          followers_gained?: number
          hours_streamed?: number
          id?: string
          peak_viewers?: number
          updated_at?: string
        }
        Update: {
          average_viewers?: number
          created_at?: string
          date?: string
          followers_gained?: number
          hours_streamed?: number
          id?: string
          peak_viewers?: number
          updated_at?: string
        }
        Relationships: []
      }
      analytics_monthly: {
        Row: {
          average_viewers: number
          created_at: string
          followers_gained: number
          hours_streamed: number
          id: string
          month_start_date: string
          peak_viewers: number
          updated_at: string
        }
        Insert: {
          average_viewers?: number
          created_at?: string
          followers_gained?: number
          hours_streamed?: number
          id?: string
          month_start_date: string
          peak_viewers?: number
          updated_at?: string
        }
        Update: {
          average_viewers?: number
          created_at?: string
          followers_gained?: number
          hours_streamed?: number
          id?: string
          month_start_date?: string
          peak_viewers?: number
          updated_at?: string
        }
        Relationships: []
      }
      analytics_weekly: {
        Row: {
          average_viewers: number
          created_at: string
          followers_gained: number
          hours_streamed: number
          id: string
          peak_viewers: number
          updated_at: string
          week_start_date: string
        }
        Insert: {
          average_viewers?: number
          created_at?: string
          followers_gained?: number
          hours_streamed?: number
          id?: string
          peak_viewers?: number
          updated_at?: string
          week_start_date: string
        }
        Update: {
          average_viewers?: number
          created_at?: string
          followers_gained?: number
          hours_streamed?: number
          id?: string
          peak_viewers?: number
          updated_at?: string
          week_start_date?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          author_id: string
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          is_pinned: boolean | null
          published_at: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean | null
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean | null
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          id: string
          payload: Json | null
          record_id: string | null
          table_name: string
          updated_at: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          record_id?: string | null
          table_name: string
          updated_at?: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          record_id?: string | null
          table_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clips: {
        Row: {
          created_at: string
          created_by: string
          duration: number
          id: string
          is_featured: boolean | null
          kick_clip_id: string
          thumbnail_url: string
          title: string
          updated_at: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          created_at: string
          created_by: string
          duration: number
          id?: string
          is_featured?: boolean | null
          kick_clip_id: string
          thumbnail_url: string
          title: string
          updated_at?: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          duration?: number
          id?: string
          is_featured?: boolean | null
          kick_clip_id?: string
          thumbnail_url?: string
          title?: string
          updated_at?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          category: string
          created_at: string
          deleted_at: string | null
          id: string
          order_weight: number | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          order_weight?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          order_weight?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      follower_history: {
        Row: {
          created_at: string
          id: string
          net_change: number
          timestamp: string
          total_followers: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          net_change?: number
          timestamp?: string
          total_followers: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          net_change?: number
          timestamp?: string
          total_followers?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          created_at: string
          gallery_id: string
          id: string
          image_url: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          gallery_id: string
          id?: string
          image_url: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          gallery_id?: string
          id?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "gallery"
            referencedColumns: ["id"]
          },
        ]
      }
      game_suggestions: {
        Row: {
          admin_note: string | null
          cover_image_url: string | null
          created_at: string
          game_title: string
          id: string
          status: string
          steam_appid: number | null
          suggested_by: string | null
          updated_at: string
          votes_count: number
        }
        Insert: {
          admin_note?: string | null
          cover_image_url?: string | null
          created_at?: string
          game_title: string
          id?: string
          status?: string
          steam_appid?: number | null
          suggested_by?: string | null
          updated_at?: string
          votes_count?: number
        }
        Update: {
          admin_note?: string | null
          cover_image_url?: string | null
          created_at?: string
          game_title?: string
          id?: string
          status?: string
          steam_appid?: number | null
          suggested_by?: string | null
          updated_at?: string
          votes_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_suggestions_suggested_by_fkey"
            columns: ["suggested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_snapshots: {
        Row: {
          bitrate: number
          created_at: string
          id: string
          latency: number | null
          snapshot_time: string
          stream_id: string | null
          updated_at: string
          viewer_count: number
        }
        Insert: {
          bitrate?: number
          created_at?: string
          id?: string
          latency?: number | null
          snapshot_time?: string
          stream_id?: string | null
          updated_at?: string
          viewer_count?: number
        }
        Update: {
          bitrate?: number
          created_at?: string
          id?: string
          latency?: number | null
          snapshot_time?: string
          stream_id?: string | null
          updated_at?: string
          viewer_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "live_snapshots_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "stream_history"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          message: string
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          created_at: string
          fingerprint: string
          id: string
          option_id: string
          poll_id: string
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fingerprint: string
          id?: string
          option_id: string
          poll_id: string
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fingerprint?: string
          id?: string
          option_id?: string
          poll_id?: string
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          options: Json
          question: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          options: Json
          question: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          kick_username: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          kick_username?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          kick_username?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      setup_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          order_weight: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_weight?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_weight?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      setup_items: {
        Row: {
          affiliate_url: string | null
          brand: string
          category_id: string
          created_at: string
          id: string
          image_url: string | null
          model: string
          name: string
          personal_note: string | null
          updated_at: string
        }
        Insert: {
          affiliate_url?: string | null
          brand: string
          category_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          model: string
          name: string
          personal_note?: string | null
          updated_at?: string
        }
        Update: {
          affiliate_url?: string | null
          brand?: string
          category_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          model?: string
          name?: string
          personal_note?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "setup_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "setup_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          icon_name: string | null
          id: string
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          icon_name?: string | null
          id?: string
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          icon_name?: string | null
          id?: string
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      steam_cache: {
        Row: {
          created_at: string
          game_details: Json
          id: string
          steam_appid: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          game_details: Json
          id?: string
          steam_appid: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          game_details?: Json
          id?: string
          steam_appid?: number
          updated_at?: string
        }
        Relationships: []
      }
      stream_history: {
        Row: {
          average_viewers: number | null
          created_at: string
          ended_at: string
          game_played: string
          id: string
          kick_stream_id: string
          peak_viewers: number | null
          started_at: string
          title: string
          updated_at: string
        }
        Insert: {
          average_viewers?: number | null
          created_at?: string
          ended_at: string
          game_played: string
          id?: string
          kick_stream_id: string
          peak_viewers?: number | null
          started_at: string
          title: string
          updated_at?: string
        }
        Update: {
          average_viewers?: number | null
          created_at?: string
          ended_at?: string
          game_played?: string
          id?: string
          kick_stream_id?: string
          peak_viewers?: number | null
          started_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      stream_state: {
        Row: {
          created_at: string
          current_game: string | null
          id: boolean
          is_live: boolean
          last_checked_at: string | null
          started_at: string | null
          stream_title: string | null
          updated_at: string
          viewer_count: number
        }
        Insert: {
          created_at?: string
          current_game?: string | null
          id?: boolean
          is_live?: boolean
          last_checked_at?: string | null
          started_at?: string | null
          stream_title?: string | null
          updated_at?: string
          viewer_count?: number
        }
        Update: {
          created_at?: string
          current_game?: string | null
          id?: boolean
          is_live?: boolean
          last_checked_at?: string | null
          started_at?: string | null
          stream_title?: string | null
          updated_at?: string
          viewer_count?: number
        }
        Relationships: []
      }
      suggestion_votes: {
        Row: {
          created_at: string
          fingerprint: string
          id: string
          profile_id: string | null
          suggestion_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fingerprint: string
          id?: string
          profile_id?: string | null
          suggestion_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fingerprint?: string
          id?: string
          profile_id?: string | null
          suggestion_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_votes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "game_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline: {
        Row: {
          category: string | null
          created_at: string
          description: string
          event_date: string
          id: string
          media_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          event_date: string
          id?: string
          media_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          media_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      viewer_history: {
        Row: {
          created_at: string
          id: string
          stream_history_id: string | null
          timestamp: string
          updated_at: string
          viewers: number
        }
        Insert: {
          created_at?: string
          id?: string
          stream_history_id?: string | null
          timestamp?: string
          updated_at?: string
          viewers: number
        }
        Update: {
          created_at?: string
          id?: string
          stream_history_id?: string | null
          timestamp?: string
          updated_at?: string
          viewers?: number
        }
        Relationships: [
          {
            foreignKeyName: "viewer_history_stream_history_id_fkey"
            columns: ["stream_history_id"]
            isOneToOne: false
            referencedRelation: "stream_history"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { user_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
