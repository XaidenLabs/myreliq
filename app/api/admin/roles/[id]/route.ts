import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Role from "@/models/Role";
// import { requireRole } from "@/lib/auth-guards";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    // await requireRole(["ADMIN", "SUPERADMIN"]);
    const { id } = await params;

    const role = await Role.findById(id)
      .populate("userId", "email fullName")
      .populate("identityId", "name slug")
      .lean();

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    // await requireRole(["ADMIN", "SUPERADMIN"]);
    const { id } = await params;
    const body = await req.json();

    const role = await Role.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    // await requireRole(["ADMIN", "SUPERADMIN"]);
    const { id } = await params;

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
