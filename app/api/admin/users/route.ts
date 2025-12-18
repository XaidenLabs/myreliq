import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Profile from "@/models/Profile";
import User from "@/models/User";
// import { requireRole } from "@/lib/auth-guards"; // Disabled for dev

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // await requireRole(["ADMIN", "SUPERADMIN"]);

    const profiles = await Profile.find()
      .populate("userId", "email role isSuspended createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    // await requireRole(["ADMIN", "SUPERADMIN"]);

    const body = await req.json();
    const { userId, isSuspended, action } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (action === "toggle_suspension") {
      const user = await User.findByIdAndUpdate(
        userId,
        { isSuspended: isSuspended },
        { new: true }
      ).select("-password");

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "User status updated", user });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
