"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    region: "",
    subLocation: "",
    customSubLocation: "",
    agreedToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      alert("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (!formData.fullName || !formData.phoneNumber || !formData.region || !formData.subLocation) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      // Update Clerk user metadata
      const finalSubLocation = formData.subLocation === "Others" ? formData.customSubLocation : formData.subLocation;
      
      await user?.update({
        unsafeMetadata: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          region: formData.region,
          subLocation: finalSubLocation,
          onboardingCompleted: true,
        },
      });

      // Create user in Prisma database
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          phoneNumber: formData.phoneNumber,
          region: formData.region,
          subLocation: finalSubLocation,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to complete registration");
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
      alert("Failed to complete registration");
    } finally {
      setSubmitting(false);
    }
  };

  const getSubLocations = () => {
    if (formData.region === "kakamega") {
      return ["Lurambi", "Koro", "Milimani", "Others"];
    } else if (formData.region === "bungoma") {
      return ["Marel", "Bridge", "Kanduyi", "Others"];
    }
    return [];
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-[#1A1A2E]">Complete Your Profile</h1>
          <p className="mt-2 text-[#6B7280]">
            We need a few more details to get you connected
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E]">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E]">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="07XX XXX XXX or 01XX XXX XXX"
                pattern="^(07|01)\d{8}$"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                required
              />
              <p className="mt-1 text-sm text-[#6B7280]">
                Format: 07XXXXXXXX or 01XXXXXXXX
              </p>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E]">
                Email Address
              </label>
              <input
                type="email"
                value={user?.primaryEmailAddress?.emailAddress || ""}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-[#6B7280]"
                disabled
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E]">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value, subLocation: "", customSubLocation: "" })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                required
              >
                <option value="">Select your region</option>
                <option value="kakamega">Kakamega</option>
                <option value="bungoma">Bungoma</option>
              </select>
            </div>

            {/* Sub-location */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E]">
                Sub-location <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.subLocation}
                onChange={(e) => setFormData({ ...formData, subLocation: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                required
                disabled={!formData.region}
              >
                <option value="">Select your sub-location</option>
                {getSubLocations().map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Sub-location (if Others selected) */}
            {formData.subLocation === "Others" && (
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E]">
                  Specify Your Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customSubLocation}
                  onChange={(e) => setFormData({ ...formData, customSubLocation: e.target.value })}
                  placeholder="Enter your specific location"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  required
                />
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="rounded-lg border-2 border-[#0066FF] bg-blue-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="mt-1 h-5 w-5 flex-shrink-0 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF]"
                  required
                />
                <span className="text-sm text-[#1A1A2E]">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-medium text-[#0066FF] hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="font-medium text-[#0066FF] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  . I understand that:
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Router fee: KES 1,200 (or FREE if I have my own router)</li>
                    <li>Monthly subscription is required for service</li>
                    <li>Installation is FREE within coverage areas</li>
                  </ul>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-full bg-[#0066FF] py-4 text-lg font-semibold text-white transition-colors hover:bg-[#0052CC] disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Completing Registration..." : "Complete Registration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
