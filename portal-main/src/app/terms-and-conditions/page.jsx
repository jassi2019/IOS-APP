"use client";

import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#F1BB3E]/10">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>

        {/* Last Updated */}
        <p className="text-gray-600 mb-8">Last Updated: January 27, 2025</p>

        {/* Acceptance of Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            By using Taiyari NEET ki, you agree to these Terms and Conditions.
            If you do not agree, please refrain from using the app.
          </p>
        </section>

        {/* App Purpose */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. App Purpose</h2>
          <p className="text-gray-700 leading-relaxed">
            Taiyari NEET ki is an educational platform designed to simplify NEET
            preparation by providing clear and concise explanations of NCERT
            content. It aims to help students prepare for exams efficiently.
          </p>
        </section>

        {/* User Accounts */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
          <p className="text-gray-700 leading-relaxed">
            Users are required to create an account to access certain features.
            You are responsible for maintaining the confidentiality of your
            account information.
          </p>
        </section>

        {/* Content Ownership */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Content Ownership</h2>
          <p className="text-gray-700 leading-relaxed">
            All content on Taiyari NEET ki is the intellectual property of the
            app and its creators. Unauthorized reproduction or distribution is
            strictly prohibited.
          </p>
        </section>

        {/* Subscription and Payments */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            5. Subscription and Payments
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Certain features of the app require a paid subscription. All
            payments are non-refundable. By subscribing, you acknowledge and
            accept this policy.
          </p>
        </section>

        {/* Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We value your privacy. Please review our{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            to understand how we collect, use, and protect your personal data.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            7. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Taiyari NEET ki will not be held liable for any damages resulting
            from the use or inability to use the app.
          </p>
        </section>

        {/* Modifications to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            8. Modifications to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to update these Terms and Conditions at any
            time. Users are advised to review them periodically for any changes.
          </p>
        </section>
      </div>
    </div>
  );
}
