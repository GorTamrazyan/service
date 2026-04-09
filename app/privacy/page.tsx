import Header from "../client/components/Header";
import Footer from "../client/components/Footer";
import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | ONIK'S VINYL",
    description: "Privacy Policy for ONIK'S VINYL",
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <Header />
            <div style={{ marginTop: "80px" }} className="bg-[var(--color-background)] text-[var(--color-text)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl font-black text-[var(--color-primary)] mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-[var(--color-text)]/60 mb-12">
                        Last updated: [DATE]
                    </p>

                    <div className="space-y-10 text-[var(--color-text)]/80 leading-relaxed">

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">1. Introduction</h2>
                            <p>
                                Welcome to ONIK&apos;S VINYL (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;), operated by [COMPANY LEGAL NAME], located at [COMPANY ADDRESS]. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit [WEBSITE URL] and use our services.
                            </p>
                            <p className="mt-3">
                                By using our website, you consent to the data practices described in this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">2. Information We Collect</h2>
                            <p className="mb-3 font-semibold">Personal Information You Provide:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Name and contact information (email, phone number)</li>
                                <li>Account credentials (email and password)</li>
                                <li>Shipping and billing address</li>
                                <li>Order history and preferences</li>
                                <li>Consultation booking details (name, email, phone, project details)</li>
                                <li>Communications you send us</li>
                            </ul>
                            <p className="mb-3 font-semibold">Payment Information:</p>
                            <p className="mb-4">
                                We use Stripe as our payment processor. Your payment information (credit/debit card, Apple Pay, Google Pay) is collected and processed directly by Stripe. We do not store full payment card details on our servers.
                            </p>
                            <p className="mb-3 font-semibold">Automatically Collected Information:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>IP address, browser type, operating system</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Device information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">3. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Process and fulfill your orders</li>
                                <li>Create and manage your account</li>
                                <li>Send order confirmations, shipping updates, and status notifications via email</li>
                                <li>Respond to inquiries and support requests</li>
                                <li>Process consultation bookings</li>
                                <li>Improve our website and services</li>
                                <li>Detect and prevent fraud</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">4. How We Share Your Information</h2>
                            <p className="mb-3">We do not sell, trade, or rent your personal information. We share data only with:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Stripe — payment processing</li>
                                <li>Firebase (Google) — authentication and data storage</li>
                                <li>Cloudinary — image storage and optimization</li>
                                <li>Nodemailer (Gmail) — transactional emails</li>
                                <li>Law enforcement — if required by law or court order</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">5. Data Storage and Security</h2>
                            <p className="mb-3">Your data is stored on Google Firebase (Firestore) servers. We use:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-3">
                                <li>HTTPS/SSL encrypted transmission</li>
                                <li>Firebase Authentication</li>
                                <li>Role-based access controls</li>
                                <li>Stripe PCI DSS compliant payment processing</li>
                            </ul>
                            <p>No method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">6. Data Retention</h2>
                            <p>
                                We retain your personal information as long as your account is active or as needed to provide services. You may request deletion of your account and data at any time by contacting us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">7. Your Rights</h2>
                            <p className="mb-3">You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Access the personal information we hold about you</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your personal data</li>
                                <li>Opt out of marketing communications</li>
                                <li>Request a copy of your data in a structured format</li>
                            </ul>
                            <p className="mb-2 font-semibold">California Residents (CCPA):</p>
                            <p>
                                You have the right to know what personal information is collected, request its deletion, and opt out of its sale. We do not sell personal data. To exercise these rights, contact us at [CONTACT EMAIL].
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">8. Children&apos;s Privacy</h2>
                            <p>
                                Our services are not directed to individuals under 13. We do not knowingly collect data from children under 13.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">9. Cookies</h2>
                            <p>
                                We use cookies to enhance your experience, remember preferences (such as language), and analyze traffic. You can control cookies through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">10. Third-Party Links</h2>
                            <p>
                                Our website may contain links to third-party sites. We are not responsible for their privacy practices.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">11. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">12. Contact Us</h2>
                            <p>ONIK&apos;S VINYL</p>
                            <p>[COMPANY LEGAL NAME]</p>
                            <p>[COMPANY ADDRESS]</p>
                            <p>Email: [CONTACT EMAIL]</p>
                            <p>Phone: [PHONE NUMBER]</p>
                        </section>

                    </div>

                    <div className="mt-12 pt-8 border-t border-[var(--color-text)]/10 flex gap-6">
                        <Link href="/terms" className="text-[var(--color-accent)] hover:underline">
                            View Terms of Service →
                        </Link>
                        <Link href="/refund" className="text-[var(--color-accent)] hover:underline">
                            View Refund Policy →
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
