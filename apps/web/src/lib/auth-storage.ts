import type { AuthResponse, AuthTokens, User } from "@anilyst/types";

const ACCESS_TOKEN_KEY = "anilyst.accessToken";
const REFRESH_TOKEN_KEY = "anilyst.refreshToken";
const USER_KEY = "anilyst.user";

export function saveAuthSession(payload: AuthResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, payload.tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, payload.tokens.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

export function clearAuthSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function getStoredTokens(): AuthTokens | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}
