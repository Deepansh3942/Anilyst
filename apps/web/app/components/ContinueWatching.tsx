"use client";

import { useState, useTransition } from "react";
import { updateEpisodeProgress } from "../../lib/actions";

export type ContinueItem = {
  anilistId: number;
  progress: number;
  title: string;
  cover: string | null;
  total: number | null;
  ongoing: boolean;
};

export default function ContinueWatching({ items }: { items: ContinueItem[] }) {
  const [entries, setEntries] = useState(items);
  const [isPending, startTransition] = useTransition();

  function bump(anilistId: number) {
    const current = entries.find((e) => e.anilistId === anilistId);
    if (!current) return;

    const completeAt = current.ongoing ? null : current.total;
    const next = current.progress + 1;
    const capped =
      completeAt != null && completeAt > 0
        ? Math.min(next, completeAt)
        : next;

    if (capped === current.progress) return;

    const finished = completeAt != null && completeAt > 0 && capped >= completeAt;

    setEntries((prev) =>
      finished
        ? prev.filter((e) => e.anilistId !== anilistId)
        : prev.map((e) =>
            e.anilistId === anilistId ? { ...e, progress: capped } : e
          )
    );

    startTransition(async () => {
      await updateEpisodeProgress(anilistId, capped, completeAt);
    });
  }

  if (entries.length === 0) return null;

  return (
    <div className="dash-rail">
      {entries.map((item) => {
        const denom = item.total != null ? item.total : null;
        const pct =
          denom != null && denom > 0
            ? Math.min(100, (item.progress / denom) * 100)
            : 0;
        const atCap =
          !item.ongoing && item.total != null && item.total > 0 && item.progress >= item.total;

        return (
          <article key={item.anilistId} className="dash-continue-card">
            <div className="dash-continue-art">
              {item.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.cover} alt="" />
              ) : (
                <div className="dash-continue-placeholder" />
              )}
              <div className="dash-progress-track" aria-hidden>
                <div className="dash-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <button
                type="button"
                className="dash-ep-plus"
                aria-label={`Log next episode of ${item.title}`}
                disabled={isPending || atCap}
                onClick={() => bump(item.anilistId)}
              >
                +1
              </button>
            </div>
            <div className="dash-continue-title">{item.title}</div>
            <div className="dash-continue-meta">
              Ep {item.progress}
              {denom != null ? ` / ${denom}${item.ongoing ? "+" : ""}` : ""}
            </div>
          </article>
        );
      })}
    </div>
  );
}
