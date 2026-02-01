import Link from "next/link";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-[#1A1A2E]">Privacy Policy</h1>
          <p className="mt-2 text-[#6B7280]">Last updated: January 2026</p>

          <div className="mt-8 space-y-6 text-[#1A1A2E]">
            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                1. Information We Collect
              </h2>
              <p className="mt-2 leading-relaxed text-[#6B7280]">
                We collect the following information when you register:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Location (Region and Sub-location)</li>
                <li>Username and encrypted password</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                2. How We Use Your Information
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li>To provide and maintain our WiFi services</li>
                <li>To process your orders and installations</li>
                <li>To communicate service updates and announcements</li>
                <li>To respond to support requests</li>
                <li>To improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                3. Information Sharing
              </h2>
              <p className="mt-2 leading-relaxed text-[#6B7280]">
                We do NOT sell or share your personal information with third parties except:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li>When required by law</li>
                <li>To process payments (M-Pesa, banks)</li>
                <li>To provide technical support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                4. Data Security
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li>Passwords are encrypted using industry-standard hashing</li>
                <li>Data is stored on secure servers</li>
                <li>We use HTTPS for all communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">
                5. Your Rights
              </h2>
              <p className="mt-2 leading-relaxed text-[#6B7280]">
                You have the right to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-[#6B7280]">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">6. Cookies</h2>
              <p className="mt-2 leading-relaxed text-[#6B7280]">
                We use essential cookies for authentication and session management. No tracking cookies are used for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0066FF]">7. Contact</h2>
              <p className="mt-2 leading-relaxed text-[#6B7280]">
                For privacy concerns, contact us at{" "}
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
