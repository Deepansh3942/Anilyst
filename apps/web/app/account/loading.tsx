export default function AccountLoading() {
  return (
    <main>
      <h1 className="page-header">Account</h1>
      <div className="auth-card">
        <div
          className="skeleton"
          style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px" }}
        />
        <div className="skeleton" style={{ height: 20, width: "50%", margin: "0 auto 8px" }} />
        <div className="skeleton" style={{ height: 14, width: "60%", margin: "0 auto" }} />
      </div>
    </main>
  );
}
