"use client";

import { createPortal } from "react-dom";
import type { WatchStatusValue } from "../../lib/actions";
import { StatusMark } from "./StatusIcon";

export const WATCH_STATUSES: { value: WatchStatusValue; label: string }[] = [
  { value: "WATCHING", label: "Watching" },
  { value: "PLAN_TO_WATCH", label: "Plan to Watch" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PAUSED", label: "Paused" },
  { value: "DROPPED", label: "Dropped" },
];

export default function StatusSheet({
  open,
  currentStatus,
  onClose,
  onPick,
}: {
  open: boolean;
  currentStatus?: WatchStatusValue | string | null;
  onClose: () => void;
  onPick: (status: WatchStatusValue) => void;
}) {
  if (!open) return null;

  return createPortal(
    <>
      <div className="status-picker-backdrop" onClick={onClose} />
      <div className="status-picker">
        {WATCH_STATUSES.map((s) => (
          <button
            type="button"
            key={s.value}
            className={currentStatus === s.value ? "current" : ""}
            onClick={() => onPick(s.value)}
          >
            <StatusMark status={s.value} />
            {s.label}
          </button>
        ))}
      </div>
    </>,
    document.body
  );
}
