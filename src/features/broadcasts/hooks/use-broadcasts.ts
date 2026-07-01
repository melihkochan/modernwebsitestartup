import { useQuery } from "@tanstack/react-query";
import { broadcastRepository, BroadcastsFilter } from "../services/broadcast-repository";

export function useRecentBroadcasts(limit = 4) {
  return useQuery({
    queryKey: ["broadcasts", "recent", limit],
    queryFn: () => broadcastRepository.getRecentBroadcasts(limit),
    staleTime: 60 * 1000, // 1 minute stale time
  });
}

export function useBroadcasts(filter: BroadcastsFilter) {
  return useQuery({
    queryKey: ["broadcasts", "list", filter],
    queryFn: () => broadcastRepository.getBroadcasts(filter),
    staleTime: 60 * 1000,
  });
}
