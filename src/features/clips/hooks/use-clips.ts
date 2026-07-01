import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { clipsRepository } from "../services/clips-repository";
import type { Clip } from "../validators/clips-schemas";

export function useClips() {
  return useQuery({
    queryKey: queryKeys.clips.list(),
    queryFn: () => clipsRepository.getClips(),
  });
}

export function useFeaturedClip() {
  return useQuery({
    queryKey: queryKeys.clips.featured(),
    queryFn: () => clipsRepository.getFeaturedClip(),
  });
}

export function useCreateClip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clip: Omit<Clip, "id" | "views" | "likes">) =>
      clipsRepository.createClip(clip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clips.all });
    },
  });
}

export function useDeleteClip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clipsRepository.deleteClip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clips.all });
    },
  });
}
