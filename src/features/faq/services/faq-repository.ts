import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { FaqItem } from "../validators/faq-schemas";

export interface FaqRepository {
  getFAQItems(category: string): Promise<FaqItem[]>;
}

const STATIC_FAQS: FaqItem[] = [
  {
    id: "faq-g1",
    category: "general",
    question: "When does Zehragn stream?",
    answer: "Streams typically go live on Tuesday, Thursday, and Friday evenings starting at 20:00 (UTC+3). Weekend streams are more spontaneous — follow on Kick and enable notifications so you never miss a live stream.",
  },
  {
    id: "faq-g2",
    category: "general",
    question: "How did Zehragn get into streaming?",
    answer: "Zehragn started streaming in June 2021 as a hobby after playing competitive tactical games. The channel quickly shifted into a full-time passion as the ZehrArmy community grew rapidly.",
  },
  {
    id: "faq-b1",
    category: "broadcast",
    question: "What games are streamed?",
    answer: "The primary game is Valorant at a Radiant level. Occasionally, CS2, Apex Legends, and single-player narrative titles (horror/variety) are featured. The community votes on new game suggestions every two weeks.",
  },
  {
    id: "faq-b2",
    category: "broadcast",
    question: "What are the chat moderation guidelines?",
    answer: "We prioritize maintaining a welcoming and supportive environment. Basic rules: Be respectful, avoid backseating unless asked, no discrimination/harassment, and do not spam links. Our moderator team strictly enforces these guidelines.",
  },
  {
    id: "faq-s1",
    category: "setup",
    question: "What PC hardware specifications are utilized?",
    answer: "The streaming setup runs a dual-PC configuration. The gaming PC runs an AMD Ryzen 7950X, NVIDIA RTX 4090 GPU, and 64GB DDR5 RAM. The streaming PC is equipped with a Ryzen 7700X and an RTX 4070 for static AV1 encoding.",
  },
  {
    id: "faq-s2",
    category: "setup",
    question: "What monitor and peripherals are in use?",
    answer: "We use an ASUS ROG Swift PG27AQN (360Hz, 1440p) as the primary gaming display, paired with a Logitech G Pro X Superlight 2 mouse and a Wooting 60HE analog keyboard.",
  },
  {
    id: "faq-c1",
    category: "community",
    question: "How can I suggest games or stream ideas?",
    answer: "You can submit game ideas directly through the Community Hub page of this website. Our system allows you to submit games and upvote recommendations from others. The most upvoted suggestion is featured monthly.",
  },
  {
    id: "faq-c2",
    category: "community",
    question: "Is there a Discord server?",
    answer: "Yes! The official ZehrArmy Discord server is home to over 40,000 members. You can join via discord.gg/zehragn to interact with moderators, participate in events, and receive announcement alerts.",
  },
];

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

      const items = (data && data.length > 0)
        ? data.map((d) => ({
            id: d.id,
            category: (d.category || "general") as FaqItem["category"],
            question: d.question || "",
            answer: d.answer || "",
          }))
        : STATIC_FAQS;

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
