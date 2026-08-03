import type { User } from "@anilyst/types";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "username">;
    }
  }
}

export {};
