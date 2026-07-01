import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term");

  if (!term || !term.trim()) {
    return NextResponse.json({ items: [] });
  }

  try {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&l=turkish&cc=tr`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ items: [] });
    }

    const data = await res.json();
    if (!data || !data.items) {
      return NextResponse.json({ items: [] });
    }

    const items = data.items.map((item: any) => {
      const appId = item.id;
      const isWindows = item.platforms?.windows ?? true;
      const isMac = item.platforms?.mac ?? false;
      const isLinux = item.platforms?.linux ?? false;

      let platform = "PC";
      if (isWindows && (isMac || isLinux)) {
        platform = "PC / Mac / Linux";
      }

      return {
        steamAppId: appId,
        name: item.name,
        headerImage: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
        storeUrl: `https://store.steampowered.com/app/${appId}`,
        platform,
      };
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Steam search error:", err);
    return NextResponse.json({ items: [] });
  }
}
