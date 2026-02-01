"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckIcon, WifiIcon } from "@/components/ui/Icons";

const REGIONS = {
  kakamega: {
    name: "Kakamega",
    subLocations: ["Lurambi", "Koro", "Milimani", "Others"]
  },
  bungoma: {
    name: "Bungoma",
    subLocations: ["Marel", "Bridge", "Kanduyi", "Others"]
  }
};

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    region: "",
    subLocation: "",
    customSubLocation: "",
  });

  // Load data from sign-up page if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("onboarding_data");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setFormData((prev) => ({
            ...prev,
            fullName: parsed.fullName || prev.fullName,
            phoneNumber: parsed.phoneNumber || prev.phoneNumber,
            region: parsed.region || prev.region,
            subLocation: parsed.subLocation || prev.subLocation,
          }));
          // Clear after reading
          localStorage.removeItem("onboarding_data");
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, []);

  // Pre-fill from Clerk user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        phoneNumber: prev.phoneNumber || user.phoneNumbers?.[0]?.phoneNumber || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate
    if (!formData.fullName || !formData.phoneNumber || !formData.region || !formData.subLocation) {
      setError("Please fill in all fields");
      return;
    }

    // Check Gmail policy
    const email = user.primaryEmailAddress?.emailAddress || "";
    if (!email.endsWith("@gmail.com")) {
      setError("Only Gmail addresses are accepted. Please sign up with a Gmail account.");
      return;
    }

    const finalSubLocation = formData.subLocation === "Others" ? formData.customSubLocation : formData.subLocation;
    if (formData.subLocation === "Others" && !formData.customSubLocation.trim()) {
      setError("Please specify your location");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Update Clerk user metadata
      await user.update({
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ").slice(1).join(" ") || undefined,
        unsafeMetadata: {
          phoneNumber: formData.phoneNumber,
          region: formData.region,
          subLocation: finalSubLocation,
          onboardingComplete: true,
        },
      });

      // Create user in database
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email,
          phoneNumber: formData.phoneNumber,
          region: formData.region,
          subLocation: finalSubLocation,
        }),
      });

      if (res.ok) {
        setCompleted(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const data = await res.json();
        // If user already exists, just redirect to dashboard
        if (data.error?.includes("already exists")) {
          router.push("/dashboard");
        } else {
          setError(data.error || "Failed to save profile");
        }
      }
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Failed to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSubLocations = () => {
    if (!formData.region) return [];
    return REGIONS[formData.region as keyof typeof REGIONS]?.subLocations || [];
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] flex items-center justify-center">
        <div className="text-lg text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckIcon size={40} />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-[#1A1A2E]">Welcome to FreeWiFi KE!</h1>
          <p className="mt-2 text-[#6B7280]">Your account is ready. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <Image src="/logo.jpg" alt="FreeWiFi KE" width={48} height={48} className="rounded-lg" />
            <span className="text-3xl font-bold text-[#0066FF]">FreeWiFi KE</span>
          </div>
          <p className="mt-2 text-[#6B7280]">Complete your profile to get started</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF]">
              <WifiIcon size={32} />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-[#1A1A2E]">Almost There!</h1>
            <p className="text-sm text-[#6B7280]">Confirm your details to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="07XXXXXXXX"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Region</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value, subLocation: "" })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                required
              >
                <option value="">Select your region</option>
                <option value="kakamega">Kakamega</option>
                <option value="bungoma">Bungoma</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Sub-location</label>
              <select
                value={formData.subLocation}
                onChange={(e) => setFormData({ ...formData, subLocation: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                required
                disabled={!formData.region}
              >
                <option value="">Select sub-location</option>
                {getSubLocations().map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {formData.subLocation === "Others" && (
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Specify Location</label>
                <input
                  type="text"
                  value={formData.customSubLocation}
                  onChange={(e) => setFormData({ ...formData, customSubLocation: e.target.value })}
                  placeholder="Enter your specific area"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#0066FF] text-white font-semibold transition-all hover:bg-[#0052CC] hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
