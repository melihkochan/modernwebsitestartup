import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { GalleryItem } from "../validators/gallery-schemas";

// ---------------------------------------------------------------------------
// Repository Arayüzü
// ---------------------------------------------------------------------------

export interface GalleryRepository {
  getItems(category: string): Promise<GalleryItem[]>;
  getFeaturedItems(): Promise<GalleryItem[]>;
}

// ---------------------------------------------------------------------------
// Supabase veri satırı → GalleryItem dönüşüm yardımcısı
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToGalleryItem(row: Record<string, any>): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url ?? null,
    category: row.category ?? "diger",
    altText: row.alt_text ?? null,
    steamAppId: row.steam_app_id ?? null,
    width: row.width ?? null,
    height: row.height ?? null,
    fileSize: row.file_size ?? null,
    isFeatured: row.is_featured ?? false,
    orderIndex: row.order_index ?? 0,
    usageContext: row.usage_context ?? "kullanilmiyor",
    createdAt: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// Supabase Implementasyonu — Tek gerçek kaynak
// ---------------------------------------------------------------------------

const supabaseGalleryRepository: GalleryRepository = {
  async getItems(category: string): Promise<GalleryItem[]> {
    const supabase = createClient();

    try {
      let query = supabase
        .from("gallery")
        .select(
          "id, title, description, image_url, thumbnail_url, category, alt_text, steam_app_id, width, height, file_size, is_featured, order_index, usage_context, created_at"
        )
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      // "hepsi" veya "all" değilse kategori filtresi uygula
      if (category && category !== "hepsi" && category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        throw new RepositoryError(error.message, "FETCH_GALLERY_FAILED", error);
      }

      if (!data || data.length === 0) return [];

      return data.map(rowToGalleryItem);
    } catch (err: unknown) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        "Galeri öğeleri alınamadı",
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
          "id, title, description, image_url, thumbnail_url, category, alt_text, steam_app_id, width, height, file_size, is_featured, order_index, usage_context, created_at"
        )
        .eq("is_featured", true)
        .order("order_index", { ascending: true })
        .limit(6);

      if (error) {
        throw new RepositoryError(error.message, "FETCH_FEATURED_GALLERY_FAILED", error);
      }

      if (!data) return [];

      return data.map(rowToGalleryItem);
    } catch (err: unknown) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        "Öne çıkan galeri öğeleri alınamadı",
        "FETCH_FEATURED_GALLERY_FAILED",
        err
      );
    }
  },
};

// ---------------------------------------------------------------------------
// Tekil Dışa Aktarma
// ---------------------------------------------------------------------------

export const galleryRepository: GalleryRepository = supabaseGalleryRepository;
