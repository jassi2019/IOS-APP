"use client";

import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F1BB3E]/10">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

        {/* Last Updated */}
        <p className="text-gray-600 mb-8">Last Updated: January 27, 2025</p>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Taiyari NEET ki ("we," "our," or "us"). We are committed
            to protecting your privacy and ensuring the security of your
            personal information. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our
            educational platform and services.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            2. Information We Collect
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We collect the following types of information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Personal Information: Name, email address, phone number, and
              academic history
            </li>
            <li>
              Usage Data: Study patterns, test scores, and platform interaction
              statistics
            </li>
            <li>
              Device Information: Device type, operating system, and IP address
            </li>
            <li>
              Payment Information: Transaction records and payment method
              details
            </li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We use your information to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Personalize your learning experience</li>
            <li>Track your academic progress</li>
            <li>Provide customer support</li>
            <li>Improve our educational services and content</li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        {/* Data Sharing */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Data Sharing</h2>
          <p className="text-gray-700 leading-relaxed">
            We may share your information with third-party service providers who
            assist us in operating our platform, conducting our business, or
            serving our users. These third parties are bound by confidentiality
            agreements and are prohibited from using your information for any
            other purpose.
          </p>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy or our
            practices, please contact us at:
            <br />
            Email: privacy@taiyarineetki.com
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date at the top of this policy.
          </p>
        </section>
      </div>
    </div>
  );
}
