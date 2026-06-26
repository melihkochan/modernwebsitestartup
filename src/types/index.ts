/**
 * Global shared TypeScript types used across multiple features.
 * Feature-specific types belong in their respective feature/types/ folder.
 */

// ---------------------------------------------------------------------------
// API Response types
// ---------------------------------------------------------------------------

/** Standard success response envelope */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/** Standard error response envelope */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

/** Union type for all API responses */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  isExternal?: boolean;
}

// ---------------------------------------------------------------------------
// Component utility types
// ---------------------------------------------------------------------------

/** Generic component with children */
export interface WithChildren {
  children: React.ReactNode;
}

/** Generic component with optional className */
export interface WithClassName {
  className?: string;
}

// ---------------------------------------------------------------------------
// Stream / Kick related shared types
// ---------------------------------------------------------------------------

export type StreamStatus = "live" | "offline";

export interface KickStreamInfo {
  isLive: boolean;
  viewerCount: number;
  currentGame: string | null;
  streamTitle: string | null;
  startedAt: string | null;
  thumbnailUrl?: string | null;
}

// ---------------------------------------------------------------------------
// Realtime event payloads
// ---------------------------------------------------------------------------

export interface RealtimeStreamEvent {
  type: "stream_update";
  payload: Partial<KickStreamInfo>;
}
