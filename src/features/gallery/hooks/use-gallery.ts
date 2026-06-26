import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { galleryRepository } from "../services/gallery-repository";

/**
 * Hook to retrieve gallery items by category.
 */
export function useGalleryItems(category: string) {
  return useQuery({
    queryKey: queryKeys.gallery.items(category),
    queryFn: () => galleryRepository.getItems(category),
    staleTime: 10 * 60 * 1000, // 10 minutes (static content)
  });
}
