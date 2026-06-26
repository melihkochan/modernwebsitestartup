"use client";

/**
 * Global error boundary — catches unhandled runtime errors.
 *
 * Must be a Client Component (Next.js requirement).
 * Full branded error UI implementation: Sprint 2.
 */
interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="tr" data-theme="dark">
      <body
        style={{
          backgroundColor: "var(--bg-base)",
          color: "var(--text-primary)",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
        }}
      >
        <span style={{ fontSize: "72px", lineHeight: 1 }}>⚠️</span>
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ color: "#888", fontSize: "14px" }}>
          {process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p style={{ color: "#555", fontSize: "12px", fontFamily: "monospace" }}>
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: "8px",
            padding: "8px 20px",
            border: "1px solid #383838",
            borderRadius: "10px",
            background: "transparent",
            color: "#ededed",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
