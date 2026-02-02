"use client";

import { useUser } from "@clerk/nextjs";

export default function AdminSettingsPage() {
    const { user } = useUser();

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>

            {/* Admin Profile */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h2>
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.fullName?.[0] || "A"}
                    </div>
                    <div>
                        <div className="font-bold text-lg">{user?.fullName}</div>
                        <div className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</div>
                        <div className="text-xs text-blue-600 font-medium mt-1">Super Admin</div>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Role</div>
                        <div>Administrator</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Last Login</div>
                        <div>{user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "Just now"}</div>
                    </div>
                </div>
            </div>

            {/* System Configuration (Mock) */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">Maintenance Mode</div>
                            <div className="text-sm text-gray-500">Disable customer access temporarily</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" disabled />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">Email Notifications</div>
                            <div className="text-sm text-gray-500">Receive daily summary emails</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
