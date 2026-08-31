"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimeSearchResult } from "../../lib/anilist";
import type { WatchStatusValue } from "../../lib/actions";
import { FadeInView } from "./FadeIn";
import TrackButton from "./TrackButton";

export default function RecommendedBrowse({
  initialItems,
  initialHasMore,
  statuses,
}: {
  initialItems: AnimeSearchResult[];
  initialHasMore: boolean;
  statuses: Record<number, WatchStatusValue>;
}) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/recommended?page=${nextPage}`);
      if (!res.ok) return;

      const data = await res.json();
      setItems((prev) => [...prev, ...(data.media ?? [])]);
      setPage(nextPage);
      setHasMore(data.hasNextPage ?? false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <>
      <div className="anime-grid">
        {items.map((anime) => (
          <FadeInView key={anime.id} className="anime-card">
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
          </FadeInView>
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="recommended-load-more" aria-hidden>
          {loading && <span className="recommended-loading">Loading more…</span>}
        </div>
      )}
    </>
  );
}
