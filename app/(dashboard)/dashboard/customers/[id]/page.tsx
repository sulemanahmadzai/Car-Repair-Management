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
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Wrench,
  Fuel,
  Palette,
} from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const { data: customer, error } = useSWR(
    `/api/customers?id=${resolvedParams.id}`,
    fetcher
  );

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/customers?id=${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/customers");
      } else {
        alert("Failed to delete customer");
        setDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer");
      setDeleting(false);
    }
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600">Failed to load customer</p>
      </div>
    );
  }

  const motExpired =
    customer.motExpiry && new Date(customer.motExpiry) < new Date();
  const taxDue =
    customer.taxDueDate && new Date(customer.taxDueDate) < new Date();

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
              Customer Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Customer ID: #{customer.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/dashboard/customers/edit/${customer.id}`)
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
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {customer.name}
                </CardTitle>
                <p className="text-orange-50 mt-1">
                  {customer.email || "No email provided"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-orange-50 text-sm">Customer Since</p>
              <p className="text-white font-semibold">
                {new Date(customer.createdAt).toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {customer.mobileNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {customer.email || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {customer.address || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {new Date(customer.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-xl font-semibold">
              Vehicle Information
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration</p>
                <p className="text-base font-semibold text-orange-600 font-mono">
                  {customer.registrationNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Make & Model</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {customer.make && customer.model
                    ? `${customer.make} ${customer.model}`
                    : customer.make || customer.model || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Colour</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {customer.colour || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Fuel className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {customer.fuelType || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MOT & Tax Status */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">
            MOT & Tax Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">MOT Expiry</p>
                <p className="text-lg font-semibold text-foreground">
                  {customer.motExpiry
                    ? new Date(customer.motExpiry).toLocaleDateString("en-GB")
                    : "Not recorded"}
                </p>
              </div>
              {customer.motExpiry && (
                <Badge
                  variant="outline"
                  className={`text-sm font-semibold ${
                    motExpired
                      ? "border-red-400 text-red-700 bg-red-50"
                      : "border-green-500 text-green-700 bg-green-50"
                  }`}
                >
                  {motExpired ? "Expired" : "Valid"}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Tax Due Date</p>
                <p className="text-lg font-semibold text-foreground">
                  {customer.taxDueDate
                    ? new Date(customer.taxDueDate).toLocaleDateString("en-GB")
                    : "Not recorded"}
                </p>
              </div>
              {customer.taxDueDate && (
                <Badge
                  variant="outline"
                  className={`text-sm font-semibold ${
                    taxDue
                      ? "border-orange-400 text-orange-700 bg-orange-50"
                      : "border-blue-500 text-blue-700 bg-blue-50"
                  }`}
                >
                  {taxDue ? "Due" : "Paid"}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
                {new Date(customer.createdAt).toLocaleString("en-GB")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="ml-2 text-foreground font-medium">
                {new Date(customer.updatedAt).toLocaleString("en-GB")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
