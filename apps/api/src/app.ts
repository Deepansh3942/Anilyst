import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import type { ApiHealth } from "@anilyst/types";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./modules/auth/auth.routes";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    const payload: ApiHealth = {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
    res.json(payload);
  });

  app.get("/", (_req, res) => {
    res.json({
      name: "Anilyst API",
      version: "0.0.0",
      docs: "/health",
    });
  });

  app.use("/auth", authRouter);
  app.use(errorHandler);

  return app;
}
