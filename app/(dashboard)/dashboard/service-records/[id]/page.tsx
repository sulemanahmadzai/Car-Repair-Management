"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Car,
  Wrench,
  Clock,
  FileText,
  Package,
  Image as ImageIcon,
  DollarSign,
  Users,
} from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ServiceRecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const { data: record, error } = useSWR(
    `/api/service-records/${resolvedParams.id}`,
    fetcher
  );

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service record?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(
        `/api/service-records/${resolvedParams.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        router.push("/dashboard/service-records");
      } else {
        alert("Failed to delete service record");
        setDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting service record:", error);
      alert("Failed to delete service record");
      setDeleting(false);
    }
  };

  if (!record) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600">Failed to load service record</p>
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
              Service Record Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Record ID: #{record.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/dashboard/service-records/edit/${record.id}`)
            }
            className="border-orange-400 text-orange-600 hover:bg-orange-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="border-red-400 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {record.vehicleReg}
              </CardTitle>
              <p className="text-orange-50 mt-1">{record.serviceType}</p>
            </div>
            <Badge className="bg-white text-green-600 hover:bg-white font-semibold px-4 py-2 text-sm">
              {record.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {new Date(record.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {record.mileage ? `${record.mileage} miles` : "Not recorded"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Labour Hours</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {record.labourHours
                    ? `${record.labourHours} hours`
                    : "Not recorded"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Type</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {record.serviceType}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parts Used */}
      {record.partsUsed && record.partsUsed.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-xl font-semibold">
                Parts Used
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {record.partsUsed.map((part: string, index: number) => (
                <div
                  key={index}
                  className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-lg font-medium"
                >
                  {part}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {record.notes && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl font-semibold">
                Notes & Diagnosis
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {record.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cost & Staff Info */}
      {(record.totalCost ||
        (record.assignedStaff && record.assignedStaff.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {record.totalCost && (
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-xl font-semibold">
                    Total Cost
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-green-600">
                  £{record.totalCost}
                </p>
              </CardContent>
            </Card>
          )}

          {record.assignedStaff && record.assignedStaff.length > 0 && (
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-xl font-semibold">
                    Assigned Staff
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-lg font-medium text-foreground">
                  {record.assignedStaff.length} staff member
                  {record.assignedStaff.length > 1 ? "s" : ""} assigned
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Before Service Images */}
      {record.beforeImages && record.beforeImages.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-600" />
              <CardTitle className="text-xl font-semibold">
                Before Service Images ({record.beforeImages.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {record.beforeImages.map((image: string, index: number) => {
                if (!image || image.trim() === "") {
                  return null;
                }
                return (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Before service ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 hover:border-orange-400 transition-all cursor-pointer"
                      onClick={() => window.open(image, "_blank")}
                      onError={(e) => {
                        console.error(
                          "Failed to load image:",
                          image.substring(0, 100)
                        );
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBGYWlsZWQ8L3RleHQ+PC9zdmc+";
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* After Service Images */}
      {record.afterImages && record.afterImages.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-green-600" />
              <CardTitle className="text-xl font-semibold">
                After Service Images ({record.afterImages.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {record.afterImages.map((image: string, index: number) => {
                if (!image || image.trim() === "") {
                  return null;
                }
                return (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`After service ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 hover:border-green-400 transition-all cursor-pointer"
                      onClick={() => window.open(image, "_blank")}
                      onError={(e) => {
                        console.error(
                          "Failed to load image:",
                          image.substring(0, 100)
                        );
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBGYWlsZWQ8L3RleHQ+PC9zdmc+";
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">
            Record Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2 text-foreground font-medium">
                {new Date(record.createdAt).toLocaleString("en-GB")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="ml-2 text-foreground font-medium">
                {new Date(record.updatedAt).toLocaleString("en-GB")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
