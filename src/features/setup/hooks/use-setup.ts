import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { setupRepository } from "../services/setup-repository";

/**
 * Hook to retrieve setup products by category.
 */
export function useSetupProducts(category: string) {
  return useQuery({
    queryKey: queryKeys.setup.products(category),
    queryFn: () => setupRepository.getProducts(category),
    staleTime: 10 * 60 * 1000, // 10 minutes (static setup gear)
  });
}
