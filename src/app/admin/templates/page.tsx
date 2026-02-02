
"use client";

import { useState, useEffect } from "react";
import { DashboardIcon } from "@/components/ui/Icons";

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        content: "",
        category: "general"
    });

    const categories = ["general", "inquiry", "installation", "support", "payment"];

    // Fetch Templates
    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/admin/templates");
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
            }
        } catch (err) {
            console.error("Error fetching templates", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingTemplate
                ? `/api/admin/templates/${editingTemplate.id}`
                : "/api/admin/templates";
            const method = editingTemplate ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                setFormData({ name: "", content: "", category: "general" });
                setEditingTemplate(null);
                fetchTemplates();
                alert(editingTemplate ? "Template Updated!" : "Template Created!");
            } else {
                alert("Operation failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving template");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this template?")) return;
        try {
            const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchTemplates();
            } else {
                alert("Failed to delete");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openEdit = (t: any) => {
        setEditingTemplate(t);
        setFormData({ name: t.name, content: t.content, category: t.category });
        setShowModal(true);
    };

    const openNew = () => {
        setEditingTemplate(null);
        setFormData({ name: "", content: "", category: "general" });
        setShowModal(true);
    };

    if (loading) return <div className="p-8">Loading templates...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Message Templates</h1>
                    <p className="text-gray-500">Manage WhatsApp responses and automated messages.</p>
                </div>
                <button
                    onClick={openNew}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700"
                >
                    + New Template
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((t) => (
                    <div key={t.id} className="group relative flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${t.category === 'payment' ? 'bg-green-100 text-green-700' :
                                        t.category === 'support' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {t.category}
                                </span>
                                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button onClick={() => openEdit(t)} className="text-gray-500 hover:text-blue-600">✏️</button>
                                    <button onClick={() => handleDelete(t.id)} className="text-gray-500 hover:text-red-600">🗑️</button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">{t.name}</h3>
                            <div className="mt-4 rounded bg-gray-50 p-3 text-sm text-gray-600 font-mono whitespace-pre-wrap border border-gray-100">
                                {t.content}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t text-xs text-gray-400 flex justify-between">
                            <span>Last updated: {new Date(t.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}

                {templates.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="mb-4 rounded-full bg-gray-100 p-4">
                            <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="text-lg font-medium">No Templates Yet</h3>
                        <p className="mt-1 max-w-sm">Create your first message template to speed up your responses.</p>
                        <button onClick={openNew} className="mt-4 text-blue-600 hover:underline">Create Template</button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{editingTemplate ? "Edit Template" : "New Template"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="e.g. Payment Reminder"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message Content</label>
                                <p className="text-xs text-gray-500 mb-1">You can use variables like {'{name}'} in your message.</p>
                                <textarea
                                    required
                                    rows={5}
                                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                                    placeholder="Hello {name}, your subscription is due..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                                    {editingTemplate ? "Save Changes" : "Create Template"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
