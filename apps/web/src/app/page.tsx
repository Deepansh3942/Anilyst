const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <section style={{ maxWidth: 640, textAlign: "center" }}>
        <p style={{ color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Anilyst
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", margin: "0.4rem 0 1rem" }}>
          Track. Discover. Recommend.
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.125rem", lineHeight: 1.6 }}>
          Mark the anime you&apos;ve watched, explore the full catalog via AniList, and get
          recommendations — all in one place.
        </p>
        <p style={{ marginTop: "2rem", color: "var(--muted)", fontSize: "0.9rem" }}>
          API target: <code>{apiUrl}</code>
        </p>
      </section>
    </main>
  );
}
