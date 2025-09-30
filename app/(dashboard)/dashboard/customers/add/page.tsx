"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search } from "lucide-react";

export default function AddCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dvlaLoading, setDvlaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    address: "",
    registrationNumber: "",
    make: "",
    model: "",
    colour: "",
    fuelType: "",
    motExpiry: "",
    taxDueDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchVehicleData = async () => {
    if (!formData.registrationNumber) {
      setError("Please enter a registration number");
      return;
    }

    setDvlaLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dvla", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationNumber: formData.registrationNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch vehicle data");
      }

      const vehicleData = await response.json();

      setFormData((prev) => ({
        ...prev,
        registrationNumber:
          vehicleData.registrationNumber || prev.registrationNumber,
        make: vehicleData.make || prev.make,
        model: vehicleData.model || prev.model,
        colour: vehicleData.colour || prev.colour,
        fuelType: vehicleData.fuelType || prev.fuelType,
        motExpiry: vehicleData.motExpiry || prev.motExpiry,
        taxDueDate: vehicleData.taxDueDate || prev.taxDueDate,
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDvlaLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save customer");
      }

      router.push("/dashboard/customers");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            Add New Customer
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new customer record
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl font-semibold">
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Customer Information
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-11"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="mobileNumber"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Mobile Number *
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      handleInputChange("mobileNumber", e.target.value)
                    }
                    className="h-11"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-11"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="address"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="h-11"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Vehicle Information
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <Label
                    htmlFor="registrationNumber"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Registration Number *
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "registrationNumber",
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="e.g., AB12 CDE"
                      className="h-11 uppercase font-mono flex-1"
                      required
                    />
                    <Button
                      type="button"
                      onClick={fetchVehicleData}
                      disabled={dvlaLoading || !formData.registrationNumber}
                      variant="outline"
                      className="border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500 h-11"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {dvlaLoading ? "Loading..." : "Auto-fill"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="make"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Make
                  </Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange("make", e.target.value)}
                    className="h-11"
                    placeholder="e.g., Toyota"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="model"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Model
                  </Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className="h-11"
                    placeholder="e.g., Corolla"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="colour"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Colour
                  </Label>
                  <Input
                    id="colour"
                    value={formData.colour}
                    onChange={(e) =>
                      handleInputChange("colour", e.target.value)
                    }
                    className="h-11"
                    placeholder="e.g., Silver"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="fuelType"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Fuel Type
                  </Label>
                  <Input
                    id="fuelType"
                    value={formData.fuelType}
                    onChange={(e) =>
                      handleInputChange("fuelType", e.target.value)
                    }
                    className="h-11"
                    placeholder="e.g., Petrol"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="motExpiry"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    MOT Expiry
                  </Label>
                  <Input
                    id="motExpiry"
                    type="date"
                    value={formData.motExpiry}
                    onChange={(e) =>
                      handleInputChange("motExpiry", e.target.value)
                    }
                    className="h-11"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="taxDueDate"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Tax Due Date
                  </Label>
                  <Input
                    id="taxDueDate"
                    type="date"
                    value={formData.taxDueDate}
                    onChange={(e) =>
                      handleInputChange("taxDueDate", e.target.value)
                    }
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                {loading ? "Creating..." : "Create Customer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
