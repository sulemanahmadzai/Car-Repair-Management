"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SimpleChartProps {
  data: Array<{ date: string; revenue: number }>;
}

export function SimpleChart({ data }: SimpleChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barCategoryGap="20%"
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              return new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            labelFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />
          <Bar
            dataKey="revenue"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            name="Revenue"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
