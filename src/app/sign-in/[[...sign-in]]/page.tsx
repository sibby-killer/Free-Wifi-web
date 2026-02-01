"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GmailIcon, LockIcon, UserIcon } from "@/components/ui/Icons";

export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.jpg" alt="FreeWiFi KE" width={48} height={48} className="rounded-lg" />
            <span className="text-3xl font-bold text-[#0066FF]">FreeWiFi KE</span>
          </Link>
          <p className="mt-2 text-[#6B7280]">Welcome back! Sign in to continue.</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-[#1A1A2E] text-center">Sign In</h1>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  <GmailIcon size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">Only Gmail addresses are accepted</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  <LockIcon size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#0066FF] text-white font-semibold transition-all hover:bg-[#0052CC] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-[#6B7280]">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-[#6B7280]">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-[#0066FF] font-semibold hover:underline">
              Sign Up
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
