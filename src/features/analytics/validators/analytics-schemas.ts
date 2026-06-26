import { z } from "zod";

export const metricSchema = z.object({
  label: z.string(),
  value: z.number().nonnegative(),
  change: z.string(),
  isPositive: z.boolean(),
  textColor: z.string().optional(),
  glowColor: z.string().optional(),
});

export const trendItemSchema = z.object({
  name: z.string(),
  viewers: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  hours: z.number().nonnegative(),
});

export type AnalyticsMetric = z.infer<typeof metricSchema>;
export type AnalyticsTrendItem = z.infer<typeof trendItemSchema>;
