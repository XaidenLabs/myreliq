import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Identity from "@/models/Identity";
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

    const identities = await Identity.find({ userId }).sort({ createdAt: -1 });
    return sendSuccess(identities);
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

    if (!body.name) {
      return sendError("Identity name is required", 400);
    }

    // Auto-generate slug if not provided
    // sanitize slug to be safe
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    try {
      const identity = await Identity.create({ ...body, userId, slug });
      return sendSuccess(identity, 201);
    } catch (dbError: any) {
      // Handle Duplicate Key Error (MongoDB Code 11000)
      if (dbError.code === 11000) {
        console.error("Duplicate Identity Slug:", slug);
        // Attempt to make it unique by appending random string, or just return error
        // For better UX, let's return a specific error so client can handle or we auto-fix
        // Let's try to auto-fix once
        const newSlug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        const identity = await Identity.create({
          ...body,
          userId,
          slug: newSlug,
        });
        return sendSuccess(identity, 201);
      }
      throw dbError; // Rethrow if not duplicate key
    }
  } catch (error) {
    console.error("Identity creation error:", error);
    return sendError((error as Error).message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return sendError("Unauthorized", 401);

    const body = await req.json();
    const { id, mintAddress, metadataUri, ...updateData } = body;

    if (!id) return sendError("Identity ID required", 400);

    const identity = await Identity.findOneAndUpdate(
      { _id: id, userId },
      {
        ...updateData,
        ...(mintAddress && { mintAddress }),
        ...(metadataUri && { metadataUri }),
      },
      { new: true }
    );

    if (!identity) return sendError("Identity not found", 404);

    return sendSuccess(identity);
  } catch (error) {
    return sendError((error as Error).message, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return sendError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return sendError("Identity ID required", 400);

    const identity = await Identity.findOneAndDelete({ _id: id, userId });

    if (!identity) return sendError("Identity not found", 404);

    return sendSuccess({ message: "Identity deleted successfully" });
  } catch (error) {
    return sendError((error as Error).message, 500);
  }
}
