import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { staff } from "@/lib/db/schema";
import { getUser } from "@/lib/db/queries";
import { eq, and, desc, sql } from "drizzle-orm";

// GET all staff for the user's team
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's team
    const teamMember = await db.query.teamMembers.findFirst({
      where: (teamMembers, { eq }) => eq(teamMembers.userId, user.id),
    });

    if (!teamMember) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const pageSize = Math.min(
      Math.max(parseInt(searchParams.get("pageSize") || "10"), 1),
      100
    );
    const offset = (page - 1) * pageSize;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(staff)
      .where(eq(staff.teamId, teamMember.teamId));

    // Get paginated staff for this team
    const items = await db
      .select()
      .from(staff)
      .where(eq(staff.teamId, teamMember.teamId))
      .orderBy(desc(staff.createdAt))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json({ items, total: Number(count), page, pageSize });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

// POST - Create new staff member
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's team
    const teamMember = await db.query.teamMembers.findFirst({
      where: (teamMembers, { eq }) => eq(teamMembers.userId, user.id),
    });

    if (!teamMember) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      fullName,
      gender,
      dateOfBirth,
      phoneNumber,
      email,
      address,
      role,
      department,
      joiningDate,
      status: staffStatus,
      shiftTime,
      salary,
      paymentType,
      lastPaymentDate,
      tasksCompleted,
      emergencyContactName,
      emergencyContactPhone,
      relationship,
    } = body;

    // Validate required fields
    if (!fullName || !phoneNumber) {
      return NextResponse.json(
        { error: "Full name and phone number are required" },
        { status: 400 }
      );
    }

    // Create staff member
    const [newStaff] = await db
      .insert(staff)
      .values({
        teamId: teamMember.teamId,
        fullName,
        gender,
        dateOfBirth,
        phoneNumber,
        email,
        address,
        role,
        department,
        joiningDate,
        status: staffStatus || "active",
        shiftTime,
        salary,
        paymentType,
        lastPaymentDate,
        tasksCompleted,
        emergencyContactName,
        emergencyContactPhone,
        relationship,
      })
      .returning();

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { error: "Failed to create staff member" },
      { status: 500 }
    );
  }
}

// PUT - Update staff member
export async function PUT(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's team
    const teamMember = await db.query.teamMembers.findFirst({
      where: (teamMembers, { eq }) => eq(teamMembers.userId, user.id),
    });

    if (!teamMember) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    // Update staff member (only if it belongs to the user's team)
    const [updatedStaff] = await db
      .update(staff)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(staff.id, id), eq(staff.teamId, teamMember.teamId)))
      .returning();

    if (!updatedStaff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { error: "Failed to update staff member" },
      { status: 500 }
    );
  }
}

// DELETE - Delete staff member
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's team
    const teamMember = await db.query.teamMembers.findFirst({
      where: (teamMembers, { eq }) => eq(teamMembers.userId, user.id),
    });

    if (!teamMember) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    // Delete staff member (only if it belongs to the user's team)
    const [deletedStaff] = await db
      .delete(staff)
      .where(
        and(eq(staff.id, parseInt(id)), eq(staff.teamId, teamMember.teamId))
      )
      .returning();

    if (!deletedStaff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { error: "Failed to delete staff member" },
      { status: 500 }
    );
  }
}
