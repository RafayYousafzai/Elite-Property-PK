import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Elite Property PK",
  description:
    "Privacy Policy for Elite Property PK. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            Privacy Policy
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              At Elite Property PK, we respect your privacy and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, and safeguard your data when you visit or
              interact with our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, and any other information you voluntarily provide
                through forms (e.g., inquiry forms, lead generation, or contact
                forms).
              </li>
              <li>
                <strong>Usage Information:</strong> Your IP address, browser
                type, operating system, referring URLs, and browsing behavior on
                our site.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies to enhance
                your experience, personalize content, and analyze website
                traffic.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We may use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Respond to your inquiries and provide property details.</li>
              <li>
                Send you property updates, offers, or newsletters (if
                subscribed).
              </li>
              <li>Improve our website and user experience.</li>
              <li>
                Run targeted marketing campaigns through third-party platforms
                (e.g., Meta, Google).
              </li>
              <li>Comply with legal obligations.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              3. How We Share Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information. However, we may share it
              with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Trusted partners (e.g., property agents or developers) to assist
                with your inquiries.
              </li>
              <li>
                Service providers that help us operate the website or run
                marketing campaigns.
              </li>
              <li>Legal authorities if required by law.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Remember your preferences and improve your experience.</li>
              <li>Analyze website performance.</li>
              <li>Deliver personalized ads.</li>
            </ul>
            <p className="text-gray-700">
              You can control or disable cookies in your browser settings, but
              some features may not work properly without them.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              5. Data Protection
            </h2>
            <p className="text-gray-700">
              We implement appropriate security measures to protect your data
              against unauthorized access, alteration, or disclosure. However,
              no online platform can guarantee 100% security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700 mb-4">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Opt out of marketing communications at any time.</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, you can contact us at{" "}
              <a
                href="mailto:info@elitepropertypk.com"
                className="text-[#f77f00] hover:underline"
              >
                info@elitepropertypk.com
              </a>
              .
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              7. Third-Party Links
            </h2>
            <p className="text-gray-700">
              Our website may contain links to third-party websites (e.g.,
              property listings, partner developers). We are not responsible for
              the privacy practices of these websites.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              8. Policy Updates
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. The updated
              version will be posted on this page with a revised Effective Date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              9. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions or concerns about this Privacy Policy,
              you can contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                📍 <strong>Elite Property Exchange</strong>
              </p>
              <p className="text-gray-700">
                📧{" "}
                <a
                  href="mailto:info@elitepropertypk.com"
                  className="text-[#f77f00] hover:underline"
                >
                  info@elitepropertypk.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
