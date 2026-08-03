import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import type { ApiHealth } from "@anilyst/types";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3000";

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
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

app.listen(port, () => {
  console.log(`Anilyst API listening on http://localhost:${port}`);
});
