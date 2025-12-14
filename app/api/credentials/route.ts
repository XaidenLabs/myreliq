import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Credential from "@/models/Credential";
import { sendError, sendSuccess } from "@/lib/api-utils";
import { getUserFromCookies } from "@/lib/auth";

const getUserId = async () => {
  const user = await getUserFromCookies();
  return user?.id;
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return sendError("Unauthorized", 401);

    const credentials = await Credential.find({ userId }).sort({
      createdAt: -1,
    });
    return sendSuccess(credentials);
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
    const credential = await Credential.create({ ...body, userId });

    return sendSuccess(credential, 201);
  } catch (error) {
    return sendError((error as Error).message, 500);
  }
}
