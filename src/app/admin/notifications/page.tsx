"use client";

import { useEffect, useState, useCallback } from "react";
import { BellIcon, ChatIcon } from "@/components/ui/Icons";

export default function AdminNotificationsPage() {
    const [activeTab, setActiveTab] = useState<"inbox" | "send">("inbox");
    const [notifications, setNotifications] = useState<any[]>([]);
    const [sentLogs, setSentLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Send Form State
    const [sendForm, setSendForm] = useState({
        type: "bulk", // bulk, individual
        recipients: "all", // all, kakamega, bungoma, active
        individualId: "",
        subject: "",
        message: ""
    });
    const [sending, setSending] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === "inbox") {
                const res = await fetch("/api/admin/notifications");
                const data = await res.json();
                setNotifications(data.notifications || []);
            } else {
                const res = await fetch("/api/admin/notifications/sent");
                const data = await res.json();
                setSentLogs(data.logs || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleMarkRead = async (id: string) => {
        await fetch("/api/admin/notifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        fetchData(); // Refresh
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            const payload = { ...sendForm };
            if (payload.type === "individual") {
                // In a real app, we'd validate individualId or search for it.
                // For now passing raw ID or expecting the UX to provide it.
                payload.recipients = payload.individualId;
            }

            const res = await fetch("/api/admin/notifications/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Sent successfully!");
                setSendForm({ ...sendForm, subject: "", message: "" });
                if (activeTab === "send") fetchData(); // Refresh logs
            } else {
                alert("Failed to send.");
            }
        } catch (err) {
            alert("Error sending.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                        onClick={() => setActiveTab("inbox")}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "inbox" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Inbox
                    </button>
                    <button
                        onClick={() => setActiveTab("send")}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "send" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Send / History
                    </button>
                </div>
            </div>

            {activeTab === "inbox" && (
                <div className="rounded-xl bg-white shadow-sm">
                    <div className="border-b p-4 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-800">Received Alerts</h2>
                        {notifications.some(n => !n.isRead) && (
                            <button onClick={() => handleMarkRead("all")} className="text-sm text-blue-600 hover:underline">Mark all read</button>
                        )}
                    </div>
                    <div className="divide-y">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No notifications.</div>
                        ) : (
                            notifications.map((note) => (
                                <div key={note.id} className={`p-4 transition-colors ${note.isRead ? "bg-white" : "bg-blue-50"}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                {note.type === "order" ? <span className="text-xl">📦</span> : <BellIcon className="text-blue-500" size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{note.title}</h4>
                                                <p className="text-gray-600">{note.message}</p>
                                                <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {!note.isRead && (
                                            <button onClick={() => handleMarkRead(note.id)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                                                Mark Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === "send" && (
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Sender Form */}
                    <div className="rounded-xl bg-white p-6 shadow-sm h-fit">
                        <h2 className="mb-4 text-lg font-bold text-gray-900">Send Notification</h2>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    value={sendForm.type}
                                    onChange={(e) => setSendForm({ ...sendForm, type: e.target.value })}
                                >
                                    <option value="bulk">Bulk (Group)</option>
                                    <option value="individual">Individual (User ID)</option>
                                </select>
                            </div>

                            {sendForm.type === "bulk" ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Recipients</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                        value={sendForm.recipients}
                                        onChange={(e) => setSendForm({ ...sendForm, recipients: e.target.value })}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="active">Active Plan Users</option>
                                        <option value="kakamega">Kakamega Region</option>
                                        <option value="bungoma">Bungoma Region</option>
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                        placeholder="Paste User ID here..."
                                        value={sendForm.individualId}
                                        onChange={(e) => setSendForm({ ...sendForm, individualId: e.target.value })}
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    value={sendForm.subject}
                                    onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    rows={4}
                                    value={sendForm.message}
                                    onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
                            >
                                {sending ? "Sending..." : "Send Notification"}
                            </button>
                        </form>
                    </div>

                    {/* History Log */}
                    <div className="rounded-xl bg-white shadow-sm">
                        <div className="border-b p-4">
                            <h2 className="font-semibold text-gray-800">Sent History</h2>
                        </div>
                        <div className="divide-y max-h-[600px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : sentLogs.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No history.</div>
                            ) : (
                                sentLogs.map((log) => (
                                    <div key={log.id} className="p-4">
                                        <div className="flex justify-between">
                                            <h4 className="font-medium text-gray-900">{log.subject}</h4>
                                            <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                            <span className="rounded bg-gray-100 px-2 py-0.5 border capitalize">{log.type}</span>
                                            <span>To: {log.recipients}</span>
                                            <span>• Sent to {log.sentCount} users</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
