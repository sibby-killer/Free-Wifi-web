import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { AIChatIcon } from "./ui/Icons"; // Using AIChatIcon or maybe a Bell icon if I had one. 
// I'll stick to simple UI or generic icons for now.

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
}

export function NotificationsTab() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case "success": return "bg-green-50 border-green-100";
            case "warning": return "bg-yellow-50 border-yellow-100";
            case "alert": return "bg-red-50 border-red-100";
            default: return "bg-blue-50 border-blue-100";
        }
    };

    const getTextColor = (type: string) => {
        switch (type) {
            case "success": return "text-green-800";
            case "warning": return "text-yellow-800";
            case "alert": return "text-red-800";
            default: return "text-blue-800";
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-[#1A1A2E]">Notifications</h1>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <span className="text-sm font-bold text-red-600">{notifications.length}</span>
                </div>
            </div>
            <p className="text-[#6B7280]">Stay updated with latest announcements</p>

            {/* List */}
            <div className="mt-6 space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading updates...</div>
                ) : notifications.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                        <p className="text-gray-500">No new notifications</p>
                    </div>
                ) : (
                    notifications.map((note) => (
                        <div key={note.id} className={`p-4 rounded-xl border ${getBgColor(note.type)} shadow-sm transition-all hover:shadow-md`}>
                            <div className="flex justify-between items-start">
                                <h3 className={`font-semibold ${getTextColor(note.type)}`}>{note.title}</h3>
                                <span className="text-xs text-gray-500">{formatDate(note.createdAt)}</span>
                            </div>
                            <p className="mt-1 text-gray-700 text-sm whitespace-pre-wrap">{note.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
