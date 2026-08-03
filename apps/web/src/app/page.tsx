import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 sm:px-10">
      <header className="flex items-center justify-between gap-4">
        <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.22em] text-[var(--accent)] uppercase">
          Anilyst
        </p>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-[#042f2e] transition-[filter] hover:brightness-110"
            style={{ borderRadius: "0.65rem" }}
          >
            Sign up
          </Link>
        </nav>
      </header>

      <section className="flex flex-1 flex-col items-start justify-center py-16 sm:py-20">
        <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          Track. Discover.
          <span className="mt-1 block text-[var(--accent)]">Recommend.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          Mark the anime you&apos;ve watched, explore the full catalog via AniList, and get
          recommendations — all in one place.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/signup"
            className="bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#042f2e] transition-[transform,filter] hover:brightness-110 active:translate-y-px"
            style={{ borderRadius: "0.7rem" }}
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ borderRadius: "0.7rem" }}
          >
            I already have an account
          </Link>
        </div>
      </section>
    </main>
  );
}
