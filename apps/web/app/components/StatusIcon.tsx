import type { WatchStatusValue } from "../../lib/actions";

export function statusToneClass(status: string) {
  return `status-tone-${status.toLowerCase().replaceAll("_", "-")}`;
}

export function StatusIcon({ status }: { status: WatchStatusValue | string }) {
  switch (status) {
    case "WATCHING":
      return <PlayIcon />;
    case "PLAN_TO_WATCH":
      return <BookmarkIcon />;
    case "COMPLETED":
      return <CheckIcon />;
    case "PAUSED":
      return <PauseIcon />;
    case "DROPPED":
      return <XIcon />;
    default:
      return <CheckIcon />;
  }
}

export function StatusMark({
  status,
  size = "md",
}: {
  status: WatchStatusValue | string;
  size?: "sm" | "md";
}) {
  return (
    <span className={`status-mark status-mark-${size} ${statusToneClass(status)}`}>
      <StatusIcon status={status} />
    </span>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="5 13 10 18 19 7" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6.5" y="5" width="4" height="14" rx="1" />
      <rect x="13.5" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
