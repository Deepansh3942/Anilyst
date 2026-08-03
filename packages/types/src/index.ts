export type WatchStatus = "WATCHING" | "COMPLETED" | "DROPPED" | "PAUSED" | "PLAN_TO_WATCH";

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AnimeSummary {
  id: number;
  title: string;
  coverImage?: string;
  format?: string;
  episodes?: number | null;
  averageScore?: number | null;
  genres?: string[];
}

export interface WatchListEntry {
  id: string;
  userId: string;
  anilistId: number;
  status: WatchStatus;
  progress: number;
  score?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiHealth {
  status: "ok" | "degraded";
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
}
