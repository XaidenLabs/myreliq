import { NextResponse } from "next/server";
import { clearAuthCookies, getRefreshTokenFromCookies, revokeSessionByToken } from "@/lib/auth";

export async function POST() {
  const refreshToken = await getRefreshTokenFromCookies();
  if (refreshToken) {
    await revokeSessionByToken(refreshToken);
  }
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
