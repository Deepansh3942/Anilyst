import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const watchStatusSchema = z.enum([
  "WATCHING",
  "COMPLETED",
  "DROPPED",
  "PAUSED",
  "PLAN_TO_WATCH",
]);

export const upsertWatchListSchema = z.object({
  anilistId: z.number().int().positive(),
  status: watchStatusSchema,
  progress: z.number().int().min(0).optional(),
  score: z.number().min(0).max(10).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpsertWatchListInput = z.infer<typeof upsertWatchListSchema>;
