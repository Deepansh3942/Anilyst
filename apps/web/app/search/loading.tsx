export default function SearchLoading() {
  return (
    <main>
      <h1 className="page-header">Search</h1>
      <div className="search-bar">
        <input type="text" placeholder="Search for an anime..." disabled />
        <button disabled>Search</button>
      </div>
      <div className="anime-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="anime-card">
            <div className="skeleton" style={{ aspectRatio: "3/4" }} />
            <div className="anime-card-info">
              <div className="skeleton" style={{ height: 14, width: "80%", marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 10, width: "50%" }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
