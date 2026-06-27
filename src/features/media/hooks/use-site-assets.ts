import { useQuery } from "@tanstack/react-query";
import { getSiteAssets } from "../services/site-assets-service";

/**
 * site_assets tablosundan site varlıklarını React Query ile çeker.
 * Logo, favicon, placeholder URL'leri erişim için kullanılır.
 */
export function useSiteAssets() {
  return useQuery({
    queryKey: ["site-assets"],
    queryFn: getSiteAssets,
    staleTime: 10 * 60 * 1000, // 10 dakika (statik içerik)
    retry: 1,
  });
}
