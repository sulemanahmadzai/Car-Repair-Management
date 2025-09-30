"use client";

import { useState, useEffect } from "react";
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
  Filter,
  FileText,
} from "lucide-react";
import useSWR from "swr";
import TableSkeleton from "@/components/dashboard/skeleton/TableSkeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SERVICE_TYPES = [
  "All",
  "MOT",
  "Full Service",
  "Oil Change",
  "Brake Repair",
  "Custom",
];

export default function ServiceRecordsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const {
    data: records,
    error,
    mutate,
  } = useSWR("/api/service-records", fetcher);

  const filteredRecords = records?.filter((record: any) => {
    const matchesSearch =
      record.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "All" || record.serviceType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service record?")) {
      return;
    }

    try {
      const response = await fetch(`/api/service-records/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate();
      } else {
        alert("Failed to delete service record");
      }
    } catch (error) {
      console.error("Error deleting service record:", error);
      alert("Failed to delete service record");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Service Records
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all service and job records
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/service-records/add")}
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Record
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by vehicle reg or service type..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Service Type Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SERVICE_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={
                    selectedType === type
                      ? "bg-orange-500 hover:bg-orange-600"
                      : ""
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">
            Service Records List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!records ? (
            <TableSkeleton />
          ) : filteredRecords?.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || selectedType !== "All"
                  ? "No service records found matching your search."
                  : "No service records yet. Add your first record to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr className="border-b">
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Vehicle Reg
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Service Type
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Mileage
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-sm text-foreground">
                      Labour Hours
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
                  {filteredRecords?.map((record: any) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-foreground">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-sm text-orange-600">
                          {record.vehicleReg}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {record.serviceType}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {record.mileage ? `${record.mileage} mi` : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {record.labourHours ? `${record.labourHours}h` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600 bg-green-50 font-semibold"
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/dashboard/service-records/${record.id}`
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
                                `/dashboard/service-records/edit/${record.id}`
                              )
                            }
                            className="border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(record.id)}
                            className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
