"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    DashboardIcon,
    OrderIcon,
    ChatIcon,
    UserIcon,
    BellIcon,
} from "@/components/ui/Icons";

// Add specific icons if missing or repurpose
const FolderIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
);
const TicketIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
);
const ReviewIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);
const SettingsIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);
const ClipboardListIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>
);

export function AdminSidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (open: boolean) => void }) {
    const pathname = usePathname();
    const [manageExpanded, setManageExpanded] = useState(true);

    const isActive = (path: string) => pathname === path;
    const isManageActive = pathname.startsWith("/admin/") && pathname !== "/admin" && !pathname.startsWith("/admin/notifications") && !pathname.startsWith("/admin/logs") && !pathname.startsWith("/admin/settings");

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-xl transition-transform duration-300 lg:relative lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-16 items-center border-b px-6">
                    <span className="text-xl font-bold text-[#0066FF]">FreeWiFi KE</span>
                    <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold uppercase text-gray-500">Admin</span>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-4">

                    <Link
                        href="/admin"
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname === "/admin"
                            ? "bg-[#0066FF]/10 text-[#0066FF]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <DashboardIcon size={20} />
                        Dashboard
                    </Link>

                    {/* Manage Section */}
                    <div>
                        <button
                            onClick={() => setManageExpanded(!manageExpanded)}
                            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isManageActive ? "text-[#0066FF]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <FolderIcon className="h-5 w-5" />
                                Manage
                            </div>
                            <svg
                                className={`h-4 w-4 transition-transform ${manageExpanded ? "rotate-90" : ""}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {manageExpanded && (
                            <div className="mt-1 space-y-1 pl-11">
                                <Link
                                    href="/admin/orders"
                                    className={`block rounded-lg py-2 pl-2 text-sm font-medium transition-colors ${isActive("/admin/orders") ? "text-[#0066FF]" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-2"><OrderIcon size={16} /> Orders</div>
                                </Link>
                                <Link
                                    href="/admin/tickets"
                                    className={`block rounded-lg py-2 pl-2 text-sm font-medium transition-colors ${isActive("/admin/tickets") ? "text-[#0066FF]" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-2"><TicketIcon className="h-4 w-4" /> Tickets</div>
                                </Link>
                                <Link
                                    href="/admin/users"
                                    className={`block rounded-lg py-2 pl-2 text-sm font-medium transition-colors ${isActive("/admin/users") ? "text-[#0066FF]" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-2"><UserIcon size={16} /> Users</div>
                                </Link>
                                <Link
                                    href="/admin/reviews"
                                    className={`block rounded-lg py-2 pl-2 text-sm font-medium transition-colors ${isActive("/admin/reviews") ? "text-[#0066FF]" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-2"><ReviewIcon className="h-4 w-4" /> Reviews</div>
                                </Link>
                                <Link
                                    href="/admin/chats"
                                    className={`block rounded-lg py-2 pl-2 text-sm font-medium transition-colors ${isActive("/admin/chats") ? "text-[#0066FF]" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-2"><ChatIcon size={16} /> Chats</div>
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/admin/notifications"
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive("/admin/notifications")
                            ? "bg-[#0066FF]/10 text-[#0066FF]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <div className="relative">
                            <BellIcon size={20} />
                            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
                        </div>
                        Notifications
                    </Link>

                    <Link
                        href="/admin/logs"
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive("/admin/logs")
                            ? "bg-[#0066FF]/10 text-[#0066FF]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <ClipboardListIcon className="h-5 w-5" />
                        Logs
                    </Link>

                    <Link
                        href="/admin/settings"
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive("/admin/settings")
                            ? "bg-[#0066FF]/10 text-[#0066FF]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <SettingsIcon className="h-5 w-5" />
                        Settings
                    </Link>

                </nav>
            </aside>
        </>
    );
}
