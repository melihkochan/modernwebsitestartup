import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSiteAssets, updateSiteAssets } from "../services/site-assets-service";
import type { SiteAssets } from "../types/media-types";

export function useSiteAssets() {
  return useQuery({
    queryKey: ["site-assets"],
    queryFn: getSiteAssets,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function useUpdateSiteAssets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<SiteAssets>) => updateSiteAssets(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-assets"] });
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}
