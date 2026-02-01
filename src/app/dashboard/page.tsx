"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ReviewsTab } from "@/components/ReviewsTab";
import { ChatTab } from "@/components/ChatTab";
import { OrdersTab } from "@/components/OrdersTab";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState<"dashboard" | "reviews" | "chat" | "orders">("dashboard");

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/");
  }

  const firstName = user?.firstName || user?.username || "User";

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20 lg:pb-0">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="FreeWiFi KE" width={40} height={40} className="rounded-lg object-cover" />
            <span className="text-2xl font-bold text-[#0066FF]">FreeWiFi KE</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "bg-[#0066FF] text-white"
                  : "text-[#6B7280] hover:bg-gray-100"
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "reviews"
                  ? "bg-[#0066FF] text-white"
                  : "text-[#6B7280] hover:bg-gray-100"
              }`}
            >
              ⭐ Reviews
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? "bg-[#0066FF] text-white"
                  : "text-[#6B7280] hover:bg-gray-100"
              }`}
            >
              🤖 AI Chat
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-[#0066FF] text-white"
                  : "text-[#6B7280] hover:bg-gray-100"
              }`}
            >
              📦 Orders
            </button>
          </nav>
          
          <div className="flex items-center gap-4">
            <button className="text-[#6B7280] hover:text-[#0066FF]">
              ⚙️
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0066FF] text-white font-semibold">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">
              Hello, {firstName}! 👋
            </h1>
            <p className="mt-2 text-[#6B7280]">Welcome to your dashboard</p>

            {/* Current Plan Card */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-xl font-semibold text-[#1A1A2E]">Current Plan</h2>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[#6B7280]">No active plan</p>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Get started by ordering a plan
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="rounded-full bg-[#0066FF] px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-[#0052CC]"
                >
                  Order Now
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-[#1A1A2E]">Quick Actions</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <button
                  onClick={() => setActiveTab("orders")}
                  className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  <span className="text-4xl">📦</span>
                  <span className="font-semibold text-[#1A1A2E]">Order New Plan</span>
                </button>
                <button className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
                  <span className="text-4xl">🔧</span>
                  <span className="font-semibold text-[#1A1A2E]">Report Problem</span>
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  <span className="text-4xl">💬</span>
                  <span className="font-semibold text-[#1A1A2E]">Contact Support</span>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-xl font-semibold text-[#1A1A2E]">Account Information</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Name:</span>
                  <span className="font-medium text-[#1A1A2E]">{user?.fullName || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Email:</span>
                  <span className="font-medium text-[#1A1A2E]">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Username:</span>
                  <span className="font-medium text-[#1A1A2E]">{user?.username || "Not set"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && <ReviewsTab />}

        {activeTab === "chat" && <ChatTab />}

        {activeTab === "orders" && <OrdersTab />}
      </div>

      {/* TikTok-style Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-gray-200 bg-white shadow-lg lg:hidden">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-around px-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === "dashboard" ? "text-[#0066FF]" : "text-[#6B7280]"
            }`}
          >
            <span className="text-2xl">📊</span>
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === "reviews" ? "text-[#0066FF]" : "text-[#6B7280]"
            }`}
          >
            <span className="text-2xl">⭐</span>
            <span className="text-xs font-medium">Reviews</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === "chat" ? "text-[#0066FF]" : "text-[#6B7280]"
            }`}
          >
            <span className="text-2xl">🤖</span>
            <span className="text-xs font-medium">AI Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === "orders" ? "text-[#0066FF]" : "text-[#6B7280]"
            }`}
          >
            <span className="text-2xl">📦</span>
            <span className="text-xs font-medium">Orders</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
