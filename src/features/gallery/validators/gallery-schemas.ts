import { z } from "zod";

// ---------------------------------------------------------------------------
// Galeri Kategorileri (Türkçe)
// ---------------------------------------------------------------------------

export const galleryCategorySchema = z.enum([
  "hepsi",
  "yayin",
  "irl",
  "etkinlik",
  "hayran-sanati",
  "diger",
]);

export type GalleryCategory = z.infer<typeof galleryCategorySchema>;

// ---------------------------------------------------------------------------
// Galeri Öğesi Şeması (veritabanından)
// ---------------------------------------------------------------------------

export const galleryItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().nullable(),
  category: z.string(),
  altText: z.string().nullable(),
  steamAppId: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  fileSize: z.number().nullable(),
  isFeatured: z.boolean(),
  orderIndex: z.number(),
  usageContext: z.string(),
  createdAt: z.string(),
});

export type GalleryItem = z.infer<typeof galleryItemSchema>;

// ---------------------------------------------------------------------------
// Yeni Galeri Öğesi Ekleme Şeması
// ---------------------------------------------------------------------------

export const createGalleryItemSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur").max(200),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url("Geçerli bir URL giriniz"),
  thumbnailUrl: z.string().url().nullable().optional(),
  category: z.string().default("diger"),
  altText: z.string().max(300).nullable().optional(),
  steamAppId: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  fileSize: z.number().nullable().optional(),
  isFeatured: z.boolean().default(false),
  orderIndex: z.number().default(0),
  usageContext: z.string().default("kullanilmiyor"),
});

export type CreateGalleryItem = z.infer<typeof createGalleryItemSchema>;
