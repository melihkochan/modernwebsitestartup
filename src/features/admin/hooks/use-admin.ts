import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { adminRepository } from "../services/admin-repository";

/**
 * Hook to retrieve live system logs for the dashboard output panel.
 */
export function useSystemLogs() {
  return useQuery({
    queryKey: queryKeys.admin.logs(),
    queryFn: () => adminRepository.getSystemLogs(),
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

/**
 * Hook to retrieve streaming system vitals (bitrate, fps, cpu, memory, dropping frames).
 * Polls more frequently to keep admin metrics reactive.
 */
export function useSystemVitals() {
  return useQuery({
    queryKey: queryKeys.admin.vitals(),
    queryFn: () => adminRepository.getVitals(),
    refetchInterval: 2000, // Refresh every 2 seconds for vital system stats
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
      // Direct updates and cache invalidation
      queryClient.setQueryData(["admin", "creator-sync-status"], data);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["live"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

