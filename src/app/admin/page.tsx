"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserIcon,
  OrderIcon,
  ChatIcon,
  BellIcon // Using Bell for Ticket icon equivalent
} from "@/components/ui/Icons";

// Helper components
const StatCard = ({ title, value, color, icon: Icon }: any) => (
  <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm transition-transform hover:scale-105">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-${color}-100 text-${color}-600`}>
      <Icon size={24} />
    </div>
  </div>
);

// Quick Action Button
const ActionBtn = ({ label, href, color }: any) => (
  <Link href={href} className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white p-4 text-center shadow-sm transition-colors hover:bg-gray-50">
    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${color}-100 text-${color}-600`}>
      <span className="text-xl">+</span>
    </div>
    <span className="font-semibold text-gray-700">{label}</span>
  </Link>
);

export default function AdminHomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-gray-500">Loading Dashboard...</div>;
  }

  const { stats, activity } = data || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          color="blue"
          icon={UserIcon}
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          color="orange"
          icon={OrderIcon}
        />
        <StatCard
          title="Open Tickets"
          value={stats?.openTickets || 0}
          color="red"
          icon={BellIcon}
        />
        <StatCard
          title="Total Revenue"
          value={`KES ${(stats?.totalRevenue || 0).toLocaleString()}`}
          color="green"
          icon={OrderIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity Feed */}
        <div className="col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>

          {/* Recent Orders */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">New Orders</h3>
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {activity?.orders?.length > 0 ? (
                activity.orders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-900">{order.user?.fullName || "Guest"}</p>
                      <p className="text-xs text-gray-500">{order.plan} Plan • {order.region}</p>
                    </div>
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                      {order.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent orders.</p>
              )}
            </div>
          </div>

          {/* Recent Chats */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">New Messages (@admin)</h3>
              <Link href="/admin/chats" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {activity?.chats?.length > 0 ? (
                activity.chats.map((chat: any) => (
                  <div key={chat.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-center leading-8 text-xs font-bold text-blue-600">
                        {chat.user?.fullName?.[0] || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{chat.user?.fullName}</p>
                        <p className="line-clamp-1 max-w-xs text-xs text-gray-500">{chat.content}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No new messages.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Tickets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <ActionBtn label="Send Notification" href="/admin/notifications" color="blue" />
              <ActionBtn label="View Orders" href="/admin/orders" color="green" />
              <ActionBtn label="Support Tickets" href="/admin/tickets" color="red" />
              <ActionBtn label="Manage Users" href="/admin/users" color="purple" />
            </div>
          </div>

          {/* Open Tickets */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent Tickets</h3>
              <Link href="/admin/tickets" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {activity?.tickets?.length > 0 ? (
                activity.tickets.map((ticket: any) => (
                  <div key={ticket.id} className="border-l-4 border-red-500 bg-red-50 p-3">
                    <p className="text-sm font-medium text-gray-900">{ticket.problemType}</p>
                    <p className="text-xs text-gray-600">by {ticket.user?.fullName}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No open tickets.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
