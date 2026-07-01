export interface SteamGameDetails {
  name: string;
  header_image: string;
  short_description: string;
  release_date?: { date: string };
  genres?: { description: string }[];
  price_overview?: { final_formatted: string };
  recommendations?: { total: number };
  metacritic?: { score: number };
}

const steamCache = new Map<number, { data: SteamGameDetails; expires: number }>();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes cache

export async function fetchSteamGameDetails(appId: number): Promise<SteamGameDetails | null> {
  const cached = steamCache.get(appId);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    const isBrowser = typeof window !== "undefined";
    const url = isBrowser
      ? `/api/steam/details?appId=${appId}`
      : `https://store.steampowered.com/api/appdetails?appids=${appId}&l=turkish&cc=tr`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data[appId]?.success) {
      const details = data[appId].data as SteamGameDetails;
      steamCache.set(appId, {
        data: details,
        expires: Date.now() + CACHE_TTL,
      });
      return details;
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch Steam appid ${appId}:`, err);
    return null;
  }
}
