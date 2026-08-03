import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.22em] text-[var(--accent)] uppercase transition-opacity hover:opacity-80"
          >
            Anilyst
          </Link>

          <div className="my-16 max-w-md lg:my-0">
            <p className="mb-4 text-xs font-medium tracking-[0.2em] text-[var(--muted)] uppercase">
              Anime tracking, sharpened
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Track what you watch.
              <span className="mt-2 block text-[var(--accent)]">Find what&apos;s next.</span>
            </h1>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-[var(--muted)]">
              Your library, catalog, and recommendations in one place — powered by AniList, shaped
              around how you actually watch.
            </p>
          </div>

          <p className="hidden text-sm text-[var(--muted)] lg:block">
            Catalog metadata via AniList. Your list stays yours.
          </p>
        </section>

        <section className="flex items-center px-6 pb-12 sm:px-10 lg:px-12 lg:py-12">
          <div
            className="w-full max-w-md border border-[var(--border)] bg-[var(--surface)] p-7 backdrop-blur-md sm:p-9"
            style={{ borderRadius: "1.25rem" }}
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-7 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
              {footer}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
