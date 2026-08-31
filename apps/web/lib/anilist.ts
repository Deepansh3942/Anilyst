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

const MEDIA_FIELDS = `
  id
  title { romaji english native }
  coverImage { large }
  format
  episodes
  seasonYear
  averageScore
  genres
`;

const SEARCH_QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 12) {
    media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
      ${MEDIA_FIELDS}
    }
  }
}
`;

const RECOMMENDED_QUERY = `
query ($page: Int) {
  Page(page: $page, perPage: 24) {
    pageInfo {
      hasNextPage
    }
    media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
      ${MEDIA_FIELDS}
    }
  }
}
`;

async function anilistFetch(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`AniList request failed: ${res.status}`);
  }

  return res.json();
}

export async function searchAnime(search: string): Promise<AnimeSearchResult[]> {
  if (!search.trim()) return [];

  const json = await anilistFetch(SEARCH_QUERY, { search });
  return json.data?.Page?.media ?? [];
}

export async function fetchRecommendedAnime(page = 1): Promise<{
  media: AnimeSearchResult[];
  hasNextPage: boolean;
}> {
  const json = await anilistFetch(RECOMMENDED_QUERY, { page });
  const pageData = json.data?.Page;
  return {
    media: pageData?.media ?? [],
    hasNextPage: pageData?.pageInfo?.hasNextPage ?? false,
  };
}

export function resolveEpisodeCount(media: {
  episodes: number | null;
  nextAiringEpisode?: { episode: number } | null;
}): { total: number | null; ongoing: boolean } {
  if (media.episodes != null && media.episodes > 0) {
    return { total: media.episodes, ongoing: false };
  }
  const next = media.nextAiringEpisode?.episode;
  if (next != null && next > 1) {
    return { total: next - 1, ongoing: true };
  }
  return { total: null, ongoing: true };
}
