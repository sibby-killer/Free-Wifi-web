"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GmailIcon, LockIcon, UserIcon, LocationIcon, CheckIcon } from "@/components/ui/Icons";

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

export default function SignUpPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    region: "",
    subLocation: "",
    customSubLocation: "",
  });

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.region || !formData.subLocation) {
      setError("Please select your location");
      return;
    }
    if (formData.subLocation === "Others" && !formData.customSubLocation.trim()) {
      setError("Please specify your location");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      setError("Please fill in all fields");
      return;
    }
    if (!formData.email.endsWith("@gmail.com")) {
      setError("Only Gmail addresses are accepted");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ").slice(1).join(" ") || undefined,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Store additional data for onboarding
        const finalSubLocation = formData.subLocation === "Others" ? formData.customSubLocation : formData.subLocation;
        localStorage.setItem("onboarding_data", JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          region: formData.region,
          subLocation: finalSubLocation,
        }));

        router.push("/onboarding");
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const getSubLocations = () => {
    if (!formData.region) return [];
    return REGIONS[formData.region as keyof typeof REGIONS]?.subLocations || [];
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo.jpg" alt="FreeWiFi KE" width={48} height={48} className="rounded-lg" />
              <span className="text-3xl font-bold text-[#0066FF]">FreeWiFi KE</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF]">
                <GmailIcon size={32} />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-[#1A1A2E]">Verify Your Email</h1>
              <p className="mt-2 text-[#6B7280]">
                We sent a verification code to<br />
                <span className="font-medium text-[#1A1A2E]">{formData.email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleVerification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] text-center text-2xl tracking-widest focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#0066FF] text-white font-semibold transition-all hover:bg-[#0052CC] disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.jpg" alt="FreeWiFi KE" width={48} height={48} className="rounded-lg" />
            <span className="text-3xl font-bold text-[#0066FF]">FreeWiFi KE</span>
          </Link>
          <p className="mt-2 text-[#6B7280]">Create your account to get started</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${step >= s
                    ? "bg-[#0066FF] text-white"
                    : "bg-gray-200 text-[#6B7280]"
                  }`}
              >
                {step > s ? <CheckIcon size={16} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 mx-1 rounded ${step > s ? "bg-[#0066FF]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF]">
                  <LocationIcon size={24} />
                </div>
                <h2 className="mt-3 text-xl font-bold text-[#1A1A2E]">Where are you located?</h2>
                <p className="text-sm text-[#6B7280]">Help us confirm coverage in your area</p>
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
                className="w-full py-3 rounded-full bg-[#0066FF] text-white font-semibold transition-all hover:bg-[#0052CC] hover:scale-[1.02]"
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF]">
                  <UserIcon size={24} />
                </div>
                <h2 className="mt-3 text-xl font-bold text-[#1A1A2E]">Personal Information</h2>
                <p className="text-sm text-[#6B7280]">Tell us about yourself</p>
              </div>

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
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                    <GmailIcon size={20} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-[#6B7280]">Only Gmail addresses are accepted</p>
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

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-full border-2 border-gray-300 text-[#1A1A2E] font-semibold hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#0066FF] text-white font-semibold transition-all hover:bg-[#0052CC]"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF]">
                  <LockIcon size={24} />
                </div>
                <h2 className="mt-3 text-xl font-bold text-[#1A1A2E]">Create Password</h2>
                <p className="text-sm text-[#6B7280]">Secure your account</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                  required
                  minLength={8}
                />

                {/* Password Strength Bar */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${i <= passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      Strength: {strengthLabels[passwordStrength - 1] || "Too short"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-full border-2 border-gray-300 text-[#1A1A2E] font-semibold hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-full bg-[#0066FF] text-white font-semibold transition-all hover:bg-[#0052CC] disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-[#6B7280]">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-[#6B7280]">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#0066FF] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="mt-6 text-center">
          <Link href="/" className="text-[#6B7280] hover:text-[#0066FF] text-sm">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
