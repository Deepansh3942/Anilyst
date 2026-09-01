export default function MyListLoading() {
  return (
    <main>
      <h1 className="page-header">My List</h1>
      <div className="status-tabs">
        {["All", "Watching", "Plan to Watch", "Completed"].map((tab) => (
          <div key={tab} className="status-tab" style={{ opacity: 0.5 }}>
            {tab}
          </div>
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="list-item">
          <div className="skeleton" style={{ width: 56, height: 80, borderRadius: 6, flexShrink: 0 }} />
          <div className="list-item-info">
            <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 10, width: "40%" }} />
          </div>
        </div>
      ))}
    </main>
  );
}
