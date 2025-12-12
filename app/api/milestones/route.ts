import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Milestone from "@/models/Milestone";
import { sendError, sendSuccess } from "@/lib/api-utils";
import User from "@/models/User";

const getUserId = async () => {
  const user = await User.findOne();
  return user?._id;
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return sendError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const roleId = searchParams.get("roleId");
    const fetchAll = searchParams.get("all");

    let query: any = { userId };
    if (roleId) query.roleId = roleId;
    // if fetchAll is true, we just use { userId } which is already there

    const milestones = await Milestone.find(query).sort({ achievedAt: -1 });

    return sendSuccess(milestones);
  } catch (error) {
    return sendError((error as Error).message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return sendError("Unauthorized", 401);

    const body = await req.json();
    const milestone = await Milestone.create({ ...body, userId });

    return sendSuccess(milestone, 201);
  } catch (error) {
    console.error("Error creating milestone:", error);
    return sendError((error as Error).message, 500);
  }
}
