import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { serviceRecords } from "@/lib/db/schema";
import { getUser, getTeamForUser } from "@/lib/db/queries";
import { desc, eq, and, like, or } from "drizzle-orm";

// GET /api/service-records - Get all service records with optional filters
export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const vehicleReg = searchParams.get("vehicleReg");
    const serviceType = searchParams.get("serviceType");

    let query = db
      .select()
      .from(serviceRecords)
      .where(eq(serviceRecords.teamId, team.id));

    // Apply filters if provided
    const conditions = [eq(serviceRecords.teamId, team.id)];

    if (vehicleReg) {
      conditions.push(like(serviceRecords.vehicleReg, `%${vehicleReg}%`));
    }

    if (serviceType) {
      conditions.push(eq(serviceRecords.serviceType, serviceType));
    }

    const records = await db
      .select()
      .from(serviceRecords)
      .where(and(...conditions))
      .orderBy(desc(serviceRecords.createdAt));

    return NextResponse.json(records);
  } catch (error) {
    console.error("Failed to fetch service records:", error);
    return NextResponse.json(
      { error: "Failed to fetch service records" },
      { status: 500 }
    );
  }
}

// POST /api/service-records - Create new service record
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

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

    if (!vehicleReg || !serviceType) {
      return NextResponse.json(
        { error: "Vehicle registration and service type are required" },
        { status: 400 }
      );
    }

    const [newRecord] = await db
      .insert(serviceRecords)
      .values({
        teamId: team.id,
        vehicleReg: vehicleReg.toUpperCase(),
        serviceType,
        mileage: mileage ? parseInt(mileage) : null,
        labourHours: labourHours ? parseInt(labourHours) : null,
        partsUsed: partsUsed || [],
        notes: notes || null,
        mediaFiles: mediaFiles || [],
        status: status || "completed",
        createdBy: user.id,
      })
      .returning();

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Failed to create service record:", error);
    return NextResponse.json(
      { error: "Failed to create service record" },
      { status: 500 }
    );
  }
}
