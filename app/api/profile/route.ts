import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Profile from "@/models/Profile";
import { sendError, sendSuccess } from "@/lib/api-utils";
import User from "@/models/User";

// Mock Auth - Replace with real session logic in production
const getUserId = async () => {
  // For now, return the first user found or created as a mock "me"
  const user = await User.findOne();
  return user?._id;
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return sendError("Unauthorized", 401);

    const profile = await Profile.findOne({ userId });
    // if (!profile) return sendError("Profile not found", 404); // Changed to avoid console error

    return sendSuccess(profile);
  } catch (error) {
    return sendError((error as Error).message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return sendError("Unauthorized", 401);

    const body = await req.json();

    // Auto-generate shareSlug if not present and we have a name
    if (!body.shareSlug && body.fullName) {
      const baseSlug = body.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      // Simple uniqueness check could be done here or handled by duplicate key error
      // For now, let's append a random string to ensure uniqueness if we want to be safe,
      // or just accept the name. Let's try name first, and if it exists, maybe retrying?
      // Actually, cleaner is to just generate a unique one.
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      body.shareSlug = `${baseSlug}-${randomSuffix}`;
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: body },
      { new: true, upsert: true } // Create if doesn't exist
    );

    return sendSuccess(profile);
  } catch (error) {
    console.error("Profile update error:", error);
    return sendError((error as Error).message, 500);
  }
}
