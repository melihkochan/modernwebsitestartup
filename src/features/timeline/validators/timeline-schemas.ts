import { z } from "zod";

export const eventStatSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const timelineEventSchema = z.object({
  id: z.string(),
  year: z.string(),
  date: z.string(),
  title: z.string(),
  category: z.enum(["milestone", "career", "esports", "charity"]),
  description: z.string(),
  extendedDetails: z.string(),
  stats: z.array(eventStatSchema),
  highlight: z.boolean().optional(),
});

export type TimelineEvent = z.infer<typeof timelineEventSchema>;
