"use client";

import { useEffect, useState } from "react";

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [reply, setReply] = useState("");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/admin/tickets");
            const data = await res.json();
            setTickets(data.tickets || []);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    const handleUpdate = async (id: string, status: string, response?: string) => {
        try {
            const res = await fetch("/api/admin/tickets", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status, adminResponse: response })
            });
            if (res.ok) {
                setEditingId(null);
                setReply("");
                fetchTickets();
            }
        } catch (err) { alert("Error updating"); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>

            <div className="grid gap-6">
                {loading ? (
                    <div>Loading...</div>
                ) : tickets.length === 0 ? (
                    <div>No tickets found.</div>
                ) : (
                    tickets.map((t) => (
                        <div key={t.id} className="rounded-xl bg-white p-6 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold text-white ${t.status === 'open' ? 'bg-red-500' : 'bg-green-500'}`}>
                                            {t.status}
                                        </span>
                                        <h3 className="font-bold text-gray-900">{t.problemType}</h3>
                                    </div>
                                    <p className="mt-1 text-gray-600">{t.description}</p>
                                    <div className="mt-2 text-sm text-gray-500">
                                        From: {t.user?.fullName} ({t.user?.phoneNumber}) • {new Date(t.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {t.status === 'open' && (
                                        <button
                                            onClick={() => handleUpdate(t.id, 'resolved')}
                                            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditingId(editingId === t.id ? null : t.id)}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200"
                                    >
                                        {editingId === t.id ? "Cancel" : "Reply"}
                                    </button>
                                </div>
                            </div>

                            {/* Admin Response Display */}
                            {t.adminResponse && (
                                <div className="mt-4 border-t pt-3">
                                    <p className="text-sm font-semibold text-gray-700">Admin Response:</p>
                                    <p className="text-sm text-gray-600">{t.adminResponse}</p>
                                </div>
                            )}

                            {/* Reply Editor */}
                            {editingId === t.id && (
                                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                    <textarea
                                        className="w-full border rounded p-2 text-sm"
                                        placeholder="Write a response..."
                                        rows={3}
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                    />
                                    <div className="mt-2 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleUpdate(t.id, 'open', reply)} // Status remains open if just replying? Or resolved? Let's keep open unless resolved explicitly.
                                            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                        >
                                            Send Reply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
