"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const { data: staffList, error, mutate } = useSWR("/api/staff", fetcher);
  const staffMember = staffList?.find(
    (s: any) => s.id === parseInt(resolvedParams.id)
  );

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      const response = await fetch(`/api/staff?id=${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/staff");
      } else {
        alert("Failed to delete staff member");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member");
    }
  };

  if (!staffMember && !error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600">Failed to load staff member</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Staff Member Details
            </h1>
            <p className="text-muted-foreground mt-1">{staffMember.fullName}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() =>
              router.push(`/dashboard/staff/edit/${resolvedParams.id}`)
            }
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-400 to-blue-500 text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Full Name
                  </p>
                  <p className="text-foreground font-medium">
                    {staffMember.fullName}
                  </p>
                </div>
                {staffMember.gender && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">
                      Gender
                    </p>
                    <p className="text-foreground font-medium capitalize">
                      {staffMember.gender}
                    </p>
                  </div>
                )}
                {staffMember.dateOfBirth && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">
                      Date of Birth
                    </p>
                    <p className="text-foreground font-medium">
                      {staffMember.dateOfBirth}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </p>
                  <p className="text-foreground font-medium">
                    {staffMember.phoneNumber}
                  </p>
                </div>
                {staffMember.email && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </p>
                    <p className="text-foreground font-medium">
                      {staffMember.email}
                    </p>
                  </div>
                )}
                {staffMember.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </p>
                    <p className="text-foreground font-medium">
                      {staffMember.address}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-400 to-blue-500 text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staffMember.role && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">
                      Role
                    </p>
                    <p className="text-foreground font-medium">
                      {staffMember.role}
                    </p>
                  </div>
                )}
                {staffMember.department && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">
                      Department
                    </p>
                    <p className="text-foreground font-medium">
                      {staffMember.department}
                    </p>
                  </div>
                )}
                {staffMember.joiningDate && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joining Date
                    </p>
                    <p className="text-foreground font-medium">
                      {staffMember.joiningDate}
                    </p>
                  </div>
                )}
                {staffMember.shiftTime && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Shift Time
                    </p>
                    <p className="text-foreground font-medium">
                      {staffMember.shiftTime}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Tasks Completed
                  </p>
                  <p className="text-foreground font-medium">
                    {staffMember.tasksCompleted || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {(staffMember.emergencyContactName ||
            staffMember.emergencyContactPhone) && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-orange-400 to-blue-500 text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {staffMember.emergencyContactName && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">
                        Contact Name
                      </p>
                      <p className="text-foreground font-medium">
                        {staffMember.emergencyContactName}
                      </p>
                    </div>
                  )}
                  {staffMember.emergencyContactPhone && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">
                        Contact Phone
                      </p>
                      <p className="text-foreground font-medium">
                        {staffMember.emergencyContactPhone}
                      </p>
                    </div>
                  )}
                  {staffMember.relationship && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">
                        Relationship
                      </p>
                      <p className="text-foreground font-medium">
                        {staffMember.relationship}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  staffMember.status === "active"
                    ? "default"
                    : staffMember.status === "inactive"
                    ? "destructive"
                    : "secondary"
                }
                className={
                  staffMember.status === "active"
                    ? "bg-green-500 hover:bg-green-600 text-base px-4 py-2"
                    : "text-base px-4 py-2"
                }
              >
                {staffMember.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {(staffMember.salary ||
            staffMember.paymentType ||
            staffMember.lastPaymentDate) && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-orange-400 to-blue-500 text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {staffMember.salary && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">
                      Salary
                    </p>
                    <p className="text-foreground font-medium">
                      {staffMember.salary}
                    </p>
                  </div>
                )}
                {staffMember.paymentType && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">
                      Payment Type
                    </p>
                    <p className="text-foreground font-medium capitalize">
                      {staffMember.paymentType}
                    </p>
                  </div>
                )}
                {staffMember.lastPaymentDate && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">
                      Last Payment
                    </p>
                    <p className="text-foreground font-medium">
                      {staffMember.lastPaymentDate}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Created At
                </p>
                <p className="text-foreground font-medium text-sm">
                  {new Date(staffMember.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Last Updated
                </p>
                <p className="text-foreground font-medium text-sm">
                  {new Date(staffMember.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
