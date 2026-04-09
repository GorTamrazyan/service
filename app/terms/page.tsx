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
                        Last updated: [DATE]
                    </p>

                    <div className="space-y-10 text-[var(--color-text)]/80 leading-relaxed">

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">1. Agreement to Terms</h2>
                            <p>
                                By accessing or using the ONIK&apos;S VINYL website at [WEBSITE URL], you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">2. Use of Services</h2>
                            <p className="mb-3">You agree to use our services only for lawful purposes. You must not:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-3">
                                <li>Provide false or misleading information</li>
                                <li>Attempt unauthorized access to any part of the website</li>
                                <li>Use the site in any way that could damage or impair its functionality</li>
                                <li>Engage in fraudulent activity</li>
                                <li>Use automated systems (bots, scrapers) without written permission</li>
                            </ul>
                            <p>We reserve the right to terminate or suspend your access at our sole discretion.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">3. Account Registration</h2>
                            <p className="mb-3">To place orders, view order history, or book consultations, you must create an account. You agree to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-3">
                                <li>Provide accurate and complete information</li>
                                <li>Keep your password secure and confidential</li>
                                <li>Accept responsibility for all activities under your account</li>
                                <li>Notify us immediately of any unauthorized use</li>
                            </ul>
                            <p>You must be at least 18 years old to create an account.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">4. Products and Orders</h2>
                            <p className="mb-3">
                                We make every effort to display products accurately. However, actual colors may vary slightly due to screen differences and manufacturing processes.
                            </p>
                            <p className="mb-3">When placing an order:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-3">
                                <li>Prices and descriptions are subject to change without notice</li>
                                <li>We reserve the right to refuse or cancel any order</li>
                                <li>Orders are confirmed only after successful payment processing</li>
                                <li>Product availability is not guaranteed until confirmation</li>
                                <li>You will receive an email confirmation with order details</li>
                            </ul>
                            <p>We reserve the right to cancel any order due to product unavailability, pricing errors, or suspected fraud. Cancelled orders receive a full refund.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">5. Payments</h2>
                            <p className="mb-3">Payments are processed securely through Stripe. We accept:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-3">
                                <li>Credit/Debit Cards (Visa, Mastercard, American Express)</li>
                                <li>Apple Pay</li>
                                <li>Google Pay</li>
                                <li>Cash on Delivery (where available)</li>
                            </ul>
                            <p>By submitting payment, you confirm you are authorized to use the payment method and authorize us to charge the total amount including applicable taxes and shipping. We do not store full payment card details.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">6. Pricing</h2>
                            <p>
                                All prices are in US Dollars (USD). Prices may not include shipping, handling, or taxes, which are calculated at checkout. We reserve the right to change prices and cancel orders placed at incorrect prices.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">7. Shipping and Delivery</h2>
                            <p>
                                Shipping times and costs vary by location. Estimated delivery times are not guaranteed. We are not responsible for delays caused by carriers, weather, or other circumstances beyond our control.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">8. Cancellations and Refunds</h2>
                            <p>
                                Please refer to our{" "}
                                <Link href="/refund" className="text-[var(--color-accent)] hover:underline">
                                    Refund Policy
                                </Link>{" "}
                                for detailed information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">9. Consultations</h2>
                            <p>
                                Consultation bookings are for informational purposes and do not constitute a binding contract. We reserve the right to decline or reschedule consultations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">10. Intellectual Property</h2>
                            <p>
                                All content on this website (text, images, logos, graphics, product descriptions, software) is the property of ONIK&apos;S VINYL and protected by applicable copyright and trademark laws. Reproduction or use without written permission is prohibited.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">11. User-Generated Content</h2>
                            <p>
                                By submitting content (reviews, photos, consultation requests), you grant ONIK&apos;S VINYL a non-exclusive, royalty-free, perpetual license to use, display, and distribute such content in connection with our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">12. Limitation of Liability</h2>
                            <p>
                                To the fullest extent permitted by law, ONIK&apos;S VINYL shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid for the specific order giving rise to the claim.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">13. Disclaimer of Warranties</h2>
                            <p>
                                Our website and services are provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, express or implied.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">14. Indemnification</h2>
                            <p>
                                You agree to indemnify and hold harmless ONIK&apos;S VINYL from any claims, damages, losses, or expenses arising from your violation of these Terms or use of our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">15. Governing Law</h2>
                            <p>
                                These Terms are governed by the laws of the State of [STATE], United States. Disputes shall be resolved in the courts of [STATE/COUNTY], [STATE].
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">16. Changes to Terms</h2>
                            <p>
                                We may modify these Terms at any time. Changes are effective immediately upon posting. Continued use constitutes acceptance of updated Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">17. Contact Us</h2>
                            <p>ONIK&apos;S VINYL</p>
                            <p>[COMPANY LEGAL NAME]</p>
                            <p>[COMPANY ADDRESS]</p>
                            <p>Email: [CONTACT EMAIL]</p>
                            <p>Phone: [PHONE NUMBER]</p>
                        </section>

                    </div>

                    <div className="mt-12 pt-8 border-t border-[var(--color-text)]/10 flex gap-6">
                        <Link href="/privacy" className="text-[var(--color-accent)] hover:underline">
                            View Privacy Policy →
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
