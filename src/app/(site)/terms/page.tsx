import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Elite Property PK",
  description:
    "Terms of Service for Elite Property PK. Read our terms and conditions for using our real estate platform.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <section className="py-16  bg-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Welcome to Elite Property PK. By accessing or using this website,
              you agree to comply with and be bound by the following Terms of
              Service. Please read them carefully before using our platform.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 font-semibold">
              If you do not agree to these terms, you should not use our
              website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By visiting and using{" "}
              <a
                href="https://elitepropertypk.com"
                className="text-[#f77f00] hover:underline"
              >
                elitepropertypk.com
              </a>
              , you acknowledge that you have read, understood, and agreed to
              these Terms of Service and our Privacy Policy.
            </p>
            <p className="text-gray-700">
              We reserve the right to modify or update these terms at any time
              without prior notice. Any changes will be posted on this page with
              an updated effective date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              2. Services Provided
            </h2>
            <p className="text-gray-700 mb-4">Elite Property PK provides:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Property listings and real estate information.</li>
              <li>Lead generation and property inquiry services.</li>
              <li>Property marketing and promotion for verified properties.</li>
              <li>Assistance through our real estate agents and partners.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We act as a real estate marketing platform and do not guarantee
              property availability, final sale, or pricing. All property
              transactions are subject to direct agreements between buyers,
              sellers, and authorized agents.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-gray-700 mb-4">
              By using this website, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Provide accurate and truthful information when submitting forms
                or inquiries.
              </li>
              <li>Use the website only for lawful purposes.</li>
              <li>
                Not post, transmit, or share any misleading, offensive, or
                fraudulent content.
              </li>
              <li>
                Not attempt to hack, interfere with, or disrupt the
                platform&apos;s security.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              4. Property Listings & Content
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                All listings on our website are for marketing and informational
                purposes only.
              </li>
              <li>
                Prices, specifications, and availability are subject to change
                without notice.
              </li>
              <li>
                We make reasonable efforts to display verified and updated
                listings, but we do not guarantee accuracy or completeness.
              </li>
              <li>
                Elite Property PK is not responsible for any misrepresentation
                made by third-party property owners or agents.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              5. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-4">
              Our website may include links or integrations to third-party
              platforms (such as property developers, payment gateways, Meta, or
              Google).
            </p>
            <p className="text-gray-700">
              We are not responsible for the content, services, or actions of
              these third parties. Use of third-party websites is at your own
              risk.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              Elite Property PK shall not be held liable for any:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Financial loss, damages, or disputes arising from real estate
                transactions.
              </li>
              <li>
                Errors or inaccuracies in listings or property information.
              </li>
              <li>
                Service interruptions, technical issues, or unauthorized access.
              </li>
            </ul>
            <p className="text-gray-700 mt-4 font-semibold">
              Your use of this website is at your own risk.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-4">
              All content on this website—including logos, branding, text,
              images, and design—is the property of Elite Property PK or its
              content providers.
            </p>
            <p className="text-gray-700">
              You may not copy, reproduce, distribute, or use our content
              without prior written consent.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              8. Indemnification
            </h2>
            <p className="text-gray-700">
              You agree to indemnify and hold Elite Property PK, its team,
              agents, and partners harmless from any claims, losses, or damages
              (including legal fees) arising out of your use of this website or
              your violation of these Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              9. Termination of Use
            </h2>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate access to our website
              or services at any time, without notice, if we believe you have
              violated these Terms of Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              10. Governing Law
            </h2>
            <p className="text-gray-700">
              These Terms of Service shall be governed by and interpreted in
              accordance with the laws of Pakistan. Any disputes shall be
              resolved in the appropriate courts of Islamabad, Pakistan.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions regarding these Terms of Service, you
              can contact us at:
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
