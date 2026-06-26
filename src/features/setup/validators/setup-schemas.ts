import { z } from "zod";

export const specSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const setupProductSchema = z.object({
  id: z.string(),
  category: z.enum(["pc", "peripherals", "audio", "comfort"]),
  name: z.string(),
  brand: z.string(),
  desc: z.string(),
  rating: z.number().min(0).max(5),
  specs: z.array(specSchema),
  gradient: z.string(),
  url: z.string(),
  highlight: z.boolean().optional(),
});

export type SetupProduct = z.infer<typeof setupProductSchema>;
