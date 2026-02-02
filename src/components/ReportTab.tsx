"use client";

import { useState } from "react";
import { ToolIcon } from "./ui/Icons";

export function ReportTab() {
    const [problemType, setProblemType] = useState("internet");
    const [description, setDescription] = useState("");
    const [urgency, setUrgency] = useState("normal");
    const [loading, setLoading] = useState(false);

    // Admin WhatsApp Number (Should be in env, but hardcoding or fetching is fine)
    // Assuming user wants to redirect to "Admin"
    const ADMIN_WHATSAPP = "254712345678"; // Replace with actual or env

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: problemType, description, urgency }),
            });

            if (res.ok) {
                // Prompt for WhatsApp
                const confirmWA = window.confirm("Report submitted! Do you want to send this to Admin on WhatsApp for faster response?");
                if (confirmWA) {
                    const text = encodeURIComponent(`Hello Admin, I have reported a '${problemType}' issue: ${description} (Urgency: ${urgency})`);
                    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${text}`, "_blank");
                } else {
                    alert("Report submitted successfully.");
                }
                setDescription("");
                setProblemType("internet");
            } else {
                alert("Failed to create ticket.");
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <h1 className="text-3xl font-bold text-[#1A1A2E]">Report a Problem</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Problem Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {["internet", "router", "speed", "billing", "other"].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setProblemType(type)}
                                    className={`py-2 px-4 rounded-lg text-sm font-medium capitalize border ${problemType === type
                                            ? "bg-blue-50 border-blue-500 text-blue-700"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                        <select
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-2"
                        >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 p-3"
                            placeholder="Describe user issue..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#FF6600] py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#E65C00] disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit Report"}
                    </button>
                </form>
            </div>
        </div>
    );
}
