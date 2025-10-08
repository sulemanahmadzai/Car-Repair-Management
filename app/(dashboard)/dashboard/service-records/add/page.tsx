"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  X,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const SERVICE_TYPES = [
  "MOT",
  "Full Service",
  "Oil Change",
  "Brake Repair",
  "Custom",
];

const SERVICE_STATUS = [
  "pending",
  "assigned",
  "in-progress",
  "completed",
  "on-hold",
];

interface CustomerData {
  id: number;
  name: string;
  mobileNumber: string;
  make: string | null;
  model: string | null;
  colour: string | null;
  fuelType: string | null;
  motExpiry: string | null;
  taxDueDate: string | null;
}

interface StaffMember {
  id: number;
  fullName: string;
  status: string;
}

export default function AddServiceRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingCustomer, setFetchingCustomer] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [customerNotFound, setCustomerNotFound] = useState(false);
  const [formData, setFormData] = useState({
    vehicleReg: "",
    serviceType: "",
    mileage: "",
    labourHours: "",
    notes: "",
    totalCost: "",
    status: "pending",
  });
  const [parts, setParts] = useState<string[]>([]);
  const [newPart, setNewPart] = useState("");
  const [beforeImages, setBeforeImages] = useState<string[]>([]);
  const [afterImages, setAfterImages] = useState<string[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<number[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  // Fetch active staff members on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("/api/staff");
        if (response.ok) {
          const data = await response.json();
          // Filter only active staff
          const activeStaff = data.filter(
            (s: StaffMember) => s.status === "active"
          );
          setStaffList(activeStaff);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  // Fetch customer data when vehicle registration changes
  useEffect(() => {
    const fetchCustomerByRegistration = async () => {
      if (!formData.vehicleReg || formData.vehicleReg.length < 3) {
        setCustomerData(null);
        setCustomerNotFound(false);
        return;
      }

      setFetchingCustomer(true);
      setCustomerNotFound(false);

      try {
        const response = await fetch(
          `/api/customers/by-registration?registrationNumber=${encodeURIComponent(
            formData.vehicleReg
          )}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.found && data.customer) {
            setCustomerData(data.customer);
            setCustomerNotFound(false);
          }
        } else if (response.status === 404) {
          setCustomerData(null);
          setCustomerNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        setCustomerData(null);
      } finally {
        setFetchingCustomer(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchCustomerByRegistration, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.vehicleReg]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Compress and resize image before converting to base64
      const reader = new FileReader();
      reader.onloadend = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to resize image
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const base64 = canvas.toDataURL("image/jpeg", 0.7); // 70% quality

          if (type === "before") {
            setBeforeImages((prev) => [...prev, base64]);
          } else {
            setAfterImages((prev) => [...prev, base64]);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, type: "before" | "after") => {
    if (type === "before") {
      setBeforeImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAfterImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const toggleStaffAssignment = (staffId: number) => {
    setAssignedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        partsUsed: parts,
        beforeImages,
        afterImages,
        assignedStaff,
      };

      console.log("Submitting service record with:", {
        ...payload,
        beforeImages: `${beforeImages.length} images`,
        afterImages: `${afterImages.length} images`,
      });

      const response = await fetch("/api/service-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Service record created:", data);
        router.push("/dashboard/service-records");
      } else {
        const error = await response.json();
        console.error("API error:", error);
        alert(error.error || "Failed to create service record");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating service record:", error);
      alert(
        `Failed to create service record: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setLoading(false);
    }
  };

  const addPart = () => {
    if (newPart.trim()) {
      setParts([...parts, newPart.trim()]);
      setNewPart("");
    }
  };

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
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
            Add Service Record
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new service or job record
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl font-semibold">
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Basic Information
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label
                    htmlFor="vehicleReg"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Vehicle Registration Number *
                  </Label>
                  <div className="relative">
                    <Input
                      id="vehicleReg"
                      value={formData.vehicleReg}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicleReg: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g., AB12 CDE"
                      className="h-11"
                      required
                    />
                    {fetchingCustomer && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                      </div>
                    )}
                  </div>

                  {/* Customer Found Message */}
                  {customerData && !fetchingCustomer && (
                    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-800 mb-2">
                            Customer Found
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">
                                Name:
                              </span>{" "}
                              <span className="text-gray-900">
                                {customerData.name}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Mobile:
                              </span>{" "}
                              <span className="text-gray-900">
                                {customerData.mobileNumber}
                              </span>
                            </div>
                            {customerData.make && (
                              <div>
                                <span className="font-medium text-gray-700">
                                  Make:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {customerData.make}
                                </span>
                              </div>
                            )}
                            {customerData.model && (
                              <div>
                                <span className="font-medium text-gray-700">
                                  Model:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {customerData.model}
                                </span>
                              </div>
                            )}
                            {customerData.colour && (
                              <div>
                                <span className="font-medium text-gray-700">
                                  Colour:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {customerData.colour}
                                </span>
                              </div>
                            )}
                            {customerData.fuelType && (
                              <div>
                                <span className="font-medium text-gray-700">
                                  Fuel Type:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {customerData.fuelType}
                                </span>
                              </div>
                            )}
                            {customerData.motExpiry && (
                              <div>
                                <span className="font-medium text-gray-700">
                                  MOT Expiry:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {customerData.motExpiry}
                                </span>
                              </div>
                            )}
                            {customerData.taxDueDate && (
                              <div>
                                <span className="font-medium text-gray-700">
                                  Tax Due Date:
                                </span>{" "}
                                <span className="text-gray-900">
                                  {customerData.taxDueDate}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Not Found Message */}
                  {customerNotFound && !fetchingCustomer && (
                    <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            Customer Not Found
                          </p>
                          <p className="text-sm text-red-700">
                            No customer exists with this registration number.
                            Please add the customer first.
                          </p>
                          <Button
                            type="button"
                            onClick={() => router.push("/dashboard/customers")}
                            variant="outline"
                            size="sm"
                            className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                          >
                            Go to Customers
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="serviceType"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Service Type *
                  </Label>
                  <select
                    id="serviceType"
                    value={formData.serviceType}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceType: e.target.value })
                    }
                    className="h-11 w-full px-3 rounded-md border border-input bg-background text-sm"
                    required
                  >
                    <option value="">Select service type</option>
                    {SERVICE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="mileage"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Mileage
                  </Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) =>
                      setFormData({ ...formData, mileage: e.target.value })
                    }
                    placeholder="e.g., 45000"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="labourHours"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Labour Hours
                  </Label>
                  <Input
                    id="labourHours"
                    type="number"
                    step="0.5"
                    value={formData.labourHours}
                    onChange={(e) =>
                      setFormData({ ...formData, labourHours: e.target.value })
                    }
                    placeholder="e.g., 2.5"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="totalCost"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Total Cost
                  </Label>
                  <Input
                    id="totalCost"
                    value={formData.totalCost}
                    onChange={(e) =>
                      setFormData({ ...formData, totalCost: e.target.value })
                    }
                    placeholder="e.g., £250.00"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="status"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="h-11 w-full px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {SERVICE_STATUS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Staff Assignment */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Assign Staff
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="space-y-3">
                {staffList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No active staff members available
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {staffList.map((staff) => (
                      <div
                        key={staff.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          assignedStaff.includes(staff.id)
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                        onClick={() => toggleStaffAssignment(staff.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              assignedStaff.includes(staff.id)
                                ? "border-orange-500 bg-orange-500"
                                : "border-gray-300"
                            }`}
                          >
                            {assignedStaff.includes(staff.id) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {staff.fullName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Before Images */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Before Service Images
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="beforeImages"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Upload Images</span>
                    <input
                      id="beforeImages"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "before")}
                    />
                  </Label>
                </div>

                {beforeImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {beforeImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Before ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, "before")}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* After Images */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                After Service Images
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="afterImages"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Upload Images</span>
                    <input
                      id="afterImages"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "after")}
                    />
                  </Label>
                </div>

                {afterImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {afterImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`After ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, "after")}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Parts Used */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Parts Used
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newPart}
                    onChange={(e) => setNewPart(e.target.value)}
                    placeholder="e.g., Oil Filter, Brake Pads"
                    className="h-11"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPart();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addPart}
                    variant="outline"
                    className="border-orange-400 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Part
                  </Button>
                </div>

                {parts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {parts.map((part, index) => (
                      <div
                        key={index}
                        className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-2 rounded-lg flex items-center gap-2"
                      >
                        <span className="text-sm font-medium">{part}</span>
                        <button
                          type="button"
                          onClick={() => removePart(index)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Notes & Diagnosis
              </h3>
              <hr className="mb-6 border-gray-200" />

              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any additional notes, diagnosis, or recommendations..."
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Service Record"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
