import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { communityRepository } from "../services/community-repository";
import type { GameSuggestion } from "../validators/community-schemas";

/**
 * Hook to retrieve all community game suggestions.
 */
export function useSuggestions() {
  return useQuery({
    queryKey: queryKeys.community.suggestions(),
    queryFn: () => communityRepository.getSuggestions(),
  });
}

/**
 * Hook to submit a new game suggestion.
 */
export function useSuggestGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (game: Omit<GameSuggestion, "id" | "votes" | "isUpvoted">) =>
      communityRepository.suggestGame(game),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.suggestions() });
    },
  });
}

/**
 * Hook to upvote an existing game suggestion.
 */
export function useUpvoteSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityRepository.upvoteSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.suggestions() });
    },
  });
}




