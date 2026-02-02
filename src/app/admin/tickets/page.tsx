"use client";

import { useEffect, useState } from "react";
import { ToolIcon, CheckIcon } from "@/components/ui/Icons";

interface Ticket {
    id: string;
    subject?: string; // or problemType
    problemType: string;
    description: string;
    urgency: string;
    status: string;
    createdAt: string;
    user: {
        fullName: string;
        phoneNumber: string;
    };
}

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/tickets");
            if (res.ok) {
                const data = await res.json();
                setTickets(data.tickets || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markResolved = async (id: string) => {
        if (!confirm("Mark this ticket as resolved?")) return;
        try {
            const res = await fetch("/api/tickets", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId: id, status: "resolved" })
            });
            if (res.ok) {
                fetchTickets();
            } else {
                alert("Failed");
            }
        } catch (err) {
            alert("Error");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[#1A1A2E]">Support Tickets</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ticket.urgency === 'critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {ticket.urgency}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-[#1A1A2E]">{ticket.problemType}</h3>
                                <p className="text-gray-600 mt-1">{ticket.description}</p>
                                <div className="mt-3 text-sm text-gray-500">
                                    User: <span className="font-medium text-gray-900">{ticket.user?.fullName}</span> •
                                    Phone: <span className="font-medium text-gray-900">{ticket.user?.phoneNumber}</span>
                                </div>
                            </div>

                            {ticket.status !== 'resolved' && (
                                <button
                                    onClick={() => markResolved(ticket.id)}
                                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <CheckIcon size={18} /> Resolve
                                </button>
                            )}
                        </div>
                    ))}
                    {tickets.length === 0 && <p>No tickets found.</p>}
                </div>
            )}
        </div>
    );
}
