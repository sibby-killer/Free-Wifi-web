"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "@/components/ui/Icons";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/admin/reviews");
            const data = await res.json();
            setReviews(data.reviews || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const res = await fetch("/api/admin/reviews", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchReviews();
        } catch (err) { alert("Failed to delete"); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Reviews Moderation</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full text-center p-8 text-gray-500">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="col-span-full text-center p-8 text-gray-500">No reviews found.</div>
                ) : (
                    reviews.map((r) => (
                        <div key={r.id} className="relative rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex text-yellow-500 space-x-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} size={16} filled={i < r.rating} />
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleDelete(r.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Review"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <p className="text-gray-800 text-sm mb-4 line-clamp-3">"{r.comment}"</p>
                            <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{r.user?.fullName || "Guest"}</span>
                                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
