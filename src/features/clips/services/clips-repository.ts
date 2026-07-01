import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { Clip } from "../validators/clips-schemas";

export interface ClipsRepository {
  getClips(): Promise<Clip[]>;
  getFeaturedClip(): Promise<Clip | null>;
  createClip(clip: Omit<Clip, "id" | "views" | "likes">): Promise<Clip>;
  deleteClip(id: string): Promise<void>;
}

export const clipsRepository: ClipsRepository = {
  async getClips(): Promise<Clip[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("clips")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw new RepositoryError(error.message, "FETCH_CLIPS_FAILED", error);
      if (!data) return [];

      return data.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        duration: Number(d.duration),
        videoUrl: d.video_url,
        thumbnailUrl: d.thumbnail_url,
        isFeatured: d.is_featured ?? false,
        displayOrder: d.display_order ?? 0,
        category: d.category,
        game: d.game,
        visibility: d.visibility ?? "public",
        views: d.views ?? d.view_count ?? 0,
        likes: d.likes ?? 0,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch clips", "FETCH_CLIPS_FAILED", err);
    }
  },

  async getFeaturedClip(): Promise<Clip | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("clips")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw new RepositoryError(error.message, "FETCH_FEATURED_CLIP_FAILED", error);
      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        duration: Number(data.duration),
        videoUrl: data.video_url,
        thumbnailUrl: data.thumbnail_url,
        isFeatured: data.is_featured ?? false,
        displayOrder: data.display_order ?? 0,
        category: data.category,
        game: data.game,
        visibility: data.visibility ?? "public",
        views: data.views ?? data.view_count ?? 0,
        likes: data.likes ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch featured clip", "FETCH_FEATURED_CLIP_FAILED", err);
    }
  },

  async createClip(clip: Omit<Clip, "id" | "views" | "likes">): Promise<Clip> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("clips")
        .insert({
          title: clip.title,
          description: clip.description,
          duration: clip.duration,
          video_url: clip.videoUrl,
          thumbnail_url: clip.thumbnailUrl,
          is_featured: clip.isFeatured,
          display_order: clip.displayOrder,
          category: clip.category,
          game: clip.game,
          visibility: clip.visibility,
          view_count: 0,
          views: 0,
          likes: 0,
          kick_clip_id: null,
          created_by: null,
        })
        .select()
        .single();

      if (error) throw new RepositoryError(error.message, "CREATE_CLIP_FAILED", error);
      if (!data) throw new RepositoryError("No data returned from insert", "CREATE_CLIP_FAILED");

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        duration: Number(data.duration),
        videoUrl: data.video_url,
        thumbnailUrl: data.thumbnail_url,
        isFeatured: data.is_featured ?? false,
        displayOrder: data.display_order ?? 0,
        category: data.category,
        game: data.game,
        visibility: data.visibility ?? "public",
        views: data.views ?? data.view_count ?? 0,
        likes: data.likes ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to create clip", "CREATE_CLIP_FAILED", err);
    }
  },

  async deleteClip(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("clips")
        .delete()
        .eq("id", id);

      if (error) throw new RepositoryError(error.message, "DELETE_CLIP_FAILED", error);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to delete clip", "DELETE_CLIP_FAILED", err);
    }
  },
};
