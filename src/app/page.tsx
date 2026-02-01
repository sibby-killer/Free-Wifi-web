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

      {/* Hero Section - Soft UI Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] py-20 lg:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#5A6C7D] shadow-sm">
              Bringing affordable internet to Western Kenya
            </div>
            <h1 className="mt-8 text-5xl font-bold leading-tight text-[#2D3748] sm:text-6xl lg:text-7xl" style={{ fontFamily: 'Georgia, serif' }}>
              Simple, Reliable Internet
              <span className="block text-[#6B8EA5]">
                For Your Home
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-[#5A6C7D]">
              Fast internet shouldn't cost a fortune. Get 12 Mbps for just KES 2,000/month — 
              powered by Starlink satellite technology.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <SignUpButton mode="modal">
                <button className="group w-full rounded-full bg-[#6B8EA5] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#5A7D94] hover:shadow-xl sm:w-auto">
                  Get Started
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </SignUpButton>
              <a
                href="#plans"
                className="w-full rounded-full border-2 border-[#6B8EA5] bg-white px-8 py-4 text-lg font-semibold text-[#6B8EA5] shadow-md transition-all duration-300 hover:bg-[#6B8EA5] hover:text-white sm:w-auto"
              >
                View Plans
              </a>
            </div>
            
            {/* Trust badges */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
              <div className="rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl">⚡</div>
                <div className="mt-3 text-lg font-semibold text-[#2D3748]">Starlink Powered</div>
                <div className="mt-1 text-sm text-[#5A6C7D]">Reliable satellite technology</div>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl">✨</div>
                <div className="mt-3 text-lg font-semibold text-[#2D3748]">Free Installation</div>
                <div className="mt-1 text-sm text-[#5A6C7D]">No setup costs</div>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-4xl">💬</div>
                <div className="mt-3 text-lg font-semibold text-[#2D3748]">24/7 Support</div>
                <div className="mt-1 text-sm text-[#5A6C7D]">AI-powered assistance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why FreeWiFi KE Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#2D3748]" style={{ fontFamily: 'Georgia, serif' }}>Why Choose FreeWiFi KE?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#5A6C7D]">
              We're making reliable internet accessible to everyone in Western Kenya
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl bg-gradient-to-br from-[#F8F9FA] to-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6B8EA5] text-2xl text-white shadow-md">
                💰
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#2D3748]">Affordable Pricing</h3>
              <p className="mt-3 leading-relaxed text-[#5A6C7D]">
                Starting at just KES 1,500/month — half the price of traditional ISPs
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#F8F9FA] to-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6B8EA5] text-2xl text-white shadow-md">
                🌍
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#2D3748]">Satellite Technology</h3>
              <p className="mt-3 leading-relaxed text-[#5A6C7D]">
                Powered by Starlink for consistent, reliable connectivity
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#F8F9FA] to-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6B8EA5] text-2xl text-white shadow-md">
                📍
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#2D3748]">Local Coverage</h3>
              <p className="mt-3 leading-relaxed text-[#5A6C7D]">
                Serving Kakamega and Bungoma with expansion coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#2D3748]" style={{ fontFamily: 'Georgia, serif' }}>Simple Pricing</h2>
            <p className="mt-4 text-lg text-[#5A6C7D]">
              No contracts. No hidden fees. Just reliable internet.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* 10 Mbps Plan */}
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute right-4 top-4 rounded-full bg-[#A8D5BA] px-3 py-1 text-xs font-semibold text-white">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-[#2D3748]">Basic Plan</h3>
              <div className="mt-4">
                <span className="text-5xl font-bold text-[#6B8EA5]">1,500</span>
                <span className="text-lg text-[#5A6C7D]"> KES/month</span>
              </div>
              <div className="mt-2 text-lg font-semibold text-[#2D3748]">10 Mbps</div>
              <p className="mt-4 text-[#5A6C7D]">
                Perfect for browsing and video calls
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-[#5A6C7D]">
                  <span className="text-[#A8D5BA]">✓</span>
                  <span>10 Mbps speed</span>
                </li>
                <li className="flex items-center gap-3 text-[#5A6C7D]">
                  <span className="text-[#A8D5BA]">✓</span>
                  <span>Unlimited data</span>
                </li>
                <li className="flex items-center gap-3 text-[#5A6C7D]">
                  <span className="text-[#A8D5BA]">✓</span>
                  <span>Free installation</span>
                </li>
                <li className="flex items-center gap-3 text-[#5A6C7D]">
                  <span className="text-[#A8D5BA]">✓</span>
                  <span>24/7 support</span>
                </li>
              </ul>
              <SignUpButton mode="modal">
                <button className="mt-8 w-full rounded-full bg-[#6B8EA5] py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#5A7D94] hover:shadow-lg">
                  Get Started
                </button>
              </SignUpButton>
            </div>

            {/* 12 Mbps Plan */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6B8EA5] to-[#5A7D94] p-8 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                Best Value
              </div>
              <h3 className="text-2xl font-bold">Premium Plan</h3>
              <div className="mt-4">
                <span className="text-5xl font-bold">2,000</span>
                <span className="text-lg opacity-90"> KES/month</span>
              </div>
              <div className="mt-2 text-lg font-semibold">12 Mbps</div>
              <p className="mt-4 opacity-90">
                Ideal for streaming and multiple devices
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-[#A8D5BA]">✓</span>
                  <span>12 Mbps speed</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#A8D5BA]">✓</span>
                  <span>Unlimited data</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#A8D5BA]">✓</span>
                  <span>Free installation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#A8D5BA]">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <SignUpButton mode="modal">
                <button className="mt-8 w-full rounded-full bg-white py-3 font-semibold text-[#6B8EA5] shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section id="coverage" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#2D3748]" style={{ fontFamily: 'Georgia, serif' }}>Where We Serve</h2>
            <p className="mt-4 text-lg text-[#5A6C7D]">
              Currently available in Kakamega and Bungoma counties
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-gradient-to-br from-[#F8F9FA] to-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-bold text-[#6B8EA5]">📍 Kakamega</h3>
              <ul className="mt-4 space-y-2 text-[#5A6C7D]">
                <li>• Lurambi</li>
                <li>• Koro</li>
                <li>• Milimani</li>
                <li>• More areas available</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#F8F9FA] to-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-bold text-[#6B8EA5]">📍 Bungoma</h3>
              <ul className="mt-4 space-y-2 text-[#5A6C7D]">
                <li>• Marel</li>
                <li>• Bridge</li>
                <li>• Kanduyi</li>
                <li>• More areas available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#2D3748]" style={{ fontFamily: 'Georgia, serif' }}>Get In Touch</h2>
            <p className="mt-4 text-lg text-[#5A6C7D]">
              We're here to help you get connected
            </p>
          </div>
          <div className="mt-12 flex flex-col items-center gap-6">
            <a
              href="mailto:freewifiv4@gmail.com"
              className="flex w-full max-w-md items-center justify-center gap-3 rounded-full bg-[#6B8EA5] py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#5A7D94] hover:shadow-xl"
            >
              <span className="text-2xl">✉️</span>
              freewifiv4@gmail.com
            </a>
            <p className="mt-4 text-sm text-[#5A6C7D]">
              Or use our AI Chat for instant support after signing up
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D3748] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-center gap-2">
            <img src="/logo.jpg" alt="FreeWiFi KE" className="h-10 w-10 rounded-lg object-cover" />
            <span className="text-2xl font-bold text-[#A8D5BA]">FreeWiFi KE</span>
          </div>
          <p className="text-[#A0AEC0]">
            Simple, Reliable Internet for Your Home
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-[#A0AEC0]">
            <span>Kakamega & Bungoma</span>
            <span>•</span>
            <span>freewifiv4@gmail.com</span>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6">
            <Link href="/terms" className="text-sm text-[#A0AEC0] hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
            <span className="text-[#A0AEC0]">•</span>
            <Link href="/privacy" className="text-sm text-[#A0AEC0] hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
          </div>
          <div className="mt-6 text-sm text-[#718096]">
            © {new Date().getFullYear()} FreeWiFi KE. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
