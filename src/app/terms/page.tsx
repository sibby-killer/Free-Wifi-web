import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-[#0066FF]">
              FreeWiFi KE
            </Link>
            <Link
              href="/"
              className="text-sm text-[#6B7280] hover:text-[#0066FF]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-4xl font-bold text-[#1A1A2E]">Terms of Service</h1>
          <p className="mt-2 text-[#6B7280]">Last updated: January 2026</p>

          <div className="mt-8 space-y-6 text-[#1A1A2E]">
            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                1. Service Description
              </h2>
              <p className="mt-2 leading-relaxed text-[#6B7280]">
                FreeWiFi KE provides WiFi hotspot installation and internet connectivity services in Kakamega and Bungoma counties, Kenya. We work with Starlink technology to deliver fast and affordable internet to underserved areas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                2. Subscription Plans
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li><strong>10 Mbps Plan:</strong> KES 1,500 per month</li>
                <li><strong>12 Mbps Plan:</strong> KES 2,000 per month</li>
              </ul>
              <p className="mt-2 leading-relaxed text-[#6B7280]">
                All plans include unlimited data and 24/7 customer support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                3. Router & Equipment
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li><strong>Router purchase:</strong> KES 1,200 (one-time fee)</li>
                <li>If you have a compatible router, no equipment fee is required</li>
                <li>Installation is FREE within our coverage areas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                4. Payment Terms
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li>Monthly subscription must be paid in advance</li>
                <li>Payment methods: M-Pesa, Bank Transfer</li>
                <li>Service may be suspended for non-payment after 3 days grace period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                5. Service Level Agreement
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li>We aim for 99.9% uptime</li>
                <li>Maintenance windows will be communicated in advance</li>
                <li>Support available via WhatsApp, Email, and AI Chat</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                6. User Responsibilities
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li>Provide accurate registration information</li>
                <li>Use the service for lawful purposes only</li>
                <li>Protect your account credentials</li>
                <li>Report any service issues promptly</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                7. Termination
              </h2>
              <p className="mt-2 leading-relaxed text-[#6B7280]">
                Either party may terminate the service with 7 days notice. No refunds are provided for partial months. Equipment remains your property after purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">8. Contact</h2>
              <p className="mt-2 leading-relaxed text-[#6B7280]">
                For questions about these terms, contact us at{" "}
                <a
                  href="mailto:freewifiv4@gmail.com"
                  className="text-[#0066FF] hover:underline"
                >
                  freewifiv4@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
