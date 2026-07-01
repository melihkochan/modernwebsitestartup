/**
 * Media Feature — TypeScript Tip Tanımları
 * Sprint 11: Supabase Storage tabanlı medya altyapısı
 */

// ---------------------------------------------------------------------------
// Bucket Sabitleri
// ---------------------------------------------------------------------------

export const MEDIA_BUCKETS = {
  AVATARS: "avatars",
  GALLERY: "gallery",
  THUMBNAILS: "thumbnails",
} as const;

export type MediaBucket = (typeof MEDIA_BUCKETS)[keyof typeof MEDIA_BUCKETS];

// ---------------------------------------------------------------------------
// Galeri Kategorileri (Türkçe)
// ---------------------------------------------------------------------------

export const GALLERY_CATEGORIES = {
  YAYIN: "yayin",
  IRL: "irl",
  ETKINLIK: "etkinlik",
  HAYRAN_SANATI: "hayran-sanati",
  DIGER: "diger",
} as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[keyof typeof GALLERY_CATEGORIES];

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory | "hepsi", string> = {
  hepsi: "Tümü",
  yayin: "Yayın",
  irl: "IRL",
  etkinlik: "Etkinlik",
  "hayran-sanati": "Hayran Sanatı",
  diger: "Diğer",
};

// ---------------------------------------------------------------------------
// Kullanım Bağlamı
// ---------------------------------------------------------------------------

export const USAGE_CONTEXTS = {
  GALERI: "galeri",
  ANA_SAYFA: "ana-sayfa",
  HABER: "haber",
  KULLANILMIYOR: "kullanilmiyor",
} as const;

export type UsageContext = (typeof USAGE_CONTEXTS)[keyof typeof USAGE_CONTEXTS];

export const USAGE_CONTEXT_LABELS: Record<UsageContext, string> = {
  galeri: "Galeri",
  "ana-sayfa": "Ana Sayfa",
  haber: "Haber",
  kullanilmiyor: "Kullanılmıyor",
};

// ---------------------------------------------------------------------------
// Dosya Boyutu Limitleri
// ---------------------------------------------------------------------------

export const FILE_SIZE_LIMITS = {
  IMAGE: 50 * 1024 * 1024,   // 50 MB
  VIDEO: 250 * 1024 * 1024,  // 250 MB
  THUMBNAIL: 5 * 1024 * 1024, // 5 MB
  AVATAR: 5 * 1024 * 1024,   // 5 MB
} as const;

// ---------------------------------------------------------------------------
// Desteklenen MIME Tipleri
// ---------------------------------------------------------------------------

export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export type AllowedVideoType = (typeof ALLOWED_VIDEO_TYPES)[number];

export const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES] as const;
export type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

// ---------------------------------------------------------------------------
// Medya Dosyası Arayüzü
// ---------------------------------------------------------------------------

/** Storage'daki bir medya dosyasını temsil eder */
export interface MediaFile {
  /** Storage path (bucket dahil değil — sadece dosya yolu) */
  path: string;
  /** Sadece dosya adı */
  name: string;
  /** Bayt cinsinden dosya boyutu */
  size: number;
  /** MIME type */
  mimeType: string;
  /** Supabase Storage public URL */
  publicUrl: string;
  /** Oluşturulma tarihi (ISO string) */
  createdAt: string;
  /** Son güncelleme tarihi */
  updatedAt: string;
  /** Bucket adı */
  bucket: MediaBucket;
  /** Resim ise piksel genişliği */
  width?: number;
  /** Resim ise piksel yüksekliği */
  height?: number;
}

// ---------------------------------------------------------------------------
// Yükleme Sonucu
// ---------------------------------------------------------------------------

export interface UploadResult {
  success: boolean;
  path: string;
  publicUrl: string;
  fileName: string;
  /** Bayt cinsinden yüklenen dosyanın boyutu */
  size: number;
  /** Resim boyutları (otomatik okunur) */
  width?: number;
  height?: number;
  error?: string;
}

// ---------------------------------------------------------------------------
// Yükleme İlerleme Durumu
// ---------------------------------------------------------------------------

export interface UploadProgress {
  fileName: string;
  status: "bekliyor" | "yukleniyor" | "tamamlandi" | "hata";
  progress: number; // 0-100
  error?: string;
  result?: UploadResult;
}

// ---------------------------------------------------------------------------
// Site Varlıkları
// ---------------------------------------------------------------------------

export interface SiteAssets {
  logoUrl: string | null;
  faviconUrl: string | null;
  avatarPlaceholderUrl: string | null;
  imagePlaceholderUrl: string | null;
  ogImageUrl: string | null;
  avatarUrl: string | null;
  heroBannerUrl: string | null;
  whiteLogoUrl: string | null;
  darkLogoUrl: string | null;
  offlineCoverUrl: string | null;
  defaultThumbnailUrl: string | null;
  illustration404Url: string | null;
}

// ---------------------------------------------------------------------------
// Galeri Öğesi (veritabanından)
// ---------------------------------------------------------------------------

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: string;
  altText: string | null;
  steamAppId: number | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  isFeatured: boolean;
  orderIndex: number;
  usageContext: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Medya Kütüphanesi Görünüm Modu
// ---------------------------------------------------------------------------

export type MediaViewMode = "grid" | "list";

// ---------------------------------------------------------------------------
// Kopya Biçimleri (geliştirici deneyimi)
// ---------------------------------------------------------------------------

export type CopyFormat = "url" | "markdown" | "html" | "nextimage";
