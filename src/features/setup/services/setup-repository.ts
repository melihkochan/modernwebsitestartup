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
      const { data, error } = await supabase
        .from("setup_items")
        .select(`
          id,
          name,
          brand,
          model,
          image_url,
          affiliate_url,
          personal_note,
          category:setup_categories!inner (
            name
          )
        `);

      if (error) {
        throw new RepositoryError(
          `[SetupRepository] [setup_items] [SELECT] [id, name, brand, model, image_url, affiliate_url, personal_note] - ${error.message}`,
          "FETCH_SETUP_FAILED",
          error
        );
      }
      if (!data) return [];

      const mapped: SetupProduct[] = data.map((d, index) => {
        const catName = (d as any).category?.name || "other";
        
        // Dynamic gradients for varied premium cards look
        const gradients = [
          "linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)",
          "linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)",
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          "linear-gradient(135deg, #2d0f5e 0%, #1a0533 100%)",
          "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
        ];
        const gradient = gradients[index % gradients.length];

        return {
          id: d.id,
          category: catName.toLowerCase(),
          name: d.name || `${d.brand} ${d.model}`,
          brand: d.brand || "",
          desc: d.personal_note || "",
          rating: 4.8, // safe fallback
          specs: [], // safe fallback
          gradient: gradient,
          url: d.affiliate_url || "",
          highlight: index % 3 === 0, // safe fallback highlights every 3rd item
        };
      });

      if (category === "all") {
        return mapped;
      }
      return mapped.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[SetupRepository] [setup_items] [SELECT] - Failed to retrieve setup items`,
        "FETCH_SETUP_FAILED",
        err
      );
    }
  },
};
