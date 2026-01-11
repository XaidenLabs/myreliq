import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Identity from "@/models/Identity";
// import { requireRole } from "@/lib/auth-guards";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // await requireRole(["ADMIN", "SUPERADMIN"]);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const query = userId ? { userId } : {};

    const identities = await Identity.find(query).sort({
      isPrimary: -1,
      createdAt: -1,
    });

    return NextResponse.json(identities);
  } catch (error) {
    console.error("Error fetching identities:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
