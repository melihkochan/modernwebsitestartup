import Link from "next/link";

/**
 * Custom 404 page — Not Found.
 *
 * Displayed when a route doesn't match any page.
 * Full branded design implementation: Sprint 2.
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-4)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <span
        style={{
          fontSize: "96px",
          fontFamily: "var(--font-outfit)",
          fontWeight: 800,
          color: "var(--text-tertiary)",
          lineHeight: 1,
        }}
      >
        404
      </span>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "var(--text-primary)",
          fontFamily: "var(--font-outfit)",
        }}
      >
        Page not found
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "var(--space-4)",
          color: "var(--accent-primary)",
          fontSize: "14px",
          textDecoration: "none",
        }}
      >
        ← Back to home
      </Link>
    </main>
  );
}
