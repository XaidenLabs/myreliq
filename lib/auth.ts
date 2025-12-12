import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import SessionModel from "@/models/Session";
import UserModel from "@/models/User";
import { connectDB } from "./db";
import type { User, UserRole } from "./types";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not set");
}

const ACCESS_TOKEN_TTL_SECONDS = 60 * 15; // 15 minutes
const REFRESH_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

const ACCESS_COOKIE_NAME = "myreliq_access";
const REFRESH_COOKIE_NAME = "myreliq_refresh";

export const hashPassword = async (password: string) =>
  argon2.hash(password, { type: argon2.argon2id });

export const verifyPassword = async (hash: string, password: string) =>
  argon2.verify(hash, password);

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export const generateAccessToken = (payload: { userId: string; role: UserRole }) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL_SECONDS });

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string; role: UserRole };
  } catch {
    return null;
  }
};

export const setAuthCookies = (
  response: NextResponse,
  {
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  },
) => {
  response.cookies.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });
  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: REFRESH_TOKEN_TTL_MS / 1000,
  });
};

export const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set(ACCESS_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
};

export const createSession = async (params: {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
}) => {
  await connectDB();
  const refreshToken = randomBytes(48).toString("hex");
  const hash = hashToken(refreshToken);
  await SessionModel.create({
    userId: params.userId,
    refreshTokenHash: hash,
    userAgent: params.userAgent,
    ipAddress: params.ipAddress,
  });
  return refreshToken;
};

export const rotateSession = async ({
  refreshToken,
  userAgent,
  ipAddress,
}: {
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
}) => {
  await connectDB();
  const hashed = hashToken(refreshToken);
  const session = await SessionModel.findOne({ refreshTokenHash: hashed, revokedAt: null });
  if (!session) {
    return null;
  }
  const newToken = randomBytes(48).toString("hex");
  session.refreshTokenHash = hashToken(newToken);
  session.userAgent = userAgent ?? session.userAgent;
  session.ipAddress = ipAddress ?? session.ipAddress;
  session.updatedAt = new Date();
  await session.save();
  return { session, newToken };
};

export const revokeSessionByToken = async (refreshToken: string) => {
  await connectDB();
  const hashed = hashToken(refreshToken);
  await SessionModel.updateOne(
    { refreshTokenHash: hashed, revokedAt: null },
    { revokedAt: new Date() },
  );
};

export const getUserFromCookies = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  if (!access) {
    return null;
  }
  const payload = verifyAccessToken(access);
  if (!payload) {
    return null;
  }
  await connectDB();
  const userDoc = await UserModel.findById(payload.userId);
  if (!userDoc) {
    return null;
  }
  return {
    id: userDoc._id.toString(),
    email: userDoc.email,
    firstName: userDoc.firstName ?? undefined,
    lastName: userDoc.lastName ?? undefined,
    role: userDoc.role,
    emailVerified: userDoc.emailVerified,
    isSuspended: userDoc.isSuspended,
    createdAt: userDoc.createdAt?.toISOString() ?? "",
    updatedAt: userDoc.updatedAt?.toISOString() ?? "",
  };
};

export const getRefreshTokenFromCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
};
