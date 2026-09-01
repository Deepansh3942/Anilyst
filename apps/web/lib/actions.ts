"use server";

import { auth } from "../auth";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export type WatchStatusValue =
  | "WATCHING"
  | "COMPLETED"
  | "DROPPED"
  | "PAUSED"
  | "PLAN_TO_WATCH";

async function requireUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    throw new Error("You must be signed in to track anime.");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

export async function trackAnime(
  anilistId: number,
  status: WatchStatusValue,
  progress?: number
) {
  const user = await requireUser();

  const data: { status: WatchStatusValue; progress?: number } = { status };
  if (progress !== undefined) {
    data.progress = Math.max(0, progress);
  } else if (status === "COMPLETED") {
    // leave progress as-is on update; new rows stay at 0 until episodes are known
  }

  await prisma.trackedAnime.upsert({
    where: { userId_anilistId: { userId: user.id, anilistId } },
    update: data,
    create: { userId: user.id, anilistId, status, progress: data.progress ?? 0 },
  });

  revalidatePath("/");
  revalidatePath("/my-list");
  revalidatePath("/search");
}

export async function updateEpisodeProgress(
  anilistId: number,
  progress: number,
  totalEpisodes: number | null
) {
  const user = await requireUser();

  const existing = await prisma.trackedAnime.findUnique({
    where: { userId_anilistId: { userId: user.id, anilistId } },
  });
  if (!existing) {
    throw new Error("Tracked anime not found.");
  }

  const capped =
    totalEpisodes != null && totalEpisodes > 0
      ? Math.min(Math.max(0, progress), totalEpisodes)
      : Math.max(0, progress);

  let status: WatchStatusValue = existing.status as WatchStatusValue;
  if (totalEpisodes != null && totalEpisodes > 0 && capped >= totalEpisodes) {
    status = "COMPLETED";
  } else if (capped > 0 && (status === "PLAN_TO_WATCH" || status === "COMPLETED")) {
    status = "WATCHING";
  }

  await prisma.trackedAnime.update({
    where: { userId_anilistId: { userId: user.id, anilistId } },
    data: { progress: capped, status },
  });

  revalidatePath("/");
  revalidatePath("/my-list");
  revalidatePath("/search");

  return { progress: capped, status };
}

export async function untrackAnime(anilistId: number) {
  const user = await requireUser();

  await prisma.trackedAnime.deleteMany({
    where: { userId: user.id, anilistId },
  });

  revalidatePath("/");
  revalidatePath("/my-list");
  revalidatePath("/search");
}
