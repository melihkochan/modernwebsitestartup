export interface CreatorProfile {
  id: string;
  username: string;
  slug: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  followerCount: number;
  verified: boolean;
}

export interface StreamState {
  isLive: boolean;
  title: string | null;
  category: string | null;
  viewerCount: number;
  startedAt: string | null; // ISO Date String
  thumbnailUrl: string | null;
}

export interface AnalyticsSnapshot {
  viewerCount: number;
  followerCount: number;
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
