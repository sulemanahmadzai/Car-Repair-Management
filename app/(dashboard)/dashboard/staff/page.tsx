"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  Phone,
  Mail,
  Briefcase,
} from "lucide-react";
import useSWR from "swr";
import TableSkeleton from "@/components/dashboard/skeleton/TableSkeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Staff {
  id: number;
  fullName: string;
  gender: string | null;
  dateOfBirth: string | null;
  phoneNumber: string;
  email: string | null;
  address: string | null;
  role: string | null;
  department: string | null;
  joiningDate: string | null;
  status: string;
  shiftTime: string | null;
  salary: string | null;
  paymentType: string | null;
  lastPaymentDate: string | null;
  tasksCompleted: number | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  relationship: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function StaffPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, error, mutate } = useSWR(
    `/api/staff?page=${page}&pageSize=${pageSize}`,
    fetcher
  );

  const filteredStaff = data?.items?.filter((member: Staff) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phoneNumber.includes(searchQuery) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      const response = await fetch(`/api/staff?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate();
      } else {
        alert("Failed to delete staff member");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Staff Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your staff members and their information
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/staff/add")}
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, phone, role, or department..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">Staff List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!data ? (
            <TableSkeleton />
          ) : filteredStaff?.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No staff members found matching your search."
                  : "No staff members yet. Add your first staff member to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="border-b">
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Staff Member
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Contact
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Position
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Employment
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStaff?.map((member: Staff) => {
                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-semibold shadow-sm">
                              {member.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {member.fullName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {member.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-foreground flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {member.phoneNumber}
                            </p>
                            {member.address && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {member.address}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {member.role || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.department || "No department"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {member.joiningDate || "N/A"}
                            </p>
                            {member.shiftTime && (
                              <p className="text-xs text-muted-foreground">
                                {member.shiftTime}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              member.status === "active"
                                ? "default"
                                : member.status === "inactive"
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              member.status === "active"
                                ? "bg-green-500 hover:bg-green-600"
                                : ""
                            }
                          >
                            {member.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/dashboard/staff/${member.id}`)
                              }
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/dashboard/staff/edit/${member.id}`
                                )
                              }
                              className="hover:bg-orange-50 hover:text-orange-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(member.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of{" "}
            {Math.max(1, Math.ceil((data.total || 0) / pageSize))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const totalPages = Math.max(
                  1,
                  Math.ceil((data.total || 0) / pageSize)
                );
                setPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={
                page >= Math.max(1, Math.ceil((data.total || 0) / pageSize))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
