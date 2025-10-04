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
    const { desc } = await import("drizzle-orm");

    // Get all bookings (for admin dashboard), newest first
    const allBookings = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json({
      success: true,
      bookings: allBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
