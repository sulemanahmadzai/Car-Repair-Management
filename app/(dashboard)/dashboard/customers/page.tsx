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
  Car,
} from "lucide-react";
import useSWR from "swr";
import TableSkeleton from "@/components/dashboard/skeleton/TableSkeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Customer {
  id: number;
  name: string;
  mobileNumber: string;
  email: string | null;
  address: string | null;
  registrationNumber: string;
  make: string | null;
  model: string | null;
  colour: string | null;
  fuelType: string | null;
  motExpiry: string | null;
  taxDueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers, error, mutate } = useSWR("/api/customers", fetcher);

  const filteredCustomers = customers?.filter((customer: Customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.registrationNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobileNumber.includes(searchQuery);
    return matchesSearch;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      const response = await fetch(`/api/customers?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate();
      } else {
        alert("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Customer Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer database and vehicle information
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/customers/add")}
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Customer
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, mobile, or vehicle reg..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">
            Customers List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!customers ? (
            <TableSkeleton />
          ) : filteredCustomers?.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No customers found matching your search."
                  : "No customers yet. Add your first customer to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="border-b">
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Contact
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Vehicle
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Details
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
                  {filteredCustomers?.map((customer: Customer) => {
                    const motExpired =
                      customer.motExpiry &&
                      new Date(customer.motExpiry) < new Date();
                    const taxDue =
                      customer.taxDueDate &&
                      new Date(customer.taxDueDate) < new Date();

                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-semibold shadow-sm">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {customer.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {customer.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {customer.mobileNumber}
                            </p>
                            {customer.address && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {customer.address}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-mono font-semibold text-sm text-orange-600">
                              {customer.registrationNumber}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {customer.make && customer.model
                                ? `${customer.make} ${customer.model}`
                                : customer.make || customer.model || "-"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {customer.colour && (
                              <p className="text-xs">
                                <span className="text-muted-foreground">
                                  Colour:
                                </span>{" "}
                                <span className="text-foreground">
                                  {customer.colour}
                                </span>
                              </p>
                            )}
                            {customer.fuelType && (
                              <p className="text-xs">
                                <span className="text-muted-foreground">
                                  Fuel:
                                </span>{" "}
                                <span className="text-foreground">
                                  {customer.fuelType}
                                </span>
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            {customer.motExpiry && (
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold ${
                                  motExpired
                                    ? "border-red-400 text-red-700 bg-red-50"
                                    : "border-green-500 text-green-700 bg-green-50"
                                }`}
                              >
                                MOT: {customer.motExpiry}
                              </Badge>
                            )}
                            {customer.taxDueDate && (
                              <Badge
                                variant="outline"
                                className={`text-xs font-semibold ${
                                  taxDue
                                    ? "border-orange-400 text-orange-700 bg-orange-50"
                                    : "border-blue-500 text-blue-700 bg-blue-50"
                                }`}
                              >
                                Tax: {customer.taxDueDate}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/dashboard/customers/${customer.id}`
                                )
                              }
                              className="border-blue-400 text-blue-600 hover:bg-blue-50 hover:border-blue-500"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/dashboard/customers/edit/${customer.id}`
                                )
                              }
                              className="border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(customer.id)}
                              className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
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
    </div>
  );
}
