import { prisma } from "@repo/db";

export const dynamic = "force-dynamic";

export default async function DbTestPage() {
  const userCount = await prisma.user.count();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Database connection test</h1>
      <p>
        Users in database: <strong>{userCount}</strong>
      </p>
    </main>
  );
}
