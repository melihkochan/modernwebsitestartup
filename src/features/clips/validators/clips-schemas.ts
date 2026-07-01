import { z } from "zod";

export const ClipSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Klip başlığı gereklidir."),
  description: z.string().nullable().optional(),
  duration: z.number().min(0, "Süre negatif olamaz."),
  videoUrl: z.string().url("Geçerli bir video URL'i girilmelidir."),
  thumbnailUrl: z.string().url("Geçerli bir küçük resim URL'i girilmelidir."),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  category: z.string().nullable().optional(),
  game: z.string().nullable().optional(),
  visibility: z.string().default("public"),
  views: z.number().int().default(0),
  likes: z.number().int().default(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Clip = z.infer<typeof ClipSchema>;
