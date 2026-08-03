import type { Prisma, User } from "@prisma/client";
import { prisma } from "../../db/prisma";

export const authRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  createSession(data: { userId: string; refreshTokenHash: string; expiresAt: Date }) {
    return prisma.session.create({ data });
  },

  findSessionByRefreshHash(refreshTokenHash: string) {
    return prisma.session.findFirst({
      where: { refreshTokenHash },
      include: { user: true },
    });
  },

  deleteSessionById(id: string) {
    return prisma.session.delete({ where: { id } });
  },

  deleteSessionByRefreshHash(refreshTokenHash: string) {
    return prisma.session.deleteMany({ where: { refreshTokenHash } });
  },

  rotateSession(params: { sessionId: string; refreshTokenHash: string; expiresAt: Date }) {
    return prisma.session.update({
      where: { id: params.sessionId },
      data: {
        refreshTokenHash: params.refreshTokenHash,
        expiresAt: params.expiresAt,
      },
    });
  },
};
