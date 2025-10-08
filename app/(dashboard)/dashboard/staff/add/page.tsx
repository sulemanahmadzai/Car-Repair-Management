"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

export default function AddStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    address: "",
    role: "",
    department: "",
    joiningDate: "",
    status: "active",
    shiftTime: "",
    salary: "",
    paymentType: "",
    lastPaymentDate: "",
    tasksCompleted: "0",
    emergencyContactName: "",
    emergencyContactPhone: "",
    relationship: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tasksCompleted: parseInt(formData.tasksCompleted) || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save staff member");
      }

      router.push("/dashboard/staff");
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
            Add New Staff Member
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new staff member record
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl font-semibold">
              Staff Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Personal Information
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="h-11"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="gender"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Gender
                  </Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="h-11 w-full px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="h-11"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="h-11"
                    placeholder="Enter phone number"
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

            {/* Employment Information */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Employment Information
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="role"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="h-11"
                    placeholder="e.g., Mechanic"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="department"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Department
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className="h-11"
                    placeholder="e.g., Service Department"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="joiningDate"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Joining Date
                  </Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) =>
                      handleInputChange("joiningDate", e.target.value)
                    }
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
                      handleInputChange("status", e.target.value)
                    }
                    className="h-11 w-full px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="shiftTime"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Shift Time
                  </Label>
                  <Input
                    id="shiftTime"
                    value={formData.shiftTime}
                    onChange={(e) =>
                      handleInputChange("shiftTime", e.target.value)
                    }
                    className="h-11"
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="tasksCompleted"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Tasks Completed
                  </Label>
                  <Input
                    id="tasksCompleted"
                    type="number"
                    value={formData.tasksCompleted}
                    onChange={(e) =>
                      handleInputChange("tasksCompleted", e.target.value)
                    }
                    className="h-11"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Payment Information
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="salary"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Salary
                  </Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) =>
                      handleInputChange("salary", e.target.value)
                    }
                    className="h-11"
                    placeholder="e.g., £30,000"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="paymentType"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Payment Type
                  </Label>
                  <select
                    id="paymentType"
                    value={formData.paymentType}
                    onChange={(e) =>
                      handleInputChange("paymentType", e.target.value)
                    }
                    className="h-11 w-full px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Select payment type</option>
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="lastPaymentDate"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Last Payment Date
                  </Label>
                  <Input
                    id="lastPaymentDate"
                    type="date"
                    value={formData.lastPaymentDate}
                    onChange={(e) =>
                      handleInputChange("lastPaymentDate", e.target.value)
                    }
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Emergency Contact
              </h3>
              <hr className="mb-6 border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="emergencyContactName"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Emergency Contact Name
                  </Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      handleInputChange("emergencyContactName", e.target.value)
                    }
                    className="h-11"
                    placeholder="Enter contact name"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="emergencyContactPhone"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Emergency Contact Phone
                  </Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      handleInputChange("emergencyContactPhone", e.target.value)
                    }
                    className="h-11"
                    placeholder="Enter contact phone"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="relationship"
                    className="text-sm font-semibold text-foreground mb-2 inline-block"
                  >
                    Relationship
                  </Label>
                  <Input
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) =>
                      handleInputChange("relationship", e.target.value)
                    }
                    className="h-11"
                    placeholder="e.g., Spouse, Parent, Sibling"
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
                {loading ? "Creating..." : "Create Staff Member"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
