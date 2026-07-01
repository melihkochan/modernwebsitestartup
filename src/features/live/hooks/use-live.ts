import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { liveRepository } from "../services/live-repository";

/**
 * Hook to retrieve current stream info status.
 * Automatically polls every 30 seconds to keep live indicator accurate.
 */
export function useStreamInfo() {
  return useQuery({
    queryKey: queryKeys.live.streamInfo(),
    queryFn: () => liveRepository.getStreamInfo(),
    refetchInterval: 15000,
  });
}

/**
 * Hook to retrieve upcoming weekly schedule.
 */
export function useSchedule() {
  return useQuery({
    queryKey: queryKeys.live.schedule(),
    queryFn: () => liveRepository.getSchedule(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
