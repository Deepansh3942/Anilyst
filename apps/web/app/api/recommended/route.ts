import { NextResponse } from "next/server";
import { fetchRecommendedAnime } from "../../../lib/anilist";

export async function GET(req: Request) {
  const page = Number(new URL(req.url).searchParams.get("page") ?? "1");

  if (!Number.isInteger(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  const data = await fetchRecommendedAnime(page);
  return NextResponse.json(data);
}
