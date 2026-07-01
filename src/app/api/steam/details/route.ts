import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get("appId");
  if (!appId) {
    return NextResponse.json({ error: "Missing appId" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&l=turkish&cc=tr`,
      { next: { revalidate: 600 } } // Cache on Edge CDN for 10 minutes
    );
    if (!res.ok) {
      return NextResponse.json({ error: "Steam API error" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
