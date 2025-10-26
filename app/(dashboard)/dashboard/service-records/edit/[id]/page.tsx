"use client";

import { use, useState, useEffect } from "react";
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
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  MessageCircle,
} from "lucide-react";
import useSWR from "swr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

export default function EditServiceRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
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
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const { data: record, error } = useSWR(
    `/api/service-records/${resolvedParams.id}`,
    fetcher
  );

  // Fetch active staff members on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("/api/staff");
        if (response.ok) {
          const data = await response.json();
          // Handle both array response and paginated response
          const staffArray = Array.isArray(data) ? data : data.items || [];
          const activeStaff = staffArray.filter(
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

  useEffect(() => {
    if (record) {
      setFormData({
        vehicleReg: record.vehicleReg || "",
        serviceType: record.serviceType || "",
        mileage: record.mileage?.toString() || "",
        labourHours: record.labourHours?.toString() || "",
        notes: record.notes || "",
        totalCost: record.totalCost || "",
        status: record.status || "pending",
      });
      setParts(record.partsUsed || []);
      setBeforeImages(record.beforeImages || []);
      setAfterImages(record.afterImages || []);
      setAssignedStaff(record.assignedStaff || []);
    }
  }, [record]);

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

  // Detect when status changes to "completed" and show WhatsApp option
  useEffect(() => {
    if (formData.status === "completed" && customerData && !showWhatsAppModal) {
      // Show modal only once when status changes to completed
      setShowWhatsAppModal(true);
    }
  }, [formData.status, customerData]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

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

          const base64 = canvas.toDataURL("image/jpeg", 0.7);

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
      const response = await fetch(
        `/api/service-records/${resolvedParams.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            partsUsed: parts,
            beforeImages,
            afterImages,
            assignedStaff,
          }),
        }
      );

      if (response.ok) {
        router.push(`/dashboard/service-records/${resolvedParams.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update service record");
      }
    } catch (error) {
      console.error("Error updating service record:", error);
      alert("Failed to update service record");
    } finally {
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

  // Handle WhatsApp click
  const handleWhatsAppClick = (phone: string) => {
    // Clean phone number - remove all non-digits
    const cleanPhone = phone.replace(/\D/g, "");

    // Open WhatsApp with the customer's number
    window.open(`https://wa.me/${cleanPhone}`, "_blank");

    // Close modal after opening WhatsApp
    setShowWhatsAppModal(false);
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
            Edit Service Record
          </h1>
          <p className="text-muted-foreground mt-1">
            Update service record details
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

            {/* Total Cost & Status */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Cost & Status
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="totalCost"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Total Cost (£)
                  </Label>
                  <Input
                    id="totalCost"
                    type="text"
                    value={formData.totalCost}
                    onChange={(e) =>
                      setFormData({ ...formData, totalCost: e.target.value })
                    }
                    placeholder="e.g., 250.00"
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
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_STATUS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Assign Staff */}
            {staffList.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Assign Staff
                </h3>
                <hr className="mb-6 border-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {staffList.map((staff) => (
                    <div
                      key={staff.id}
                      onClick={() => toggleStaffAssignment(staff.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        assignedStaff.includes(staff.id)
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {staff.fullName}
                        </span>
                        {assignedStaff.includes(staff.id) && (
                          <CheckCircle className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Before Service Images */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Before Service Images
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-2 inline-block">
                    Upload Before Images
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, "before")}
                      className="h-11 cursor-pointer"
                    />
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {beforeImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {beforeImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Before ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, "before")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* After Service Images */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                After Service Images
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-2 inline-block">
                    Upload After Images
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, "after")}
                      className="h-11 cursor-pointer"
                    />
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {afterImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {afterImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`After ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, "after")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                {loading ? "Updating..." : "Update Service Record"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* WhatsApp Notification Modal */}
      {showWhatsAppModal && customerData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Service Completed! 🎉</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Notify your customer
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm font-medium text-green-900 mb-2">
                  Customer Details:
                </p>
                <p className="text-green-800 font-semibold">
                  {customerData.name}
                </p>
                <p className="text-green-700 text-sm">
                  📱 {customerData.mobileNumber}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Click below to open WhatsApp and share the service completion
                details with {customerData.name}.
              </p>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => handleWhatsAppClick(customerData.mobileNumber)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Open WhatsApp
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  variant="outline"
                >
                  Maybe Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating WhatsApp Button for Completed Services */}
      {formData.status === "completed" &&
        customerData &&
        !showWhatsAppModal && (
          <div className="fixed bottom-6 right-6 z-40">
            <Button
              onClick={() => handleWhatsAppClick(customerData.mobileNumber)}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-full w-14 h-14"
              title="Notify customer via WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
        )}
    </div>
  );
}
