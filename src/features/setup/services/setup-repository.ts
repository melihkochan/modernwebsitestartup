import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { SetupProduct } from "../validators/setup-schemas";

export interface SetupRepository {
  getProducts(category: string): Promise<SetupProduct[]>;
}

export const setupRepository: SetupRepository = {
  async getProducts(category: string): Promise<SetupProduct[]> {
    const supabase = createClient();
    try {
      let query = supabase
        .from("setup_items")
        .select("*")
        .eq("is_visible", true)
        .eq("is_archived", false)
        .order("display_order", { ascending: true });

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        throw new RepositoryError(
          `[SetupRepository] [setup_items] [SELECT] [category: ${category}] - ${error.message}`,
          "FETCH_SETUP_FAILED",
          error
        );
      }
      return data || [];
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[SetupRepository] Failed to retrieve setup items`,
        "FETCH_SETUP_FAILED",
        err
      );
    }
  },
};
