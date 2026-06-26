import { useQuery } from "@tanstack/react-query";
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
