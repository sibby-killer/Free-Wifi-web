"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ReviewsTab } from "@/components/ReviewsTab";
import { ChatTab } from "@/components/ChatTab";
import { OrdersTab } from "@/components/OrdersTab";
import { NotificationsTab } from "@/components/NotificationsTab";
import { ReportTab } from "@/components/ReportTab";
import {
  DashboardIcon,
  StarIcon,
  AIChatIcon,
  OrderIcon,
  DocumentIcon,
  LockIcon,
  LogoutIcon,
  ToolIcon,
  ChatIcon,
  BellIcon
} from "@/components/ui/Icons";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState<"dashboard" | "reviews" | "chat" | "orders" | "notifications" | "report">("dashboard");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Auto-sync user and check admin status
  useEffect(() => {
    if (isSignedIn && user) {
      const initDashboard = async () => {
        try {
          // 1. Sync User (Self-Healing)
          await fetch("/api/users/sync", { method: "POST" });

          // 2. Check Admin Status & Get Plan Info
          const res = await fetch("/api/users");
          if (res.ok) {
            const data = await res.json();
            if (data.isAdmin) setIsAdmin(true);
            if (data.user) setUserInfo(data.user);
          }

          // 3. Fetch Unread Chat Count
          const chatRes = await fetch("/api/chat/unread");
          if (chatRes.ok) {
            const chatData = await chatRes.json();
            setUnreadChatCount(chatData.unreadCount || 0);
          }

        } catch (err) {
          console.error("Dashboard init failed:", err);
        }
      };
      initDashboard();

      // Poll for unread messages every 30s
      const interval = setInterval(async () => {
        const chatRes = await fetch("/api/chat/unread");
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          setUnreadChatCount(chatData.unreadCount || 0);
        }
      }, 30000);

      return () => clearInterval(interval);

    }
  }, [isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect admin to admin dashboard
  if (isAdmin) {
    redirect("/admin");
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
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === "dashboard"
                ? "bg-[#0066FF] text-white"
                : "text-[#6B7280] hover:bg-gray-100"
                }`}
            >
              <DashboardIcon size={18} /> Dashboard
            </button>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#6B7280] hover:bg-gray-100 hover:text-[#0066FF]"
              >
                <LockIcon size={18} /> Admin Panel
              </Link>
            )}
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === "reviews"
                ? "bg-[#0066FF] text-white"
                : "text-[#6B7280] hover:bg-gray-100"
                }`}
            >
              <StarIcon size={18} filled /> Reviews
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === "chat"
                ? "bg-[#0066FF] text-white"
                : "text-[#6B7280] hover:bg-gray-100"
                }`}
            >
              <AIChatIcon size={18} /> AI Chat
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
                  {unreadChatCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === "orders"
                ? "bg-[#0066FF] text-white"
                : "text-[#6B7280] hover:bg-gray-100"
                }`}
            >
              <OrderIcon size={18} /> Orders
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === "notifications"
                ? "bg-[#0066FF] text-white"
                : "text-[#6B7280] hover:bg-gray-100"
                }`}
            >
              <BellIcon size={18} /> Notifications
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {/* Help, Privacy, Terms Links */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/terms" target="_blank" className="text-[#6B7280] hover:text-[#0066FF]">
                Terms
              </Link>
              <Link href="/privacy" target="_blank" className="text-[#6B7280] hover:text-[#0066FF]">
                Privacy
              </Link>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0066FF] text-white font-semibold hover:bg-[#0052CC] transition-colors"
              >
                {firstName.charAt(0).toUpperCase()}
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-[#1A1A2E]">{user?.fullName || firstName}</p>
                    <p className="text-xs text-[#6B7280]">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <Link
                    href="/terms"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#1A1A2E] hover:bg-gray-50"
                  >
                    <DocumentIcon size={16} /> Terms of Service
                  </Link>
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#1A1A2E] hover:bg-gray-50"
                  >
                    <LockIcon size={16} /> Privacy Policy
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogoutIcon size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">
              Hello, {firstName}!
            </h1>
            <p className="mt-2 text-[#6B7280]">Welcome to your dashboard</p>

            {/* Current Plan Card */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-xl font-semibold text-[#1A1A2E]">Current Plan</h2>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  {userInfo?.currentPlan ? (
                    <>
                      <p className="text-2xl font-bold text-[#0066FF]">{userInfo.currentPlan}</p>
                      {userInfo.renewalDate && (
                        <p className="mt-1 text-sm text-[#6B7280]">
                          Renewal: {new Date(userInfo.renewalDate).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-[#6B7280]">No active plan</p>
                      <p className="mt-1 text-sm text-[#6B7280]">
                        Get started by ordering a plan
                      </p>
                    </>
                  )}
                </div>
                {!userInfo?.currentPlan && (
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="rounded-full bg-[#0066FF] px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-[#0052CC]"
                  >
                    Order Now
                  </button>
                )}
                {userInfo?.currentPlan && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Active
                  </span>
                )}
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
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0066FF]/10">
                    <OrderIcon size={32} />
                  </div>
                  <span className="font-semibold text-[#1A1A2E]">Order New Plan</span>
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6600]/10 text-[#FF6600]">
                    <ToolIcon size={32} />
                  </div>
                  <span className="font-semibold text-[#1A1A2E]">Report Problem</span>
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="flex flex-col items-center gap-2 rounded-xl bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00CC88]/10 text-[#00CC88]">
                    <ChatIcon size={32} />
                  </div>
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

        {activeTab === "report" && <ReportTab />}

        {activeTab === "notifications" && <NotificationsTab />}
      </div>

      {/* TikTok-style Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-gray-200 bg-white shadow-lg lg:hidden">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-around px-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "dashboard" ? "text-[#0066FF]" : "text-[#6B7280]"
              }`}
          >
            <DashboardIcon size={24} />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex flex-col items-center gap-1 transition-colors text-[#6B7280]"
            >
              <LockIcon size={24} />
              <span className="text-xs font-medium">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "reviews" ? "text-[#0066FF]" : "text-[#6B7280]"
              }`}
          >
            <StarIcon size={24} filled={activeTab === "reviews"} />
            <span className="text-xs font-medium">Reviews</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-1 transition-colors relative ${activeTab === "chat" ? "text-[#0066FF]" : "text-[#6B7280]"
              }`}
          >
            <div className="relative">
              <AIChatIcon size={24} />
              {unreadChatCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
                  {unreadChatCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">AI Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "orders" ? "text-[#0066FF]" : "text-[#6B7280]"
              }`}
          >
            <OrderIcon size={24} />
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "notifications" ? "text-[#0066FF]" : "text-[#6B7280]"
              }`}
          >
            <BellIcon size={24} />
            <span className="text-xs font-medium">Alerts</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
