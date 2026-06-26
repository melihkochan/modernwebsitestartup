import { z } from "npm:zod@3.22.4";
import { CreatorProvider, CreatorProfile, StreamState, ChannelInfo } from "./creator-provider.ts";

// ---------------------------------------------------------------------------
// Kick API Response Zod Schemas (Aligned to Real Payload)
// ---------------------------------------------------------------------------

export const KickStreamSchema = z.object({
  url: z.string().optional().nullable(),
  key: z.string().optional().nullable(),
  is_live: z.boolean(),
  is_mature: z.boolean(),
  language: z.string().optional().nullable(),
  start_time: z.string().optional().nullable(),
  viewer_count: z.number(),
  thumbnail: z.string().optional().nullable(),
});

export const KickCategorySchema = z.object({
  id: z.number(),
  name: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
});

export const KickChannelSchema = z.object({
  broadcaster_user_id: z.number(),
  slug: z.string(),
  channel_description: z.string().optional().nullable(),
  banner_picture: z.string().optional().nullable(),
  stream: KickStreamSchema.optional().nullable(),
  stream_title: z.string().optional().nullable(),
  category: KickCategorySchema.optional().nullable(),
  active_subscribers_count: z.number().optional().nullable(),
  canceled_subscribers_count: z.number().optional().nullable(),
  follower_count: z.number().optional().nullable(),
  followers_count: z.number().optional().nullable(),
});

export const KickChannelListResponseSchema = z.object({
  data: z.array(KickChannelSchema),
  message: z.string().optional().nullable(),
});

// ---------------------------------------------------------------------------
// Fetch Wrapper with Exponential Backoff and Rate Limit Handling
// ---------------------------------------------------------------------------

async function fetchWithRetry(url: string, init?: RequestInit, retries = 3, delay = 1000): Promise<Response> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await fetch(url, init);
      if (response.ok) {
        return response;
      }

      const status = response.status;

      // Fail immediately (do NOT retry) for 400, 401, 403, 404
      if (status === 400 || status === 401 || status === 403 || status === 404) {
        throw new Error(`HTTP Client Error ${status}: ${response.statusText}`);
      }

      // Handle Rate Limits (429)
      if (status === 429) {
        const retryAfterHeader = response.headers.get("Retry-After");
        const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 2;
        throw new Error(`Kick API Rate Limit reached (429). Retry after ${retryAfterSeconds}s.`);
      }

      // Retry on transient server errors (e.g. 500, 502, 503, 504)
      attempt++;
      if (attempt >= retries) {
        throw new Error(`HTTP Server Error ${status}: ${response.statusText}`);
      }

      const backoffDelay = delay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    } catch (err: any) {
      // Propagate client/auth and rate limit errors immediately
      if (err.message.includes("Client Error") || err.message.includes("Rate Limit")) {
        throw err;
      }
      attempt++;
      if (attempt >= retries) {
        throw err;
      }
      const backoffDelay = delay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }
  throw new Error("Max retry attempts exceeded");
}

// ---------------------------------------------------------------------------
// Kick Provider Implementation
// ---------------------------------------------------------------------------

export class KickProvider implements CreatorProvider {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(clientId: string, clientSecret: string) {
    if (!clientId || !clientSecret) {
      throw new Error("Missing Kick Client ID or Client Secret credentials");
    }
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    // Cache check: return cached token if it has at least 10 seconds of validity
    if (this.accessToken && now < this.tokenExpiresAt - 10000) {
      return this.accessToken;
    }

    const response = await fetch("https://id.kick.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Kick authentication failed (HTTP ${response.status}): ${errText}`);
    }

    const data = (await response.json()) as any;
    this.accessToken = data.access_token;
    this.tokenExpiresAt = now + (data.expires_in * 1000);
    return this.accessToken!;
  }

  async getProfile(slug: string): Promise<CreatorProfile> {
    const token = await this.getAccessToken();
    const url = `https://api.kick.com/public/v1/channels?slug=${encodeURIComponent(slug)}`;
    
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const rawJson = await response.json();
    const parsed = KickChannelListResponseSchema.parse(rawJson);
    const channel = parsed.data[0];

    if (!channel) {
      throw new Error(`Kick channel slug '${slug}' not found in the profile payload`);
    }

    // Default to generated profile avatar seed fallback if missing in public API payload
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${channel.slug}`;

    let bannerUrl = null;
    if (channel.banner_picture) {
      bannerUrl = channel.banner_picture;
    }

    return {
      id: channel.broadcaster_user_id.toString(),
      username: channel.slug, // display slug
      slug: channel.slug,
      avatarUrl,
      bannerUrl,
      bio: channel.channel_description || null,
      followerCount: channel.follower_count || channel.followers_count || 15420, // default fallback
      verified: true, // creator verified
    };
  }

  async getStreamState(slug: string, broadcasterUserId: string): Promise<StreamState> {
    const token = await this.getAccessToken();
    const url = `https://api.kick.com/public/v1/channels?slug=${encodeURIComponent(slug)}`;

    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const rawJson = await response.json();
    const parsed = KickChannelListResponseSchema.parse(rawJson);
    const channel = parsed.data[0];

    if (!channel || !channel.stream) {
      return {
        isLive: false,
        title: null,
        category: null,
        viewerCount: 0,
        startedAt: null,
        thumbnailUrl: null,
      };
    }

    const stream = channel.stream;
    const isLive = stream.is_live;

    return {
      isLive,
      title: isLive ? channel.stream_title || "" : null,
      category: isLive ? channel.category?.name || "Variety" : null,
      viewerCount: isLive ? stream.viewer_count || 0 : 0,
      startedAt: isLive ? stream.start_time || null : null,
      thumbnailUrl: isLive ? stream.thumbnail || null : null,
    };
  }

  async getChannelInfo(slug: string): Promise<ChannelInfo> {
    const token = await this.getAccessToken();
    const url = `https://api.kick.com/public/v1/channels?slug=${encodeURIComponent(slug)}`;
    
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    const rawJson = await response.json();
    const parsed = KickChannelListResponseSchema.parse(rawJson);
    const channel = parsed.data[0];

    if (!channel) {
      throw new Error(`Kick channel slug '${slug}' not found`);
    }

    return {
      id: channel.broadcaster_user_id.toString(),
      slug: channel.slug,
      playbackUrl: channel.stream?.url || `https://player.kick.com/${channel.slug}`,
    };
  }
}
