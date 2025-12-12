import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Role from "@/models/Role";
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
    const identityId = searchParams.get("identityId");

    const query = { userId, ...(identityId && { identityId }) };
    const roles = await Role.find(query).sort({ startDate: -1 });

    return sendSuccess(roles);
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
    const role = await Role.create({ ...body, userId });

    return sendSuccess(role, 201);
  } catch (error) {
    console.error("Error creating role:", error);
    return sendError((error as Error).message, 500);
  }
}
