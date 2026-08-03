import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../lib/errors";
import { verifyAccessToken } from "../modules/auth/token";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing access token");
    }

    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      throw new UnauthorizedError("Missing access token");
    }

    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired access token"));
  }
}
