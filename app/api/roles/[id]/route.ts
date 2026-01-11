import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Role from "@/models/Role";
import { sendError, sendSuccess } from "@/lib/api-utils";
import { getUserFromCookies } from "@/lib/auth";

const getUserId = async () => {
  const user = await getUserFromCookies();
  return user?.id;
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return sendError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();

    // Ensure the role belongs to the user
    const role = await Role.findOne({ _id: id, userId });

    if (!role) {
      return sendError("Role not found or unauthorized", 404);
    }

    const updatedRole = await Role.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    return sendError((error as Error).message, 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return sendError("Unauthorized", 401);

    const { id } = await params;

    const role = await Role.findOneAndDelete({ _id: id, userId });

    if (!role) {
      return sendError("Role not found or unauthorized", 404);
    }

    return sendSuccess({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return sendError((error as Error).message, 500);
  }
}
