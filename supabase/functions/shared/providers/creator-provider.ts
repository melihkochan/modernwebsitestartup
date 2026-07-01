export interface CreatorProfile {
  id: string;
  username: string;
  slug: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  // followerCount is null when the Kick API does not expose it via client credentials
  followerCount: number | null;
  // subscriberCount from active_subscribers_count field (officially supported)
  subscriberCount: number | null;
  verified: boolean;
}

export interface StreamState {
  isLive: boolean;
  title: string | null;
  category: string | null;
  viewerCount: number;
  startedAt: string | null; // ISO Date String
  thumbnailUrl: string | null;
  externalId?: string | null;
  language?: string | null;
}

export interface AnalyticsSnapshot {
  viewerCount: number;
  // followerCount is null when the Kick API does not expose it
  followerCount: number | null;
  subscriberCount: number | null;
  timestamp: string; // ISO Date String
}

export interface ChannelInfo {
  id: string;
  slug: string;
  playbackUrl: string;
}

export interface CreatorProvider {
  getProfile(slug: string): Promise<CreatorProfile>;
  getStreamState(slug: string, broadcasterUserId: string): Promise<StreamState>;
  getChannelInfo(slug: string): Promise<ChannelInfo>;
}
