import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { customers } from "@/lib/db/schema";
import { getUser } from "@/lib/db/queries";
import { eq, and, desc, sql } from "drizzle-orm";

// GET all customers for the user's team
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
      .from(customers)
      .where(eq(customers.teamId, teamMember.teamId));

    // Get paginated customers for this team
    const items = await db
      .select()
      .from(customers)
      .where(eq(customers.teamId, teamMember.teamId))
      .orderBy(desc(customers.createdAt))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json({ items, total: Number(count), page, pageSize });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST - Create new customer
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
      name,
      mobileNumber,
      email,
      address,
      registrationNumber,
      make,
      model,
      colour,
      fuelType,
      motExpiry,
      taxDueDate,
    } = body;

    // Validate required fields
    if (!name || !mobileNumber || !registrationNumber) {
      return NextResponse.json(
        { error: "Name, mobile number, and registration number are required" },
        { status: 400 }
      );
    }

    // Create customer
    const [newCustomer] = await db
      .insert(customers)
      .values({
        teamId: teamMember.teamId,
        name,
        mobileNumber,
        email,
        address,
        registrationNumber: registrationNumber.toUpperCase(),
        make,
        model,
        colour,
        fuelType,
        motExpiry,
        taxDueDate,
      })
      .returning();

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

// PUT - Update customer
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
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Ensure registration number is uppercase if provided
    if (updateData.registrationNumber) {
      updateData.registrationNumber =
        updateData.registrationNumber.toUpperCase();
    }

    // Update customer (only if it belongs to the user's team)
    const [updatedCustomer] = await db
      .update(customers)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(customers.id, id), eq(customers.teamId, teamMember.teamId)))
      .returning();

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE - Delete customer
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
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // Delete customer (only if it belongs to the user's team)
    const [deletedCustomer] = await db
      .delete(customers)
      .where(
        and(
          eq(customers.id, parseInt(id)),
          eq(customers.teamId, teamMember.teamId)
        )
      )
      .returning();

    if (!deletedCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
