import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/errors";
import { env } from "../config/env";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Validation failed";
    res.status(400).json({
      message,
      code: "VALIDATION_ERROR",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    message: env.NODE_ENV === "production" ? "Internal server error" : String(error),
    code: "INTERNAL_ERROR",
  });
}
