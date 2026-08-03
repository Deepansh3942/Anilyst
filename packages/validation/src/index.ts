import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be at most 32 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
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
