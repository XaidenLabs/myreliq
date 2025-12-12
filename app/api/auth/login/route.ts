import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import {
  createSession,
  generateAccessToken,
  setAuthCookies,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const payload = await request.json();
  const email = payload?.email?.toLowerCase().trim();
  const password = payload?.password;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  await connectDB();
  const user = await UserModel.findOne({ email });
  if (!user || user.isSuspended) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const refreshToken = await createSession({
    userId: user._id.toString(),
    userAgent: request.headers.get("user-agent") ?? undefined,
    ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
  });
  const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });

  const redirectTo = user.role === "ADMIN" || user.role === "SUPERADMIN" ? "/admin" : "/dashboard";

  const response = NextResponse.json({
    data: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    redirectTo,
  });

  setAuthCookies(response, { accessToken, refreshToken });
  return response;
}
