import { NextResponse } from "next/server";
import {
  generateAccessToken,
  getRefreshTokenFromCookies,
  rotateSession,
  setAuthCookies,
} from "@/lib/auth";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  const refreshToken = await getRefreshTokenFromCookies();
  if (!refreshToken) {
    return NextResponse.json({ error: "Missing session" }, { status: 401 });
  }

  const rotated = await rotateSession({
    refreshToken,
    userAgent: request.headers.get("user-agent") ?? undefined,
    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
  });

  if (!rotated) {
    const response = NextResponse.json({ error: "Invalid session" }, { status: 401 });
    return response;
  }

  await connectDB();
  const user = await UserModel.findById(rotated.session.userId);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
  const response = NextResponse.json({
    data: { id: user._id.toString(), email: user.email, role: user.role },
  });
  setAuthCookies(response, { accessToken, refreshToken: rotated.newToken });
  return response;
}
