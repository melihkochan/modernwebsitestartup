import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { faqRepository } from "../services/faq-repository";

/**
 * Hook to retrieve FAQ items by category.
 */
export function useFaqItems(category: string) {
  return useQuery({
    queryKey: queryKeys.faq.items(category),
    queryFn: () => faqRepository.getFAQItems(category),
    staleTime: 10 * 60 * 1000, // 10 minutes (static content)
  });
}
