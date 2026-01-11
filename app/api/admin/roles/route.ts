import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Role from "@/models/Role";
import User from "@/models/User";
import Identity from "@/models/Identity";
// import { requireRole } from "@/lib/auth-guards";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // await requireRole(["ADMIN", "SUPERADMIN"]);

    const roles = await Role.find()
      .populate("userId", "email fullName")
      .populate("identityId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    // await requireRole(["ADMIN", "SUPERADMIN"]);

    const body = await req.json();
    const {
      userId,
      identityId,
      title,
      organization,
      startDate,
      description,
      workMode,
    } = body;

    // Basic validation
    if (
      !userId ||
      !identityId ||
      !title ||
      !organization ||
      !startDate ||
      !description ||
      !workMode
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const role = await Role.create(body);

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
