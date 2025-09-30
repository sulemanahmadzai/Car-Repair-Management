"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={userData || undefined}
        />
        <div className="lg:pl-64">
          <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={userData || undefined}
      />

      <div className="lg:pl-64 min-h-screen">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
