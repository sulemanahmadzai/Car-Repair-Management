"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Phone,
  Car,
} from "lucide-react";
import Link from "next/link";

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

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchBookings();
  }, [page]);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, serviceFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `/api/bookings?page=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
      if (data.success) {
        setBookings(data.items);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.carReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Service filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter((booking) =>
        booking.services.includes(serviceFilter)
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons];
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
          statusColors[status as keyof typeof statusColors]
        }`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bookings Management
        </h1>
        <p className="text-gray-600">
          Manage and track all customer appointment bookings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">
                {bookings.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-blue-600">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {bookings.filter((b) => b.status === "completed").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, car reg..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="all">All Services</option>
            <option value="MOT">MOT</option>
            <option value="Servicing">Servicing</option>
            <option value="Diagnostics">Diagnostics</option>
            <option value="Repairs">Repairs</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Appointment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Calendar className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-lg font-medium">No bookings found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.firstName} {booking.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: #{booking.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {booking.email}
                        </p>
                        <p className="text-sm flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {booking.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="font-mono font-semibold text-gray-900">
                          {booking.carReg}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {booking.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {booking.bookDate}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {booking.bookTime}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/bookings/${booking.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={bookings.length < pageSize}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
