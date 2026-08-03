import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import { env } from "../../config/env";

const ACCESS_TOKEN_TYPE = "access" as const;

export type AccessTokenPayload = {
  sub: string;
  email: string;
  username: string;
  typ: typeof ACCESS_TOKEN_TYPE;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "typ">): string {
  return jwt.sign({ ...payload, typ: ACCESS_TOKEN_TYPE }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  if (payload.typ !== ACCESS_TOKEN_TYPE) {
    throw new Error("Invalid access token type");
  }
  return payload;
}

export function refreshExpiresAt(from = new Date()): Date {
  const match = /^(\d+)([smhd])$/i.exec(env.JWT_REFRESH_EXPIRES_IN.trim());
  if (!match?.[1] || !match[2]) {
    return new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const dayMs = 24 * 60 * 60 * 1000;
  return new Date(from.getTime() + amount * (multipliers[unit] ?? dayMs));
}
