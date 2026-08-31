"use client";

import { useState, useEffect, useTransition } from "react";
import {
  trackAnime,
  untrackAnime,
  updateEpisodeProgress,
  type WatchStatusValue,
} from "../../lib/actions";
import { resolveEpisodeCount } from "../../lib/anilist";
import { FadeInView } from "../components/FadeIn";
import { StatusMark } from "../components/StatusIcon";
import StatusSheet from "../components/StatusSheet";

type TrackedEntry = {
  id: string;
  anilistId: number;
  status: string;
  progress: number;
  score: number | null;
};

type AnimeDetails = {
  id: number;
  title: { romaji: string | null; english: string | null };
  coverImage: { large: string | null };
  format: string | null;
  episodes: number | null;
  nextAiringEpisode?: { episode: number } | null;
};

const statusTabs: { value: WatchStatusValue | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "WATCHING", label: "Watching" },
  { value: "PLAN_TO_WATCH", label: "Plan to Watch" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PAUSED", label: "Paused" },
  { value: "DROPPED", label: "Dropped" },
];

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default function MyListClient({ tracked }: { tracked: TrackedEntry[] }) {
  const [activeTab, setActiveTab] = useState<WatchStatusValue | "ALL">("ALL");
  const [details, setDetails] = useState<Record<number, AnimeDetails>>({});
  const [entries, setEntries] = useState(tracked);
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setEntries(tracked);
  }, [tracked]);

  const ids = entries.map((t) => t.anilistId);

  useEffect(() => {
    if (ids.length === 0) return;

    async function fetchDetails() {
      const res = await fetch("/api/anilist-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      const map: Record<number, AnimeDetails> = {};
      for (const media of data.media ?? []) {
        map[media.id] = media;
      }
      setDetails(map);
    }

    fetchDetails();
  }, [ids.length]);

  function applyProgress(anilistId: number, nextProgress: number, total: number | null) {
    const current = entries.find((e) => e.anilistId === anilistId);
    if (!current) return;

    const capped =
      total != null && total > 0
        ? Math.min(Math.max(0, nextProgress), total)
        : Math.max(0, nextProgress);

    if (capped === current.progress) return;

    let status = current.status;
    if (total != null && total > 0 && capped >= total) {
      status = "COMPLETED";
    } else if (capped > 0 && (status === "PLAN_TO_WATCH" || status === "COMPLETED")) {
      status = "WATCHING";
    }

    setEntries((prev) =>
      prev.map((e) =>
        e.anilistId === anilistId ? { ...e, progress: capped, status } : e
      )
    );

    startTransition(async () => {
      await updateEpisodeProgress(anilistId, capped, total);
    });
  }

  function applyStatus(anilistId: number, status: WatchStatusValue, completeAt: number | null) {
    const current = entries.find((e) => e.anilistId === anilistId);
    if (!current) return;

    const progress =
      status === "COMPLETED" && completeAt != null && completeAt > 0
        ? completeAt
        : current.progress;

    setPickerFor(null);
    setEntries((prev) =>
      prev.map((e) =>
        e.anilistId === anilistId ? { ...e, status, progress } : e
      )
    );

    startTransition(async () => {
      await trackAnime(anilistId, status, progress);
    });
  }

  function removeEntry(anilistId: number, title: string) {
    const confirmed = window.confirm(`Remove "${title}" from your list?`);
    if (!confirmed) return;

    setPickerFor(null);
    const previous = entries;
    setEntries((prev) => prev.filter((e) => e.anilistId !== anilistId));

    startTransition(async () => {
      try {
        await untrackAnime(anilistId);
      } catch {
        setEntries(previous);
      }
    });
  }

  const filtered =
    activeTab === "ALL"
      ? entries
      : entries.filter((t) => t.status === activeTab);

  return (
    <main>
      <h1 className="page-header">My List</h1>

      <div className="status-tabs">
        {statusTabs.map((tab) => (
          <button
            type="button"
            key={tab.value}
            className={`status-tab ${activeTab === tab.value ? "active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          {entries.length === 0
            ? "You haven't tracked any anime yet. Search and add some!"
            : "No anime in this category."}
        </div>
      )}

      {filtered.map((entry, index) => {
        const anime = details[entry.anilistId];
        const { total, ongoing } = anime
          ? resolveEpisodeCount(anime)
          : { total: null, ongoing: false };
        const completeAt = ongoing ? null : total;
        const title = anime
          ? (anime.title.english ?? anime.title.romaji ?? "this anime")
          : "this anime";
        return (
          <FadeInView key={entry.id} delay={index * 0.04}>
            <div className="list-item">
              {anime?.coverImage.large ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={anime.coverImage.large} alt="" />
              ) : (
                <div style={{ width: 56, height: 80, borderRadius: 6, background: "var(--surface)" }} />
              )}
              <div className="list-item-info">
                <div className="list-item-title">
                  {anime
                    ? (anime.title.english ?? anime.title.romaji ?? "Loading...")
                    : "Loading..."}
                </div>
                <button
                  type="button"
                  className="list-item-status"
                  onClick={() => setPickerFor(entry.anilistId)}
                >
                  <StatusMark status={entry.status} size="sm" />
                  {statusLabel(entry.status)}
                </button>
                <StatusSheet
                  open={pickerFor === entry.anilistId}
                  currentStatus={entry.status}
                  onClose={() => setPickerFor(null)}
                  onPick={(status) => applyStatus(entry.anilistId, status, completeAt)}
                />
                <div className="ep-stepper">
                  <button
                    type="button"
                    aria-label="Decrease episode"
                    disabled={isPending || entry.progress <= 0}
                    onClick={() => applyProgress(entry.anilistId, entry.progress - 1, completeAt)}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={completeAt ?? undefined}
                    value={entry.progress}
                    disabled={isPending}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isNaN(value)) return;
                      applyProgress(entry.anilistId, value, completeAt);
                    }}
                  />
                  <span className="ep-stepper-total">
                    {total != null ? `/ ${total}${ongoing ? "+" : ""}` : "/ —"}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase episode"
                    disabled={
                      isPending || (completeAt != null && completeAt > 0 && entry.progress >= completeAt)
                    }
                    onClick={() => applyProgress(entry.anilistId, entry.progress + 1, completeAt)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="list-item-remove"
                aria-label={`Remove ${title} from list`}
                disabled={isPending}
                onClick={() => removeEntry(entry.anilistId, title)}
              >
                <RemoveIcon />
              </button>
            </div>
          </FadeInView>
        );
      })}
    </main>
  );
}

function RemoveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
