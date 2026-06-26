import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clips",
  description: "Watch the best Zehragn stream clips — featured highlights, funny moments, and top plays.",
};

/** /clips — Sprint 1 placeholder. Full implementation: Sprint 2. */
export default function ClipsPage() {
  return (
    <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}>
        /clips — Placeholder
      </p>
    </main>
  );
}
