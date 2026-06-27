import { useQuery } from "@tanstack/react-query";
import { galleryRepository } from "../services/gallery-repository";

/**
 * Kategoriye göre galeri öğelerini çeker.
 * "hepsi" kategorisi tüm öğeleri getirir.
 */
export function useGalleryItems(category: string) {
  return useQuery({
    queryKey: ["gallery", "items", category],
    queryFn: () => galleryRepository.getItems(category),
    staleTime: 10 * 60 * 1000, // 10 dakika (statik içerik)
  });
}

/**
 * Öne çıkan (is_featured = true) galeri öğelerini çeker.
 * Ana sayfa galeri preview bölümünde kullanılır.
 */
export function useFeaturedGalleryItems() {
  return useQuery({
    queryKey: ["gallery", "featured"],
    queryFn: () => galleryRepository.getFeaturedItems(),
    staleTime: 10 * 60 * 1000,
  });
}
