import Link from "next/link";
import { auth } from "../auth";
import { prisma } from "@repo/db";
import {
  currentAnimeSeason,
  fetchMediaByIds,
  fetchSeasonalAnime,
  fetchTrendingAnime,
  resolveEpisodeCount,
  type AnimeSearchResult,
} from "../lib/anilist";
import type { WatchStatusValue } from "../lib/actions";
import FadeIn from "./components/FadeIn";
import TrackButton from "./components/TrackButton";
import ContinueWatching, {
  type ContinueItem,
} from "./components/ContinueWatching";

export const dynamic = "force-dynamic";

function titleOf(anime: AnimeSearchResult) {
  return anime.title.english ?? anime.title.romaji ?? "Untitled";
}

function plainText(value: string | null | undefined, max = 140) {
  if (!value) return "";
  const text = value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function PosterGrid({
  items,
  statuses,
}: {
  items: AnimeSearchResult[];
  statuses: Record<number, WatchStatusValue>;
}) {
  return (
    <div className="anime-grid">
      {items.map((anime, index) => (
        <FadeIn key={anime.id} delay={index * 0.05} className="anime-card">
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
            <div className="anime-card-title">{titleOf(anime)}</div>
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

function PosterRail({
  items,
  statuses,
}: {
  items: AnimeSearchResult[];
  statuses: Record<number, WatchStatusValue>;
}) {
  return (
    <div className="dash-rail">
      {items.map((anime) => (
        <FadeIn key={anime.id} className="anime-card dash-rail-card">
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
            <div className="anime-card-title">{titleOf(anime)}</div>
            <div className="anime-card-meta">
              {anime.averageScore != null ? `${anime.averageScore}%` : anime.format}
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

async function loadDashboard() {
  const session = await auth();
  const email = session?.user?.email;
  const season = currentAnimeSeason();

  const catalogPromise = Promise.all([
    fetchTrendingAnime(12).catch(() => [] as AnimeSearchResult[]),
    fetchSeasonalAnime(season.season, season.year, 6).catch(
      () => [] as AnimeSearchResult[]
    ),
  ]);

  if (!email) {
    const [trending, seasonal] = await catalogPromise;
    return {
      session: null as typeof session,
      firstName: null as string | null,
      stats: { watching: 0, completed: 0, planned: 0, total: 0 },
      continueWatching: [] as ContinueItem[],
      upNext: [] as ContinueItem[],
      statuses: {} as Record<number, WatchStatusValue>,
      trending,
      seasonal,
      seasonLabel: season.label,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { trackedAnime: { orderBy: { updatedAt: "desc" } } },
  });

  const tracked = user?.trackedAnime ?? [];
  const statuses: Record<number, WatchStatusValue> = {};
  let watching = 0;
  let completed = 0;
  let planned = 0;

  for (const row of tracked) {
    statuses[row.anilistId] = row.status as WatchStatusValue;
    if (row.status === "WATCHING") watching += 1;
    else if (row.status === "COMPLETED") completed += 1;
    else if (row.status === "PLAN_TO_WATCH") planned += 1;
  }

  const watchingRows = tracked.filter((row) => row.status === "WATCHING").slice(0, 12);
  const plannedRows = tracked
    .filter((row) => row.status === "PLAN_TO_WATCH")
    .slice(0, 8);
  const detailIds = [
    ...new Set([...watchingRows, ...plannedRows].map((row) => row.anilistId)),
  ];

  const [[trending, seasonal], details] = await Promise.all([
    catalogPromise,
    fetchMediaByIds(detailIds).catch(() => [] as AnimeSearchResult[]),
  ]);

  const detailMap = new Map(details.map((media) => [media.id, media]));

  function toContinue(row: (typeof tracked)[number]): ContinueItem {
    const media = detailMap.get(row.anilistId);
    const { total, ongoing } = media
      ? resolveEpisodeCount(media)
      : { total: null, ongoing: false };
    return {
      anilistId: row.anilistId,
      progress: row.progress,
      title: media ? titleOf(media) : "Loading…",
      cover: media?.coverImage.large ?? null,
      total,
      ongoing,
    };
  }

  const firstName = session?.user?.name?.split(" ")[0] ?? null;

  return {
    session,
    firstName,
    stats: { watching, completed, planned, total: tracked.length },
    continueWatching: watchingRows.map(toContinue),
    upNext: watchingRows.length === 0 ? plannedRows.map(toContinue) : [],
    statuses,
    trending,
    seasonal,
    seasonLabel: season.label,
  };
}

export default async function Home() {
  const {
    session,
    firstName,
    stats,
    continueWatching,
    upNext,
    statuses,
    trending,
    seasonal,
    seasonLabel,
  } = await loadDashboard();

  const featured = trending[0] ?? null;
  const trendingRail = featured ? trending.slice(1) : trending;
  const signedIn = Boolean(session?.user);

  return (
    <main>
      <header className="dash-top">
        <div className="dash-brand">Anilyst</div>
        {signedIn ? (
          <>
            <h1 className="dash-greeting">
              Welcome back{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="dash-sub">
              {stats.total === 0
                ? "Start a list and this home will fill in around it."
                : "Pick up where you left off — or find the next one."}
            </p>
          </>
        ) : (
          <>
            <h1 className="dash-greeting">Track every episode.</h1>
            <p className="dash-sub">
              Search the catalog, keep a list, and never lose your place.
            </p>
          </>
        )}
      </header>

      {signedIn ? (
        <section className="dash-stats" aria-label="List stats">
          <Link href="/my-list" className="dash-stat">
            <span className="dash-stat-value dash-stat-watching">{stats.watching}</span>
            <span className="dash-stat-label">Watching</span>
          </Link>
          <Link href="/my-list" className="dash-stat">
            <span className="dash-stat-value dash-stat-completed">{stats.completed}</span>
            <span className="dash-stat-label">Completed</span>
          </Link>
          <Link href="/my-list" className="dash-stat">
            <span className="dash-stat-value dash-stat-planned">{stats.planned}</span>
            <span className="dash-stat-label">Plan to Watch</span>
          </Link>
        </section>
      ) : (
        <section className="dash-cta">
          <p>Sign in to track progress across every title you add.</p>
          <div className="dash-cta-row">
            <Link href="/account" className="btn btn-primary">
              Sign in
            </Link>
            <Link href="/search" className="btn btn-secondary">
              Browse catalog
            </Link>
          </div>
        </section>
      )}

      {continueWatching.length > 0 && (
        <section>
          <div className="dash-section-head">
            <h2>Continue watching</h2>
            <Link href="/my-list">See list</Link>
          </div>
          <ContinueWatching items={continueWatching} />
        </section>
      )}

      {upNext.length > 0 && (
        <section>
          <div className="dash-section-head">
            <h2>Up next</h2>
            <Link href="/my-list">See list</Link>
          </div>
          <ContinueWatching items={upNext} />
        </section>
      )}

      {signedIn && stats.total === 0 && (
        <div className="empty-state dash-empty">
          Nothing on your list yet. Search a title and tap + to start tracking.
        </div>
      )}

      {featured && (
        <section>
          <div className="dash-section-head">
            <h2>Trending now</h2>
            <Link href="/search">Browse</Link>
          </div>
          <FadeIn className="dash-featured">
            {featured.bannerImage || featured.coverImage.large ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featured.bannerImage || featured.coverImage.large || ""}
                alt=""
                className="dash-featured-bg"
              />
            ) : null}
            <div className="dash-featured-scrim" />
            <TrackButton
              anilistId={featured.id}
              episodes={featured.episodes}
              currentStatus={statuses[featured.id] ?? null}
            />
            <div className="dash-featured-body">
              <div className="dash-featured-kicker">Hottest on AniList</div>
              <h3 className="dash-featured-title">{titleOf(featured)}</h3>
              <div className="dash-featured-meta">
                {featured.format}
                {featured.seasonYear ? ` · ${featured.seasonYear}` : ""}
                {featured.averageScore != null ? ` · ${featured.averageScore}%` : ""}
              </div>
              {featured.genres.length > 0 && (
                <div className="dash-genres">
                  {featured.genres.slice(0, 3).map((genre) => (
                    <span key={genre} className="dash-genre">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              {plainText(featured.description) && (
                <p className="dash-featured-desc">{plainText(featured.description)}</p>
              )}
            </div>
          </FadeIn>
          {trendingRail.length > 0 && (
            <PosterRail items={trendingRail} statuses={statuses} />
          )}
        </section>
      )}

      {seasonal.length > 0 && (
        <section>
          <div className="dash-section-head">
            <h2>{seasonLabel}</h2>
            <Link href="/search">More</Link>
          </div>
          <PosterGrid items={seasonal} statuses={statuses} />
        </section>
      )}
    </main>
  );
}
