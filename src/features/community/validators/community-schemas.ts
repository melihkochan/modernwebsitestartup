import { z } from "zod";

export const gameSuggestionSchema = z.object({
  id: z.string(),
  game: z.string().min(1, "Game title is required"),
  votes: z.number().int().nonnegative(),
  submittedBy: z.string(),
  platform: z.string(),
  description: z.string().min(1, "Description is required"),
  isUpvoted: z.boolean().optional(),
  steamAppId: z.number().nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
});

export const pollOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  votes: z.number().int().nonnegative(),
});

export const pollSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(pollOptionSchema),
  totalVotes: z.number().int().nonnegative(),
  endsIn: z.string(),
});

export type GameSuggestion = z.infer<typeof gameSuggestionSchema>;
export type PollOption = z.infer<typeof pollOptionSchema>;
export type Poll = z.infer<typeof pollSchema>;
