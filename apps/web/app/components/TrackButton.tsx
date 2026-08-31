"use client";

import { useEffect, useState, useTransition } from "react";
import { trackAnime, type WatchStatusValue } from "../../lib/actions";
import StatusSheet from "./StatusSheet";
import { PlusIcon, StatusIcon, statusToneClass } from "./StatusIcon";

export default function TrackButton({
  anilistId,
  currentStatus,
  episodes,
}: {
  anilistId: number;
  currentStatus?: WatchStatusValue | null;
  episodes?: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(currentStatus ?? null);

  useEffect(() => {
    setLocalStatus(currentStatus ?? null);
  }, [currentStatus]);

  function handlePick(status: WatchStatusValue) {
    setOpen(false);
    setLocalStatus(status);
    const progress =
      status === "COMPLETED" && episodes != null && episodes > 0
        ? episodes
        : undefined;
    startTransition(async () => {
      await trackAnime(anilistId, status, progress);
    });
  }

  return (
    <div className="track-btn-wrap">
      <button
        type="button"
        className={`track-btn ${localStatus ? `tracked ${statusToneClass(localStatus)}` : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        disabled={isPending}
      >
        {isPending ? "…" : localStatus ? <StatusIcon status={localStatus} /> : <PlusIcon />}
      </button>
      <StatusSheet
        open={open}
        currentStatus={localStatus}
        onClose={() => setOpen(false)}
        onPick={handlePick}
      />
    </div>
  );
}
