"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleLogoClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 3) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    if (newCount === 4) {
      router.push("/admin");
      setClickCount(0);
      return;
    }

    clickTimeout.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button
              onClick={handleLogoClick}
              className={`flex items-center gap-2 transition-transform ${
                isShaking ? "animate-shake" : ""
              }`}
            >
              <img src="/logo.jpg" alt="FreeWiFi KE" className="h-10 w-10 rounded-lg object-cover" />
              <span className="text-2xl font-bold text-[#0066FF]">FreeWiFi KE</span>
            </button>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#plans" className="text-[#1A1A2E] hover:text-[#0066FF]">
                Plans
              </a>
              <a href="#coverage" className="text-[#1A1A2E] hover:text-[#0066FF]">
                Coverage
              </a>
              <a href="#contact" className="text-[#1A1A2E] hover:text-[#0066FF]">
                Contact
              </a>
            </div>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="rounded-full bg-[#0066FF] px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-[#0052CC]"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-[#1A1A2E] hover:text-[#0066FF]">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-full bg-[#0066FF] px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-[#0052CC]">
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0066FF] to-[#0052CC] py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              🚀 Bringing affordable internet to Western Kenya
            </div>
            <h1 className="mt-8 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              The Internet You Deserve,
              <span className="block bg-gradient-to-r from-[#FF6600] to-[#FFB800] bg-clip-text text-transparent">
                At a Price You Can Afford
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-blue-100">
              In Western Kenya, reliable internet costs KES 2,500+ for just 8 Mbps. We're changing that.
              Get <strong className="text-white">12 Mbps for only KES 2,000/month</strong> — powered by Starlink satellite technology.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <SignUpButton mode="modal">
                <button className="group w-full rounded-full bg-[#FF6600] px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-[#E55A00] hover:shadow-2xl sm:w-auto">
                  Get Connected Now
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
              </SignUpButton>
              <a
                href="#plans"
                className="w-full rounded-full border-2 border-white bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#0066FF] sm:w-auto"
              >
                View Plans
              </a>
            </div>
            
            {/* Trust badges */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-4xl">⚡</div>
                <div className="mt-3 text-lg font-semibold text-white">Starlink Powered</div>
                <div className="mt-1 text-sm text-blue-100">Satellite internet technology</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-4xl">🆓</div>
                <div className="mt-3 text-lg font-semibold text-white">Free Installation</div>
                <div className="mt-1 text-sm text-blue-100">No hidden setup costs</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-4xl">💬</div>
                <div className="mt-3 text-lg font-semibold text-white">24/7 AI Support</div>
                <div className="mt-1 text-sm text-blue-100">Instant help when you need it</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A2E] lg:text-4xl">The Problem</h2>
              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    ✗
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E]">Internet is Too Expensive</h3>
                    <p className="mt-1 text-[#6B7280]">
                      Competitors charge KES 2,500+ per month for only 8 Mbps
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    ✗
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E]">Unreliable Connections</h3>
                    <p className="mt-1 text-[#6B7280]">
                      Frequent downtime affects students, businesses, and families
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    ✗
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E]">Limited Coverage</h3>
                    <p className="mt-1 text-[#6B7280]">
                      Many areas in Kakamega and Bungoma have no service options
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#0066FF] lg:text-4xl">Our Solution</h2>
              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E]">Truly Affordable Pricing</h3>
                    <p className="mt-1 text-[#6B7280]">
                      10 Mbps at KES 1,500/month or 12 Mbps at KES 2,000/month
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E]">Starlink Technology</h3>
                    <p className="mt-1 text-[#6B7280]">
                      99.9% uptime with satellite internet — no cables, no infrastructure delays
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E]">Expanding Coverage</h3>
                    <p className="mt-1 text-[#6B7280]">
                      Currently serving Kakamega and Bungoma, with more regions coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#1A1A2E]">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-[#6B7280]">
              Simple, transparent pricing with no hidden fees
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* 10 Mbps Plan */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-md transition-all hover:scale-105 hover:border-[#0066FF] hover:shadow-xl">
              <div className="absolute right-0 top-0 rounded-bl-2xl bg-[#00CC88] px-4 py-2 text-sm font-semibold text-white">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A2E]">Basic Plan</h3>
              <div className="mt-4">
                <span className="text-5xl font-bold text-[#0066FF]">KES 1,500</span>
                <span className="text-lg text-[#6B7280]">/month</span>
              </div>
              <div className="mt-2 text-lg font-semibold text-[#1A1A2E]">10 Mbps</div>
              <p className="mt-4 text-[#6B7280]">
                Perfect for browsing, social media, and video calls
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-[#00CC88]">✓</span>
                  <span>10 Mbps download speed</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#00CC88]">✓</span>
                  <span>Unlimited data</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#00CC88]">✓</span>
                  <span>Free installation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#00CC88]">✓</span>
                  <span>24/7 support</span>
                </li>
              </ul>
              <SignUpButton mode="modal">
                <button className="mt-8 w-full rounded-full bg-[#0066FF] py-3 font-semibold text-white transition-colors hover:bg-[#0052CC]">
                  Get Started
                </button>
              </SignUpButton>
            </div>

            {/* 12 Mbps Plan */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-[#0066FF] bg-gradient-to-br from-[#0066FF] to-[#0052CC] p-8 text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <div className="absolute right-0 top-0 rounded-bl-2xl bg-[#FF6600] px-4 py-2 text-sm font-semibold">
                Best Value
              </div>
              <h3 className="text-2xl font-bold">Premium Plan</h3>
              <div className="mt-4">
                <span className="text-5xl font-bold">KES 2,000</span>
                <span className="text-lg opacity-90">/month</span>
              </div>
              <div className="mt-2 text-lg font-semibold">12 Mbps</div>
              <p className="mt-4 opacity-90">
                Ideal for streaming, gaming, and multiple devices
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-[#00CC88]">✓</span>
                  <span>12 Mbps download speed</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#00CC88]">✓</span>
                  <span>Unlimited data</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#00CC88]">✓</span>
                  <span>Free installation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#00CC88]">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <SignUpButton mode="modal">
                <button className="mt-8 w-full rounded-full bg-white py-3 font-semibold text-[#0066FF] transition-colors hover:bg-gray-100">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section id="coverage" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#1A1A2E]">Coverage Areas</h2>
            <p className="mt-4 text-lg text-[#6B7280]">
              We're expanding across Western Kenya
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-[#0066FF]">📍 Kakamega</h3>
              <ul className="mt-4 space-y-2 text-[#6B7280]">
                <li>• Lurambi</li>
                <li>• Koro</li>
                <li>• Milimani</li>
                <li>• And more areas</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-[#0066FF]">📍 Bungoma</h3>
              <ul className="mt-4 space-y-2 text-[#6B7280]">
                <li>• Marel</li>
                <li>• Bridge</li>
                <li>• Kanduyi</li>
                <li>• And more areas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#1A1A2E]">Get In Touch</h2>
            <p className="mt-4 text-lg text-[#6B7280]">
              We're here to help you get connected
            </p>
          </div>
          <div className="mt-12 flex flex-col items-center gap-6">
            <a
              href="mailto:freewifiv4@gmail.com"
              className="flex w-full max-w-md items-center justify-center gap-3 rounded-full bg-[#0066FF] py-4 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-[#0052CC]"
            >
              <span className="text-2xl">✉️</span>
              freewifiv4@gmail.com
            </a>
            <p className="mt-4 text-sm text-[#6B7280]">
              Or use our AI Chat for instant support after signing up
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 text-2xl font-bold text-[#0066FF]">FreeWiFi KE</div>
          <p className="text-gray-400">
            Affordable WiFi for Every Kenyan Home
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <span>Kakamega & Bungoma</span>
            <span>•</span>
            <span>freewifiv4@gmail.com</span>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            © {new Date().getFullYear()} FreeWiFi KE. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
