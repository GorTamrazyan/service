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
                        Last updated: March 13, 2025
                    </p>

                    <div className="space-y-10 text-[var(--color-text)]/80 leading-relaxed">

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">1. Introduction</h2>
                            <p>
                                Welcome to ONIK'S VINYL (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">2. Information We Collect</h2>
                            <p className="mb-3">We collect information you provide directly to us, including:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Name and contact information (email address, phone number)</li>
                                <li>Account credentials (email and password)</li>
                                <li>Billing and payment information</li>
                                <li>Order history and preferences</li>
                                <li>Communications you send us</li>
                            </ul>
                            <p className="mt-3">We also automatically collect certain information when you visit our site, including your IP address, browser type, and pages visited.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">3. How We Use Your Information</h2>
                            <p className="mb-3">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Process and fulfill your orders</li>
                                <li>Create and manage your account</li>
                                <li>Process payments securely</li>
                                <li>Send order confirmations and updates</li>
                                <li>Respond to your questions and support requests</li>
                                <li>Improve our website and services</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">4. Payment Information</h2>
                            <p>
                                We use trusted third-party payment processors to handle all payment transactions. We do not store your full credit card number or payment card details on our servers. Payment information is encrypted and processed securely in accordance with PCI DSS standards. By making a purchase, you agree to provide accurate and complete payment information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">5. Sharing Your Information</h2>
                            <p className="mb-3">We do not sell or rent your personal information. We may share your information with:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Payment processors to complete transactions</li>
                                <li>Service providers who assist in our operations</li>
                                <li>Law enforcement when required by law</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">6. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">7. Your Rights</h2>
                            <p className="mb-3">You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access the personal information we hold about you</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your personal data</li>
                                <li>Opt out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">8. Cookies</h2>
                            <p>
                                We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">9. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date. We encourage you to review this policy periodically.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">10. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:{" "}
                                <span className="text-[var(--color-accent)] font-medium">[your email]</span>
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-[var(--color-text)]/10">
                        <Link
                            href="/terms"
                            className="text-[var(--color-accent)] hover:underline"
                        >
                            View Terms of Service →
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
