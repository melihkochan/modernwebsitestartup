import { z } from "zod";

export const faqItemSchema = z.object({
  id: z.string(),
  category: z.enum(["general", "broadcast", "setup", "community"]),
  question: z.string(),
  answer: z.string(),
});

export type FaqItem = z.infer<typeof faqItemSchema>;
