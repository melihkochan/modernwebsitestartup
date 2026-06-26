import { z } from "zod";

export const galleryItemSchema = z.object({
  id: z.string(),
  category: z.enum(["all", "setups", "irl", "highlights", "fanart"]),
  aspect: z.enum(["landscape", "portrait", "square"]),
  gradient: z.string(),
  label: z.string(),
  date: z.string(),
  details: z.string(),
});

export type GalleryItem = z.infer<typeof galleryItemSchema>;
