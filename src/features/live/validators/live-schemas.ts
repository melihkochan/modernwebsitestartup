import { z } from "zod";

export const streamInfoSchema = z.object({
  isLive: z.boolean(),
  viewerCount: z.number().int().nonnegative(),
  currentGame: z.string().nullable(),
  streamTitle: z.string().nullable(),
  startedAt: z.string().nullable(),
  thumbnailUrl: z.string().nullable().optional(),
});

export const scheduleItemSchema = z.object({
  day: z.string(),
  time: z.string(),
  game: z.string(),
  platform: z.string(),
});

export type StreamInfo = z.infer<typeof streamInfoSchema>;
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;
