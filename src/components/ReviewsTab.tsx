"use client";

import { useEffect, useState } from "react";
import { getRelativeTime } from "@/lib/utils";
import { StarIcon } from "@/components/ui/Icons";

interface Review {
  id: string;
  rating: number;
  content: string | null;
  region: string;
  subLocation: string;
  createdAt: string;
  user: {
    fullName: string | null;
  };
}

export function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    content: "",
    region: "",
    subLocation: "",
  });

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?location=${location}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.region || !formData.subLocation) {
      alert("Please select region and sub-location");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Review submitted! It will appear after admin approval.");
        setShowModal(false);
        setFormData({
          rating: 5,
          content: "",
          region: "",
          subLocation: "",
        });
        fetchReviews();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon key={i} size={16} filled={i < rating} className="text-[#F59E0B]" />
    ));
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F59E0B]/10">
          <StarIcon size={20} filled className="text-[#F59E0B]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E]">Reviews</h1>
          <p className="text-[#6B7280]">See what others are saying</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mt-6">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
        >
          <option value="all">All Areas</option>
          <option value="kakamega-Lurambi">Kakamega - Lurambi</option>
          <option value="kakamega-Koro">Kakamega - Koro</option>
          <option value="kakamega-Milimani">Kakamega - Milimani</option>
          <option value="bungoma-Marel">Bungoma - Marel</option>
          <option value="bungoma-Bridge">Bungoma - Bridge</option>
          <option value="bungoma-Kanduyi">Bungoma - Kanduyi</option>
        </select>
      </div>

      {/* Write Review Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-6 rounded-full bg-[#0066FF] px-6 py-3 font-semibold text-white transition-transform hover:scale-105 hover:bg-[#0052CC]"
      >
        Write a Review
      </button>

      {/* Reviews List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-xl bg-white p-6 text-center shadow-md">
            <p className="text-[#6B7280]">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-center shadow-md">
            <p className="text-[#6B7280]">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-xl bg-white p-6 shadow-md">
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
              {review.content && (
                <p className="mt-3 text-[#1A1A2E]">&quot;{review.content}&quot;</p>
              )}
              <p className="mt-2 text-sm text-[#6B7280]">
                — {review.user.fullName || "Anonymous"} - {review.region} - {review.subLocation} -{" "}
                {getRelativeTime(review.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-[#1A1A2E]">Write a Review</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Rating
                </label>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <StarIcon size={32} filled={star <= formData.rating} className="text-[#F59E0B]" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => {
                    setFormData({ ...formData, region: e.target.value, subLocation: "" });
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  required
                >
                  <option value="">Select region</option>
                  <option value="kakamega">Kakamega</option>
                  <option value="bungoma">Bungoma</option>
                </select>
              </div>

              {/* Sub-location */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Sub-location
                </label>
                <select
                  value={formData.subLocation}
                  onChange={(e) => setFormData({ ...formData, subLocation: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  required
                  disabled={!formData.region}
                >
                  <option value="">Select sub-location</option>
                  {formData.region === "kakamega" && (
                    <>
                      <option value="Lurambi">Lurambi</option>
                      <option value="Koro">Koro</option>
                      <option value="Milimani">Milimani</option>
                      <option value="Others">Others</option>
                    </>
                  )}
                  {formData.region === "bungoma" && (
                    <>
                      <option value="Marel">Marel</option>
                      <option value="Bridge">Bridge</option>
                      <option value="Kanduyi">Kanduyi</option>
                      <option value="Others">Others</option>
                    </>
                  )}
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Your Review (Optional)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share your experience"
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-full border-2 border-gray-300 py-3 font-semibold text-[#1A1A2E] transition-colors hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#0066FF] py-3 font-semibold text-white transition-colors hover:bg-[#0052CC] disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
