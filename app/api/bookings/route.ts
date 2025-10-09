import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { bookings } from "@/lib/db/schema";
import {
  getCached,
  invalidateBookingCache,
  CACHE_KEYS,
  CACHE_TTL,
} from "@/lib/cache";

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

    // Invalidate cache after creating booking
    await invalidateBookingCache();

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

    // Cache the count
    const count = await getCached(
      CACHE_KEYS.BOOKINGS_COUNT(),
      async () => {
        const [{ count }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(bookings);
        return Number(count);
      },
      CACHE_TTL.SHORT // Bookings change frequently
    );

    // Cache the items
    const items = await getCached(
      CACHE_KEYS.BOOKINGS(page, pageSize),
      async () => {
        return await db
          .select({
            id: bookings.id,
            firstName: bookings.firstName,
            lastName: bookings.lastName,
            phone: bookings.phone,
            email: bookings.email,
            carReg: bookings.carReg,
            services: bookings.services,
            bookDate: bookings.bookDate,
            bookTime: bookings.bookTime,
            message: bookings.message,
            status: bookings.status,
            createdAt: bookings.createdAt,
            // Exclude heavy fields: updatedAt
          })
          .from(bookings)
          .orderBy(desc(bookings.createdAt))
          .limit(pageSize)
          .offset(offset);
      },
      CACHE_TTL.SHORT // Bookings change frequently
    );

    return NextResponse.json({
      success: true,
      items,
      total: count,
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
