import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { TimelineEvent } from "../validators/timeline-schemas";

export interface TimelineRepository {
  getMilestones(year: string): Promise<TimelineEvent[]>;
}

export const timelineRepository: TimelineRepository = {
  async getMilestones(year: string): Promise<TimelineEvent[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("timeline")
        .select("*")
        .order("event_date", { ascending: false });

      if (error) {
        throw new RepositoryError(
          `[TimelineRepository] [timeline] [SELECT] [event_date, title, description, category] - ${error.message}`,
          "FETCH_TIMELINE_FAILED",
          error
        );
      }
      if (!data) return [];

      const mapped: TimelineEvent[] = data.map((d) => {
        const dateObj = d.event_date ? new Date(d.event_date) : new Date();
        const evYear = dateObj.getFullYear().toString();
        const formattedDate = dateObj.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

        const validCategories = ["milestone", "career", "esports", "charity"] as const;
        const dCat = d.category || "milestone";
        const category = validCategories.includes(dCat as any)
          ? (dCat as "milestone" | "career" | "esports" | "charity")
          : "milestone";

        return {
          id: d.id,
          year: evYear,
          date: formattedDate,
          title: d.title || "Yeni Kilometre Taşı",
          category,
          description: d.description || "",
          extendedDetails: d.description || "",
          stats: [] as Array<{ label: string; value: string }>,
          highlight: false,
        };
      });

      if (year === "all") {
        return mapped;
      }
      return mapped.filter((e) => e.year === year);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError(
        `[TimelineRepository] [timeline] [SELECT] - Failed to retrieve milestones`,
        "FETCH_TIMELINE_FAILED",
        err
      );
    }
  },
};
