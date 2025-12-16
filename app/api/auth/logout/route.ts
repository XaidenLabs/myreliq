import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeSessionByToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  // Revoke session if refresh token exists
  const refreshToken = cookieStore.get("myreliq_refresh")?.value;
  if (refreshToken) {
    await revokeSessionByToken(refreshToken);
  }

  // Clear cookies
  cookieStore.delete("myreliq_access");
  cookieStore.delete("myreliq_refresh");

  return NextResponse.json({ message: "Logged out successfully" });
}
