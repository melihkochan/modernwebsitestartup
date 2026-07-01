import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { FaqItem } from "../validators/faq-schemas";

export interface FaqRepository {
  getFAQItems(category: string): Promise<FaqItem[]>;
}

export const faqRepository: FaqRepository = {
  async getFAQItems(category: string): Promise<FaqItem[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("faq")
        .select("id, category, question, answer")
        .order("order_weight", { ascending: true });

      if (error) {
        throw new RepositoryError(
          `[FaqRepository] [faq] [SELECT] [id, category, question, answer] - ${error.message}`,
          "FETCH_FAQ_FAILED",
          error
        );
      }

      const items = (data || []).map((d) => ({
        id: d.id,
        category: (d.category || "general") as FaqItem["category"],
        question: d.question || "",
        answer: d.answer || "",
      }));

      if (category === "all") {
        return items;
      }
      return items.filter((faq) => faq.category === category);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[FaqRepository] [faq] [SELECT] - Failed to fetch FAQ items`,
        "FETCH_FAQ_FAILED",
        err
      );
    }
  },
};
