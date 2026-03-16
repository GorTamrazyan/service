import Header from "../client/components/Header";
import Footer from "../client/components/Footer";
import Link from "next/link";

export const metadata = {
    title: "Terms of Service | ONIK'S VINYL",
    description: "Terms of Service for ONIK'S VINYL",
};

export default function TermsOfServicePage() {
    return (
        <>
            <Header />
            <div style={{ marginTop: "80px" }} className="bg-[var(--color-background)] text-[var(--color-text)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl font-black text-[var(--color-primary)] mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-[var(--color-text)]/60 mb-12">
                        Last updated: March 13, 2025
                    </p>

                    <div className="space-y-10 text-[var(--color-text)]/80 leading-relaxed">

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">1. Agreement to Terms</h2>
                            <p>
                                By accessing or using the ONIK'S VINYL website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">2. Use of Services</h2>
                            <p className="mb-3">You agree to use our services only for lawful purposes. You must not:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide false or misleading information</li>
                                <li>Attempt to gain unauthorized access to any part of the website</li>
                                <li>Use the site in any way that could damage or impair its functionality</li>
                                <li>Engage in any fraudulent activity</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">3. Account Registration</h2>
                            <p>
                                To access certain features of our services, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Please notify us immediately of any unauthorized use of your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">4. Products and Orders</h2>
                            <p className="mb-3">When placing an order through our website:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>All product descriptions and prices are subject to change without notice</li>
                                <li>We reserve the right to refuse or cancel any order at our discretion</li>
                                <li>Orders are confirmed only after payment is successfully processed</li>
                                <li>Product availability is not guaranteed until your order is confirmed</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">5. Payments</h2>
                            <p className="mb-3">
                                All payments are processed securely through our third-party payment provider. By submitting a payment, you:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Confirm that you are authorized to use the payment method provided</li>
                                <li>Authorize us to charge the total amount of your order</li>
                                <li>Agree that all sales are final unless otherwise stated in our return policy</li>
                            </ul>
                            <p className="mt-3">
                                We use industry-standard encryption to protect your payment information. We do not store full payment card details on our servers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">6. Pricing</h2>
                            <p>
                                All prices displayed on our website are in US Dollars (USD) unless otherwise stated. Prices are subject to change without notice. We are not responsible for any pricing errors and reserve the right to cancel orders placed at incorrect prices.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">7. Cancellations and Refunds</h2>
                            <p>
                                Cancellations and refund requests are handled on a case-by-case basis. To request a cancellation or refund, please contact us as soon as possible after placing your order. Custom or made-to-order products may not be eligible for cancellation or refund once production has begun.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">8. Intellectual Property</h2>
                            <p>
                                All content on this website, including text, images, logos, and graphics, is the property of ONIK'S VINYL and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or use our content without prior written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">9. Limitation of Liability</h2>
                            <p>
                                To the fullest extent permitted by law, ONIK'S VINYL shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the specific order giving rise to the claim.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">10. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after any changes constitutes your acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">11. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms of Service, please contact us at:{" "}
                                <span className="text-[var(--color-accent)] font-medium">[your email]</span>
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-[var(--color-text)]/10">
                        <Link
                            href="/privacy"
                            className="text-[var(--color-accent)] hover:underline"
                        >
                            View Privacy Policy →
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
