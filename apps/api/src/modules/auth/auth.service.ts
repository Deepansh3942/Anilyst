import type { LoginInput, RegisterInput } from "@anilyst/validation";
import { ConflictError, UnauthorizedError } from "../../lib/errors";
import { authRepository } from "./auth.repository";
import type { AuthResponse, PublicUser } from "./auth.types";
import { toPublicUser } from "./auth.types";
import {
  createRefreshToken,
  hashPassword,
  hashToken,
  refreshExpiresAt,
  signAccessToken,
  verifyPassword,
} from "./token";

async function issueAuthResponse(user: {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}): Promise<AuthResponse> {
  const refreshToken = createRefreshToken();
  await authRepository.createSession({
    userId: user.id,
    refreshTokenHash: hashToken(refreshToken),
    expiresAt: refreshExpiresAt(),
  });

  return {
    user: toPublicUser(user),
    tokens: {
      accessToken: signAccessToken({
        sub: user.id,
        email: user.email,
        username: user.username,
      }),
      refreshToken,
    },
  };
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();
    const username = input.username.trim();

    const [existingEmail, existingUsername] = await Promise.all([
      authRepository.findByEmail(email),
      authRepository.findByUsername(username),
    ]);

    if (existingEmail) {
      throw new ConflictError("An account with this email already exists");
    }
    if (existingUsername) {
      throw new ConflictError("This username is already taken");
    }

    const user = await authRepository.createUser({
      email,
      username,
      passwordHash: await hashPassword(input.password),
    });

    return issueAuthResponse(user);
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();
    const user = await authRepository.findByEmail(email);

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return issueAuthResponse(user);
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const session = await authRepository.findSessionByRefreshHash(hashToken(refreshToken));
    if (!session || session.expiresAt.getTime() < Date.now()) {
      if (session) {
        await authRepository.deleteSessionById(session.id);
      }
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const nextRefreshToken = createRefreshToken();
    await authRepository.rotateSession({
      sessionId: session.id,
      refreshTokenHash: hashToken(nextRefreshToken),
      expiresAt: refreshExpiresAt(),
    });

    return {
      user: toPublicUser(session.user),
      tokens: {
        accessToken: signAccessToken({
          sub: session.user.id,
          email: session.user.email,
          username: session.user.username,
        }),
        refreshToken: nextRefreshToken,
      },
    };
  },

  async logout(refreshToken: string): Promise<void> {
    await authRepository.deleteSessionByRefreshHash(hashToken(refreshToken));
  },

  async me(userId: string): Promise<PublicUser> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }
    return toPublicUser(user);
  },
};
