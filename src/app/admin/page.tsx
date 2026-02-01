"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminHomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    openTickets: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role as string | undefined;
      if (role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const role = user?.publicMetadata?.role as string | undefined;
  if (role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-[#0066FF]">
            FreeWiFi KE Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-[#6B7280] hover:text-[#0066FF]"
            >
              User Dashboard
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6600] text-white font-semibold">
              A
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1A1A2E]">Admin Dashboard</h1>
        <p className="mt-2 text-[#6B7280]">Welcome to the admin area</p>

        {/* Stats Cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Total Orders</p>
                <p className="mt-2 text-3xl font-bold text-[#1A1A2E]">{stats.totalOrders}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Pending Orders</p>
                <p className="mt-2 text-3xl font-bold text-[#F59E0B]">{stats.pendingOrders}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Open Tickets</p>
                <p className="mt-2 text-3xl font-bold text-[#EF4444]">{stats.openTickets}</p>
              </div>
              <div className="text-4xl">🎫</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-[#0066FF]">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#1A1A2E]">Quick Access</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/orders"
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              <span className="text-4xl">📦</span>
              <span className="font-semibold text-[#1A1A2E]">Manage Orders</span>
            </Link>
            <Link
              href="/admin/tickets"
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              <span className="text-4xl">🎫</span>
              <span className="font-semibold text-[#1A1A2E]">Support Tickets</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              <span className="text-4xl">👥</span>
              <span className="font-semibold text-[#1A1A2E]">Users</span>
            </Link>
            <Link
              href="/admin/reviews"
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              <span className="text-4xl">⭐</span>
              <span className="font-semibold text-[#1A1A2E]">Reviews</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold text-[#1A1A2E]">Recent Activity</h2>
          <div className="mt-4 text-center text-[#6B7280]">
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
