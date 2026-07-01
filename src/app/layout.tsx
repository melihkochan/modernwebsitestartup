import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import { Providers } from "@/providers";
import { getSiteSettingsServer } from "@/lib/supabase/settings-server";
import "@/styles/globals.css";

// ---------------------------------------------------------------------------
// Font Configuration — Architecture Document Section 9.4
// Display/Heading font: Outfit (700-800 weight)
// Body font: Inter (400-600 weight)
// ---------------------------------------------------------------------------

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

// ---------------------------------------------------------------------------
// Dynamic Site Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  const title = settings.seo.title;
  const description = settings.seo.description;
  const keywords = settings.seo.keywords.split(",").map(k => k.trim());
  const streamerName = settings.branding.streamerName;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zehragn.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s — ${streamerName}`,
    },
    description,
    keywords,
    authors: [{ name: streamerName }],
    creator: streamerName,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      alternateLocale: "en_US",
      url: siteUrl,
      title: title,
      description,
      siteName: streamerName,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${streamerName} — Official Website`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description,
      images: ["/og-image.png"],
      creator: `@${streamerName.toLowerCase()}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: settings.branding.faviconUrl || "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }],
  width: "device-width",
  initialScale: 1,
};

// ---------------------------------------------------------------------------
// Root Layout
// ---------------------------------------------------------------------------

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="tr"
      // data-theme is set by ThemeProvider — default dark prevents flash
      data-theme="dark"
      suppressHydrationWarning
    >
      <body
        className={`${outfit.variable} ${inter.variable} antialiased`}
        style={{
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          backgroundColor: "var(--bg-base)",
          color: "var(--text-primary)",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
