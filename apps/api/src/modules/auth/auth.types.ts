import type { User } from "@anilyst/types";

export type PublicUser = User;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: PublicUser;
  tokens: AuthTokens;
};

export function toPublicUser(user: {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
