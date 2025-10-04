"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  Car,
  MessageSquare,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Save,
} from "lucide-react";

interface Booking {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  carReg: string;
  services: string[];
  bookDate: string;
  bookTime: string;
  message: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "confirmed", label: "Confirmed", color: "blue" },
  { value: "completed", label: "Completed", color: "green" },
  { value: "cancelled", label: "Cancelled", color: "red" },
];

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      const data = await response.json();
      if (data.success) {
        setBooking(data.booking);
        setSelectedStatus(data.booking.status);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!booking || selectedStatus === booking.status) return;

    setIsUpdating(true);
    setUpdateMessage({ type: null, text: "" });

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setBooking(data.booking);
        setUpdateMessage({
          type: "success",
          text: "Status updated successfully!",
        });
      } else {
        setUpdateMessage({
          type: "error",
          text: data.error || "Failed to update status",
        });
      }
    } catch (error) {
      setUpdateMessage({
        type: "error",
        text: "An error occurred while updating status",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The booking you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/dashboard/bookings")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/bookings")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          Booking Details #{booking.id}
        </h1>
        <p className="text-gray-600 mt-1">
          Created on {formatDateTime(booking.createdAt)}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Full Name
                </label>
                <p className="text-lg font-medium text-gray-900">
                  {booking.firstName} {booking.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Phone Number
                </label>
                <a
                  href={`tel:${booking.phone}`}
                  className="text-lg font-medium text-primary hover:underline flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {booking.phone}
                </a>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Email Address
                </label>
                <a
                  href={`mailto:${booking.email}`}
                  className="text-lg font-medium text-primary hover:underline flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {booking.email}
                </a>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Vehicle Information
            </h2>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">
                Registration Number
              </label>
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-gray-400" />
                <span className="text-2xl font-bold font-mono text-gray-900 bg-yellow-400 px-4 py-2 rounded border-2 border-black">
                  {booking.carReg}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Appointment Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Date
                </label>
                <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <Calendar className="w-5 h-5 text-primary" />
                  {booking.bookDate}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Time
                </label>
                <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <Clock className="w-5 h-5 text-primary" />
                  {booking.bookTime}
                </div>
              </div>
            </div>
          </div>

          {/* Services Requested */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Services Requested
            </h2>
            <div className="flex flex-wrap gap-3">
              {booking.services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-primary/10 text-primary text-base font-semibold rounded-lg border-2 border-primary/20"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Message */}
          {booking.message && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Additional Message
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {booking.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Status Management */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Status Management
            </h2>

            {/* Current Status */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">
                Current Status
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-lg font-semibold capitalize">
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Update Status */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">
                Update Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base font-medium"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Update Button */}
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdating || selectedStatus === booking.status}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Status
                </>
              )}
            </Button>

            {/* Update Message */}
            {updateMessage.type && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                  updateMessage.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {updateMessage.type === "success" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {updateMessage.text}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Quick Actions
              </h3>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`tel:${booking.phone}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`mailto:${booking.email}`)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Customer
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Booking Metadata
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDateTime(booking.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDateTime(booking.updatedAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Booking ID:</span>
                <span className="ml-2 font-mono font-medium text-gray-900">
                  #{booking.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
