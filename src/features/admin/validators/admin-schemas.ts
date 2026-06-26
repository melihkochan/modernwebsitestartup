import { z } from "zod";

export const systemLogSchema = z.object({
  id: z.string(),
  time: z.string(),
  type: z.enum(["info", "success", "warn", "error"]),
  message: z.string(),
});

export const systemVitalsSchema = z.object({
  cpuUsage: z.number().min(0).max(100),
  memoryUsage: z.number().min(0).max(100),
  gpuTemp: z.number().min(0).max(120),
  bitrate: z.number().nonnegative(),
  viewerCount: z.number().int().nonnegative(),
});

export const recentSuggestionSchema = z.object({
  id: z.string(),
  game: z.string(),
  votes: z.number().int().nonnegative(),
  submitter: z.string(),
});

export type SystemLog = z.infer<typeof systemLogSchema>;
export type SystemVitals = z.infer<typeof systemVitalsSchema>;
export type RecentSuggestion = z.infer<typeof recentSuggestionSchema>;
