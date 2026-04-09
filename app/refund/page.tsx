import Header from "../client/components/Header";
import Footer from "../client/components/Footer";
import Link from "next/link";

export const metadata = {
    title: "Refund Policy | ONIK'S VINYL",
    description: "Refund Policy for ONIK'S VINYL",
};

export default function RefundPolicyPage() {
    return (
        <>
            <Header />
            <div style={{ marginTop: "80px" }} className="bg-[var(--color-background)] text-[var(--color-text)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl font-black text-[var(--color-primary)] mb-4">
                        Refund Policy
                    </h1>
                    <p className="text-[var(--color-text)]/60 mb-12">
                        Last updated: [DATE]
                    </p>

                    <div className="space-y-10 text-[var(--color-text)]/80 leading-relaxed">

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">1. Overview</h2>
                            <p>
                                At ONIK&apos;S VINYL, we want you to be completely satisfied with your purchase. This policy outlines the conditions for refunds, returns, and exchanges.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">2. Eligibility for Returns</h2>
                            <p className="mb-3">You may request a return within 30 days of receiving your order if:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>The product is unused, uninstalled, and in original condition</li>
                                <li>The product is in its original packaging</li>
                                <li>You have your order confirmation or receipt</li>
                                <li>The product is not custom or made-to-order</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">3. Non-Returnable Items</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Custom or made-to-order products once production has begun</li>
                                <li>Products that have been installed or altered</li>
                                <li>Products damaged by the customer (improper handling, storage, or installation)</li>
                                <li>Products purchased more than 30 days ago</li>
                                <li>Items marked as &quot;Final Sale&quot; at the time of purchase</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">4. How to Request a Return</h2>
                            <p className="mb-3">Contact us at [CONTACT EMAIL] with:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-3">
                                <li>Your order number</li>
                                <li>Product(s) you wish to return</li>
                                <li>Reason for the return</li>
                                <li>Photos of the product (if damaged or defective)</li>
                            </ul>
                            <p>We will respond within 3-5 business days. If approved, we will provide return shipping instructions.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">5. Custom and Made-to-Order Products</h2>
                            <p>
                                Custom products are non-refundable once production has begun. Cancellation before production begins may be eligible for a full refund. Contact us as soon as possible.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">6. Damaged or Defective Products</h2>
                            <p className="mb-3">If you receive a damaged or defective product, contact us within 7 days of delivery at [CONTACT EMAIL] with:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-3">
                                <li>Your order number</li>
                                <li>Photos of the damaged/defective product</li>
                                <li>Description of the issue</li>
                            </ul>
                            <p>We will arrange a replacement or full refund at no additional cost.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">7. Refund Process</h2>
                            <p className="mb-3">Once your return is received and inspected, we will notify you by email.</p>
                            <p className="mb-2 font-semibold">Approved Refunds:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Processed to your original payment method via Stripe</li>
                                <li>Allow 5-10 business days for the refund to appear on your statement</li>
                            </ul>
                            <p className="mb-2 font-semibold">Partial Refunds (at our discretion):</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Products with minor signs of use or missing original packaging</li>
                                <li>Products returned after 30 days but within 45 days</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">8. Return Shipping Costs</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Defective/Damaged products: we cover return shipping</li>
                                <li>Change of mind/other returns: customer pays return shipping</li>
                                <li>Original shipping fees are non-refundable unless the return is due to our error</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">9. Exchanges</h2>
                            <p>
                                To exchange a product, return the original item and place a new order for the desired item.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">10. Cash on Delivery Orders</h2>
                            <p>
                                For COD orders, approved refunds are processed via bank transfer. You will need to provide bank account details.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">11. Order Cancellation</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Orders can be cancelled for a full refund before shipping</li>
                                <li>Once shipped, orders cannot be cancelled — follow the return process</li>
                                <li>Contact us at [CONTACT EMAIL] with your order number to cancel</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">12. Late or Missing Refunds</h2>
                            <p className="mb-3">If you haven&apos;t received your refund:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Check your bank/credit card statement again</li>
                                <li>Contact your bank or card company</li>
                                <li>If still missing, contact us at [CONTACT EMAIL]</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">13. Contact Us</h2>
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
                        <Link href="/terms" className="text-[var(--color-accent)] hover:underline">
                            View Terms of Service →
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
