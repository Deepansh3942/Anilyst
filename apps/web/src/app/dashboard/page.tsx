"use client";

import type { User } from "@anilyst/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  saveAuthSession,
} from "@/lib/auth-storage";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unauthenticated">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const accessToken = getAccessToken();
      if (!accessToken) {
        if (!cancelled) setStatus("unauthenticated");
        return;
      }

      try {
        let response = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 401) {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            clearAuthSession();
            if (!cancelled) setStatus("unauthenticated");
            return;
          }

          const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshResponse.ok) {
            clearAuthSession();
            if (!cancelled) setStatus("unauthenticated");
            return;
          }

          const refreshed = (await refreshResponse.json()) as {
            user: User;
            tokens: { accessToken: string; refreshToken: string };
          };
          saveAuthSession(refreshed);

          response = await fetch(`${apiUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${refreshed.tokens.accessToken}` },
          });
        }

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const payload = (await response.json()) as { user: User };
        if (!cancelled) {
          setUser(payload.user);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setUser(getStoredUser());
          setError("Could not refresh profile from the API.");
          setStatus(getStoredUser() ? "ready" : "unauthenticated");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await fetch(`${apiUrl}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // Local logout still proceeds if the API is unreachable.
      }
    }
    clearAuthSession();
    window.location.href = "/login";
  }

  if (status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <p className="text-[var(--muted)]">Loading your library…</p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
            Sign in required
          </h1>
          <p className="mt-3 text-[var(--muted)]">Your session is missing or expired.</p>
          <Link
            href="/login"
            className="mt-6 inline-block bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#042f2e]"
            style={{ borderRadius: "0.7rem" }}
          >
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10">
      <header className="flex items-center justify-between gap-4">
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.22em] text-[var(--accent)] uppercase">
          Anilyst
        </p>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="border border-[var(--border)] px-3.5 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style={{ borderRadius: "0.65rem" }}
        >
          Sign out
        </button>
      </header>

      <section className="mt-16">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight">
          Hey, {user?.username}
        </h1>
        <p className="mt-3 max-w-lg text-[var(--muted)]">
          You&apos;re signed in. Library tracking, catalog, and recommendations will land here next.
        </p>
        {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}
        <dl className="mt-8 space-y-3 text-sm">
          <div>
            <dt className="text-[var(--muted)]">Email</dt>
            <dd className="mt-1">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">Username</dt>
            <dd className="mt-1">{user?.username}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
