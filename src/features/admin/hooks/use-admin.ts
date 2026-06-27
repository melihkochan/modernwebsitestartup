import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminRepository } from "../services/admin-repository";

/**
 * Hook to retrieve all game suggestions with Steam details.
 */
export function useAdminSuggestions() {
  return useQuery({
    queryKey: ["admin", "suggestions"],
    queryFn: () => adminRepository.getSuggestions(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

/**
 * Hook to approve a community suggestion.
 */
export function useApproveSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminRepository.approveSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
}

/**
 * Hook to delete a community suggestion.
 */
export function useDeleteSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminRepository.deleteSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
}

/**
 * Hook to retrieve the stream history catalog.
 */
export function useStreamHistory() {
  return useQuery({
    queryKey: ["admin", "stream-history"],
    queryFn: () => adminRepository.getStreamHistory(),
  });
}

/**
 * Hook to retrieve the current Creator Sync Status from the settings table.
 */
export function useCreatorSyncStatus() {
  return useQuery({
    queryKey: ["admin", "creator-sync-status"],
    queryFn: () => adminRepository.getSyncStatus(),
    refetchInterval: 10000, // Poll status every 10 seconds
  });
}

/**
 * Hook to trigger a manual creator synchronization execution.
 */
export function useTriggerCreatorSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminRepository.triggerSync(),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "creator-sync-status"], data);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["live"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

/**
 * Hook to retrieve aggregated publisher channel statistics.
 */
export function useCreatorStats() {
  return useQuery({
    queryKey: ["admin", "creator-stats"],
    queryFn: () => adminRepository.getCreatorStats(),
    refetchInterval: 15000, // Poll every 15 seconds
  });
}

