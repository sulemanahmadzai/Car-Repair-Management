import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { bookings } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      phone,
      email,
      carReg,
      services,
      bookDate,
      bookTime,
      message,
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !carReg ||
      !services ||
      !bookDate ||
      !bookTime
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate services array
    if (!Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one service" },
        { status: 400 }
      );
    }

    // Insert booking into database
    const [newBooking] = await db
      .insert(bookings)
      .values({
        firstName,
        lastName,
        phone,
        email,
        carReg,
        services,
        bookDate,
        bookTime,
        message: message || null,
        status: "pending",
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { desc, sql } = await import("drizzle-orm");
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const pageSize = Math.min(
      Math.max(parseInt(searchParams.get("pageSize") || "10"), 1),
      100
    );
    const offset = (page - 1) * pageSize;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings);

    // Get paginated bookings, newest first
    const items = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json({
      success: true,
      items,
      total: Number(count),
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
