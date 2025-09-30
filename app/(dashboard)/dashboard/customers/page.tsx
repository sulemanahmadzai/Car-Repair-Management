"use client";

import { useEffect, useState } from "react";
import { CustomerForm } from "@/components/customer-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSuccess = () => {
    fetchCustomers();
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      const response = await fetch(`/api/customers?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      fetchCustomers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.registrationNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobileNumber.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">
          Loading customers...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            Customer Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer database and vehicle information
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl transition-all whitespace-nowrap flex-shrink-0 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Customer
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-[hsl(var(--error-light))] border border-[hsl(var(--error))] text-[hsl(var(--error))] px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <CustomerForm
          onSuccess={handleSuccess}
          editData={editingCustomer}
          onCancel={handleCancel}
        />
      )}

      {!showForm && (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl font-semibold">
                Customers List
              </CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-10 bg-muted border-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  {searchQuery
                    ? "No customers found matching your search."
                    : "No customers yet. Add your first customer to get started."}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[hsl(var(--grey-100))]">
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
                    {filteredCustomers.map((customer) => {
                      const motExpired =
                        customer.motExpiry &&
                        new Date(customer.motExpiry) < new Date();
                      const taxDue =
                        customer.taxDueDate &&
                        new Date(customer.taxDueDate) < new Date();

                      return (
                        <tr
                          key={customer.id}
                          className="hover:bg-[hsl(var(--grey-100))] transition-colors"
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
                                onClick={() => handleEdit(customer)}
                                className="border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(customer.id)}
                                className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 transition-colors"
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
      )}
    </div>
  );
}
