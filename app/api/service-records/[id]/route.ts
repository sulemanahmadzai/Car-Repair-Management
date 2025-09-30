import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { serviceRecords } from "@/lib/db/schema";
import { getUser, getTeamForUser } from "@/lib/db/queries";
import { eq, and } from "drizzle-orm";

// GET /api/service-records/[id] - Get single service record
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const recordId = parseInt(params.id);
    const [record] = await db
      .select()
      .from(serviceRecords)
      .where(
        and(eq(serviceRecords.id, recordId), eq(serviceRecords.teamId, team.id))
      )
      .limit(1);

    if (!record) {
      return NextResponse.json(
        { error: "Service record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Failed to fetch service record:", error);
    return NextResponse.json(
      { error: "Failed to fetch service record" },
      { status: 500 }
    );
  }
}

// PUT /api/service-records/[id] - Update service record
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const recordId = parseInt(params.id);
    const body = await request.json();
    const {
      vehicleReg,
      serviceType,
      mileage,
      labourHours,
      partsUsed,
      notes,
      mediaFiles,
      status,
    } = body;

    const [updatedRecord] = await db
      .update(serviceRecords)
      .set({
        vehicleReg: vehicleReg ? vehicleReg.toUpperCase() : undefined,
        serviceType,
        mileage: mileage ? parseInt(mileage) : null,
        labourHours: labourHours ? parseInt(labourHours) : null,
        partsUsed,
        notes,
        mediaFiles,
        status,
        updatedAt: new Date(),
      })
      .where(
        and(eq(serviceRecords.id, recordId), eq(serviceRecords.teamId, team.id))
      )
      .returning();

    if (!updatedRecord) {
      return NextResponse.json(
        { error: "Service record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Failed to update service record:", error);
    return NextResponse.json(
      { error: "Failed to update service record" },
      { status: 500 }
    );
  }
}

// DELETE /api/service-records/[id] - Delete service record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const recordId = parseInt(params.id);
    await db
      .delete(serviceRecords)
      .where(
        and(eq(serviceRecords.id, recordId), eq(serviceRecords.teamId, team.id))
      );

    return NextResponse.json({
      message: "Service record deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete service record:", error);
    return NextResponse.json(
      { error: "Failed to delete service record" },
      { status: 500 }
    );
  }
}
