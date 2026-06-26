import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { timelineRepository } from "../services/timeline-repository";

/**
 * Hook to retrieve timeline milestones by year.
 */
export function useTimelineMilestones(year: string) {
  return useQuery({
    queryKey: queryKeys.timeline.milestones(year),
    queryFn: () => timelineRepository.getMilestones(year),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
