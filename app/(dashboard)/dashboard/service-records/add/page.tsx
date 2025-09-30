"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";

const SERVICE_TYPES = [
  "MOT",
  "Full Service",
  "Oil Change",
  "Brake Repair",
  "Custom",
];

export default function AddServiceRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleReg: "",
    serviceType: "",
    mileage: "",
    labourHours: "",
    notes: "",
  });
  const [parts, setParts] = useState<string[]>([]);
  const [newPart, setNewPart] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/service-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          partsUsed: parts,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/service-records");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create service record");
      }
    } catch (error) {
      console.error("Error creating service record:", error);
      alert("Failed to create service record");
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
                <div>
                  <Label
                    htmlFor="vehicleReg"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Vehicle Registration Number *
                  </Label>
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
