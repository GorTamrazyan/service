import type { Metadata } from "next";
import { faqs } from "./faqs";

export const metadata: Metadata = {
    title: "FAQ",
    description:
        "Answers to common questions about vinyl fences: colors, care, painting, pricing, installation time, and our 15-year warranty.",
    alternates: { canonical: "https://oniksvinyl.com/client/dashboard/faq" },
    openGraph: {
        title: "ONIK'S VINYL — Frequently Asked Questions",
        description: "Answers to common questions about vinyl fences, pricing, installation, and warranty.",
        url: "https://oniksvinyl.com/client/dashboard/faq",
    },
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            {children}
        </>
    );
}
