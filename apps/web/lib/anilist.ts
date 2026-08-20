const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export interface AnimeSearchResult {
  id: number;
  title: { romaji: string | null; english: string | null; native: string | null };
  coverImage: { large: string | null };
  format: string | null;
  episodes: number | null;
  seasonYear: number | null;
  averageScore: number | null;
  genres: string[];
}

const SEARCH_QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 12) {
    media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
      id
      title { romaji english native }
      coverImage { large }
      format
      episodes
      seasonYear
      averageScore
      genres
    }
  }
}
`;

export async function searchAnime(search: string): Promise<AnimeSearchResult[]> {
  if (!search.trim()) return [];

  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: SEARCH_QUERY, variables: { search } }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`AniList request failed: ${res.status}`);
  }

  const json = await res.json();
  return json.data?.Page?.media ?? [];
}
