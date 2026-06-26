import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Zehragn — sponsorship inquiries, collaborations, and press.",
};

/** /contact — Sprint 1 placeholder. Full implementation: Sprint 2. */
export default function ContactPage() {
  return (
    <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}>
        /contact — Placeholder
      </p>
    </main>
  );
}
