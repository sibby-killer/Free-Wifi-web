"use client";

import { useEffect, useState } from "react";
import { CheckIcon, TrashIcon } from "@/components/ui/Icons";

interface Review {
    id: string;
    rating: number;
    content: string;
    approved: boolean;
    createdAt: string;
    user: {
        fullName: string;
    };
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews?all=true");
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch("/api/reviews", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId: id, approved: !currentStatus })
            });
            if (res.ok) {
                fetchReviews();
            } else {
                alert("Failed");
            }
        } catch (err) {
            alert("Error");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[#1A1A2E]">Manage Reviews</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-yellow-500 font-bold">★ {review.rating}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${review.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {review.approved ? "Approved" : "Pending"}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-800 italic">"{review.content}"</p>
                                <div className="mt-2 text-sm text-gray-500">
                                    By: <span className="font-medium text-gray-900">{review.user?.fullName}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleApproval(review.id, review.approved)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${review.approved
                                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                    }`}
                            >
                                {review.approved ? "Unapprove" : "Approve"}
                            </button>
                        </div>
                    ))}
                    {reviews.length === 0 && <p>No reviews found.</p>}
                </div>
            )}
        </div>
    );
}
