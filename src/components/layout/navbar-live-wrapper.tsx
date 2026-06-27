"use client";

import { useStreamInfo } from "@/features/live/hooks/use-live";
import { Navbar } from "./navbar";

/**
 * Client-side Navbar wrapper that reads live stream state from the repository.
 *
 * Replaces the per-page MOCK_STREAM props pattern.
 * Server Component pages import this instead of <Navbar> directly
 * so they don't need to import mock data just for the nav bar.
 */
export function NavbarLiveWrapper() {
  const { data: streamInfo } = useStreamInfo();

  return (
    <Navbar
      isLive={streamInfo?.isLive ?? false}
      viewerCount={streamInfo?.viewerCount ?? undefined}
    />
  );
}
