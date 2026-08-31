import { NextResponse } from "next/server";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

const QUERY = `
query ($ids: [Int]) {
  Page(page: 1, perPage: 50) {
    media(id_in: $ids, type: ANIME) {
      id
      title { romaji english }
      coverImage { large }
      format
      episodes
      nextAiringEpisode { episode }
    }
  }
}
`;

export async function POST(req: Request) {
  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ media: [] });
  }

  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { ids } }),
  });

  const json = await res.json();
  return NextResponse.json({ media: json.data?.Page?.media ?? [] });
}
