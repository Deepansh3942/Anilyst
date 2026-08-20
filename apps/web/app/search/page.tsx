import { searchAnime } from "../../lib/anilist";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";
  const results = query ? await searchAnime(query) : [];

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 960, margin: "0 auto" }}>
      <h1>Search anime</h1>

      <form method="get" style={{ margin: "1rem 0", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search for an anime..."
          style={{ flex: 1, padding: "0.5rem", fontSize: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Search</button>
      </form>

      {query && results.length === 0 && <p>No results for &ldquo;{query}&rdquo;.</p>}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        {results.map((anime) => (
          <li key={anime.id} style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
            {anime.coverImage.large && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={anime.coverImage.large} alt="" style={{ width: "100%", display: "block" }} />
            )}
            <div style={{ padding: "0.5rem" }}>
              <strong>{anime.title.english ?? anime.title.romaji}</strong>
              <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                {anime.format}
                {anime.seasonYear ? ` · ${anime.seasonYear}` : ""}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
