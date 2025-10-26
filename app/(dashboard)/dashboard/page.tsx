"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Users, DollarSign, FileText, UserPlus } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleChart } from "@/components/SimpleChart";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type DashboardData = {
  stats: {
    totalRevenue: number;
    totalCustomers: number;
    totalServiceRecords: number;
    totalStaff: number;
  };
  chart: Array<{ date: string; revenue: number }>;
  yearlyBreakup: Array<{ month: string; revenue: number }>;
  monthlyEarnings: number;
};

export default function DashboardPage() {
  const [isLoading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { data: dashboardData, error } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher
  );

  useEffect(() => {
    setMounted(true);
    setLoading(false);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your modern dashboard
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg border animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your modern dashboard
          </p>
        </div>
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalRevenue: 0,
    totalCustomers: 0,
    totalServiceRecords: 0,
    totalStaff: 0,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = dashboardData?.chart || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your modern dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          color="primary"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          color="secondary"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Service Records"
          value={stats.totalServiceRecords.toLocaleString()}
          icon={FileText}
          color="success"
          isLoading={isLoading}
        />
        <StatsCard
          title="Staff"
          value={stats.totalStaff.toLocaleString()}
          icon={UserPlus}
          color="warning"
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Updates - Bar Chart */}
        <DashboardCard
          title="Revenue Updates"
          subtitle="Last 30 days revenue"
          className="lg:col-span-2"
          isLoading={isLoading}
        >
          {chartData.length > 0 ? (
            <SimpleChart data={chartData} />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No chart data available
            </div>
          )}
        </DashboardCard>

        {/* Yearly Breakup */}
        <DashboardCard
          title="Yearly Breakup"
          subtitle="Last 12 months"
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(
                  dashboardData?.yearlyBreakup?.reduce(
                    (sum, item) => sum + item.revenue,
                    0
                  ) || 0
                )}
              </p>
            </div>
            <div className="pt-4 border-t space-y-2 max-h-64 overflow-y-auto">
              {dashboardData?.yearlyBreakup?.slice(-12).map((item, index) => (
                <div
                  key={item.month}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${200 + index * 20}, 70%, 50%)`,
                      }}
                    ></div>
                    <span className="text-muted-foreground">{item.month}</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        {/* Monthly Earnings */}
        <DashboardCard
          title="Monthly Earnings"
          subtitle="Current month"
          isLoading={isLoading}
        >
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(dashboardData?.monthlyEarnings || 0)}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Total revenue for the current month
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
