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
      admin_activity_logs: {
        Row: {
          id: string
          admin_id: string | null
          action: string
          entity: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id?: string | null
          action: string
          entity: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string | null
          action?: string
          entity?: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      setup_items: {
        Row: {
          id: string
          title: string
          slug: string
          brand: string | null
          category: string | null
          description: string | null
          storage_path: string | null
          purchase_url: string | null
          affiliate_url: string | null
          price: number | null
          currency: string
          specifications: Json
          display_order: number
          is_featured: boolean
          is_visible: boolean
          is_archived: boolean
          availability: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          brand?: string | null
          category?: string | null
          description?: string | null
          storage_path?: string | null
          purchase_url?: string | null
          affiliate_url?: string | null
          price?: number | null
          currency?: string
          specifications?: Json
          display_order?: number
          is_featured?: boolean
          is_visible?: boolean
          is_archived?: boolean
          availability?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          brand?: string | null
          category?: string | null
          description?: string | null
          storage_path?: string | null
          purchase_url?: string | null
          affiliate_url?: string | null
          price?: number | null
          currency?: string
          specifications?: Json
          display_order?: number
          is_featured?: boolean
          is_visible?: boolean
          is_archived?: boolean
          availability?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
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
          id: string
          title: string
          description: string | null
          storage_path: string | null
          mime_type: string | null
          thumbnail_url: string | null
          category: string
          alt_text: string | null
          steam_app_id: number | null
          width: number | null
          height: number | null
          file_size: number | null
          is_featured: boolean
          display_order: number
          usage_context: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          storage_path?: string | null
          mime_type?: string | null
          thumbnail_url?: string | null
          category?: string
          alt_text?: string | null
          steam_app_id?: number | null
          width?: number | null
          height?: number | null
          file_size?: number | null
          is_featured?: boolean
          display_order?: number
          usage_context?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          storage_path?: string | null
          mime_type?: string | null
          thumbnail_url?: string | null
          category?: string
          alt_text?: string | null
          steam_app_id?: number | null
          width?: number | null
          height?: number | null
          file_size?: number | null
          is_featured?: boolean
          display_order?: number
          usage_context?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          platform: string | null
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
          platform?: string | null
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
          platform?: string | null
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
          id: string
          kick_stream_id: string
          external_stream_id: string | null
          title: string
          slug: string | null
          category: string
          language: string
          thumbnail: string | null
          started_at: string
          ended_at: string
          duration_seconds: number
          average_viewers: number | null
          peak_viewers: number | null
          total_views: number
          followers_gained: number
          status: string
          vod_url: string | null
          ended_reason: string | null
          stream_snapshot: Json | null
          snapshot_created_at: string | null
          stream_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kick_stream_id: string
          external_stream_id?: string | null
          title: string
          slug?: string | null
          category: string
          language?: string
          thumbnail?: string | null
          started_at: string
          ended_at: string
          duration_seconds?: number
          average_viewers?: number | null
          peak_viewers?: number | null
          total_views?: number
          followers_gained?: number
          status?: string
          vod_url?: string | null
          ended_reason?: string | null
          stream_snapshot?: Json | null
          snapshot_created_at?: string | null
          stream_number?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kick_stream_id?: string
          external_stream_id?: string | null
          title?: string
          slug?: string | null
          category?: string
          language?: string
          thumbnail?: string | null
          started_at?: string
          ended_at?: string
          duration_seconds?: number
          average_viewers?: number | null
          peak_viewers?: number | null
          total_views?: number
          followers_gained?: number
          status?: string
          vod_url?: string | null
          ended_reason?: string | null
          stream_snapshot?: Json | null
          snapshot_created_at?: string | null
          stream_number?: number
          created_at?: string
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
          thumbnail_url: string | null
          stream_url: string | null
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
          thumbnail_url?: string | null
          stream_url?: string | null
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
          thumbnail_url?: string | null
          stream_url?: string | null
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
      subscriber_history: {
        Row: {
          id: string
          timestamp: string
          active_count: number
          net_change: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          timestamp?: string
          active_count?: number
          net_change?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          timestamp?: string
          active_count?: number
          net_change?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          id: string
          stream_history_id: string | null
          username: string
          display_name: string | null
          content: string
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          stream_history_id?: string | null
          username: string
          display_name?: string | null
          content: string
          sent_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          stream_history_id?: string | null
          username?: string
          display_name?: string | null
          content?: string
          sent_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_stream_history_id_fkey"
            columns: ["stream_history_id"]
            isOneToOne: false
            referencedRelation: "stream_history"
            referencedColumns: ["id"]
          }
        ]
      }
      site_assets: {
        Row: {
          id: string
          logo_url: string | null
          favicon_url: string | null
          avatar_placeholder_url: string | null
          image_placeholder_url: string | null
          og_image_url: string | null
          avatar_url: string | null
          hero_banner_url: string | null
          logo_white_url: string | null
          logo_dark_url: string | null
          offline_cover_url: string | null
          default_thumbnail_url: string | null
          illustration_404_url: string | null
          white_logo_url: string | null
          dark_logo_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          logo_url?: string | null
          favicon_url?: string | null
          avatar_placeholder_url?: string | null
          image_placeholder_url?: string | null
          og_image_url?: string | null
          avatar_url?: string | null
          hero_banner_url?: string | null
          logo_white_url?: string | null
          logo_dark_url?: string | null
          offline_cover_url?: string | null
          default_thumbnail_url?: string | null
          illustration_404_url?: string | null
          white_logo_url?: string | null
          dark_logo_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          logo_url?: string | null
          favicon_url?: string | null
          avatar_placeholder_url?: string | null
          image_placeholder_url?: string | null
          og_image_url?: string | null
          avatar_url?: string | null
          hero_banner_url?: string | null
          logo_white_url?: string | null
          logo_dark_url?: string | null
          offline_cover_url?: string | null
          default_thumbnail_url?: string | null
          illustration_404_url?: string | null
          white_logo_url?: string | null
          dark_logo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }


    Views: {
      [_ in never]: never
    }
    Functions: {
      cast_poll_vote: {
        Args: {
          poll_id: string
          option_id: string
          fingerprint: string
          profile_id?: string | null
        }
        Returns: undefined
      }
      increment_suggestion_votes: {
        Args: { suggestion_id: string }
        Returns: undefined
      }
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
