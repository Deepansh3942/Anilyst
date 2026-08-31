import { auth } from "../../auth";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import MyListClient from "./MyListClient";

export const dynamic = "force-dynamic";

export default async function MyListPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/account");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { trackedAnime: { orderBy: { updatedAt: "desc" } } },
  });

  const tracked = (user?.trackedAnime ?? []).map((entry) => ({
    id: entry.id,
    anilistId: entry.anilistId,
    status: entry.status,
    progress: entry.progress,
    score: entry.score,
  }));

  return <MyListClient tracked={tracked} />;
}
