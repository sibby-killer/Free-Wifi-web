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
  BellIcon,
  UserIcon
} from "@/components/ui/Icons";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  // added 'account' tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "reviews" | "chat" | "orders" | "notifications" | "report" | "account">("dashboard");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [greeting, setGreeting] = useState("Hello");

  // Determine Greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Theme Sync
  useEffect(() => {
    if (userInfo?.theme) {
      // Apply theme logic here or saved in context? 
      // For now, we just save it. Implementation of actual CSS variables/class would go here.
      // e.g., document.documentElement.setAttribute('data-theme', userInfo.theme);
    }
  }, [userInfo]);

  const handleThemeChange = async (theme: string) => {
    // Optimistic update
    setUserInfo({ ...userInfo, theme });
    try {
      await fetch("/api/users/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme })
      });
    } catch (err) {
      console.error("Failed to update theme", err);
    }
  };

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

  // Redirect if Admin (Metadata is source of truth for navigation)
  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role === "admin") {
      redirect("/admin");
    }
  }, [isLoaded, user]);

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
              <BellIcon size={18} /> Alerts
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
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === "account"
                ? "bg-[#0066FF] text-white"
                : "text-[#6B7280] hover:bg-gray-100"
                }`}
            >
              <UserIcon size={18} /> Account
            </button>
          </nav>

          <div className="flex items-center gap-4">
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
                  <button
                    onClick={() => { setActiveTab("account"); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1A1A2E] hover:bg-gray-50 bg-white cursor-pointer"
                  >
                    <UserIcon size={16} /> Account
                  </button>
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
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#1A1A2E] animate-fade-in">
              {greeting}, {firstName}!
            </h1>
            <p className="text-[#6B7280]">Welcome back to your dashboard</p>

            {/* Current Plan Card */}
            <div className="rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
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
                {!userInfo?.currentPlan ? (
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="rounded-full bg-[#0066FF] px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-[#0052CC]"
                  >
                    Order Now
                  </button>
                ) : (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
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
          </div>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Account Settings</h1>

            {/* Profile Card */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Profile</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#6B7280]">Name</span>
                  <span className="font-medium text-[#1A1A2E]">{user?.fullName || "Not set"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#6B7280]">Email</span>
                  <span className="font-medium text-[#1A1A2E]">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[#6B7280]">Username</span>
                  <span className="font-medium text-[#1A1A2E]">{user?.username || "Not set"}</span>
                </div>
              </div>
            </div>

            {/* Theme Switcher */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Theme Preference</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'light', name: 'Light', color: 'bg-white border-2' },
                  { id: 'dark', name: 'Dark', color: 'bg-gray-900 text-white' },
                  { id: 'ocean', name: 'Ocean', color: 'bg-blue-900 text-white' },
                  { id: 'forest', name: 'Forest', color: 'bg-green-900 text-white' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`p-4 rounded-xl shadow-sm transition-transform hover:scale-105 flex flex-col items-center gap-2 ${t.color} ${userInfo?.theme === t.id ? 'ring-2 ring-offset-2 ring-[#0066FF]' : ''}`}
                  >
                    <div className="h-6 w-6 rounded-full border border-gray-300 bg-current opacity-50"></div>
                    <span className="font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Security (Placeholder) */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Security</h2>
              <button className="text-[#0066FF] hover:underline" onClick={() => setActiveTab('report')}>
                Need to reset password? Contact Support or Logout.
              </button>
            </div>
          </div>
        )}

        {activeTab === "reviews" && <ReviewsTab />}
        {activeTab === "chat" && <ChatTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "report" && <ReportTab />}
        {activeTab === "notifications" && <NotificationsTab />}
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-gray-200 bg-white shadow-lg lg:hidden">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-around px-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "dashboard" ? "text-[#0066FF]" : "text-[#6B7280]"}`}
          >
            <DashboardIcon size={24} />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "orders" ? "text-[#0066FF]" : "text-[#6B7280]"}`}
          >
            <OrderIcon size={24} />
            <span className="text-xs font-medium">Orders</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-1 transition-colors relative ${activeTab === "chat" ? "text-[#0066FF]" : "text-[#6B7280]"}`}
          >
            <div className="relative">
              <AIChatIcon size={24} />
              {unreadChatCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
                  {unreadChatCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">Chat</span>
          </button>

          <button
            onClick={() => setActiveTab("account")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === "account" ? "text-[#0066FF]" : "text-[#6B7280]"}`}
          >
            <UserIcon size={24} />
            <span className="text-xs font-medium">Account</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
