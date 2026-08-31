import { fetchRecommendedAnime, searchAnime, type AnimeSearchResult } from "../../lib/anilist";
import RecommendedBrowse from "../components/RecommendedBrowse";
import { auth } from "../../auth";
import { prisma } from "@repo/db";
import type { WatchStatusValue } from "../../lib/actions";
import FadeIn from "../components/FadeIn";
import TrackButton from "../components/TrackButton";

export const dynamic = "force-dynamic";

async function loadTrackedStatuses() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return {} as Record<number, WatchStatusValue>;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { trackedAnime: { select: { anilistId: true, status: true } } },
  });

  const map: Record<number, WatchStatusValue> = {};
  for (const row of user?.trackedAnime ?? []) {
    map[row.anilistId] = row.status as WatchStatusValue;
  }
  return map;
}

function AnimeGrid({
  items,
  statuses,
}: {
  items: AnimeSearchResult[];
  statuses: Record<number, WatchStatusValue>;
}) {
  return (
    <div className="anime-grid">
      {items.map((anime, index) => (
        <FadeIn key={anime.id} delay={index * 0.06} className="anime-card">
          {anime.coverImage.large && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={anime.coverImage.large} alt="" />
          )}
          <TrackButton
            anilistId={anime.id}
            episodes={anime.episodes}
            currentStatus={statuses[anime.id] ?? null}
          />
          <div className="anime-card-info">
            <div className="anime-card-title">
              {anime.title.english ?? anime.title.romaji}
            </div>
            <div className="anime-card-meta">
              {anime.format}
              {anime.seasonYear ? ` · ${anime.seasonYear}` : ""}
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";
  const [results, recommended, statuses] = await Promise.all([
    query ? searchAnime(query) : Promise.resolve(null),
    query ? Promise.resolve(null) : fetchRecommendedAnime(1),
    loadTrackedStatuses(),
  ]);

  return (
    <main>
      <h1 className="page-header">Search</h1>

      <form method="get" className="search-bar">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search for an anime..."
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {query && results && results.length === 0 && (
        <div className="empty-state">No results for &ldquo;{query}&rdquo;</div>
      )}

      {query && results && <AnimeGrid items={results} statuses={statuses} />}

      {!query && recommended && (
        <>
          <h2 className="section-header">Recommended</h2>
          <RecommendedBrowse
            initialItems={recommended.media}
            initialHasMore={recommended.hasNextPage}
            statuses={statuses}
          />
        </>
      )}
    </main>
  );
}
