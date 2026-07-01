import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import { getStorageUrl } from "@/lib/supabase/storage";
import type { GalleryItem } from "../validators/gallery-schemas";

export interface GalleryRepository {
  getItems(category: string): Promise<GalleryItem[]>;
  getFeaturedItems(): Promise<GalleryItem[]>;
}

function rowToGalleryItem(row: Record<string, any>): GalleryItem {
  const rawPath = row.storage_path || "";
  const storagePath = rawPath.startsWith("gallery/") ? rawPath : `gallery/${rawPath}`;
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    imageUrl: getStorageUrl(storagePath),
    thumbnailUrl: row.thumbnail_url ? getStorageUrl(row.thumbnail_url) : null,
    category: row.category ?? "diger",
    altText: row.alt_text ?? null,
    steamAppId: row.steam_app_id ?? null,
    width: row.width ?? null,
    height: row.height ?? null,
    fileSize: row.file_size ?? null,
    isFeatured: row.is_featured ?? false,
    orderIndex: row.display_order ?? 0,
    usageContext: row.usage_context ?? "kullanilmiyor",
    createdAt: row.created_at,
  };
}

const supabaseGalleryRepository: GalleryRepository = {
  async getItems(category: string): Promise<GalleryItem[]> {
    const supabase = createClient();

    try {
      let query = supabase
        .from("gallery")
        .select(
          "id, title, description, storage_path, thumbnail_url, category, alt_text, steam_app_id, width, height, file_size, is_featured, display_order, usage_context, created_at"
        )
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      // "hepsi" veya "all" değilse kategori filtresi uygula
      if (category && category !== "hepsi" && category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        throw new RepositoryError(
          `[GalleryRepository] [gallery] [SELECT] [id, title, description, storage_path, category, display_order] - ${error.message}`,
          "FETCH_GALLERY_FAILED",
          error
        );
      }

      if (!data || data.length === 0) return [];

      return data.map(rowToGalleryItem);
    } catch (err: unknown) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[GalleryRepository] [gallery] [SELECT] - Failed to get gallery items`,
        "FETCH_GALLERY_FAILED",
        err
      );
    }
  },

  async getFeaturedItems(): Promise<GalleryItem[]> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("gallery")
        .select(
          "id, title, description, storage_path, thumbnail_url, category, alt_text, steam_app_id, width, height, file_size, is_featured, display_order, usage_context, created_at"
        )
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        throw new RepositoryError(
          `[GalleryRepository] [gallery] [SELECT] [id, title, description, storage_path, category, display_order, is_featured] - ${error.message}`,
          "FETCH_FEATURED_GALLERY_FAILED",
          error
        );
      }

      if (!data) return [];

      return data.map(rowToGalleryItem);
    } catch (err: unknown) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[GalleryRepository] [gallery] [SELECT] - Failed to get featured gallery items`,
        "FETCH_FEATURED_GALLERY_FAILED",
        err
      );
    }
  },
};

export const galleryRepository: GalleryRepository = supabaseGalleryRepository;
