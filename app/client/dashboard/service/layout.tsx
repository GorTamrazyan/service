import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Services & Consultations",
    description:
        "Professional vinyl fence installation, maintenance, and consultation services by ONIK'S VINYL. Book a consultation today.",
    alternates: { canonical: "https://oniksvinyl.com/client/dashboard/service" },
    openGraph: {
        title: "Services & Consultations | ONIK'S VINYL",
        description: "Professional fence installation, maintenance, and consultation services. Book today.",
        url: "https://oniksvinyl.com/client/dashboard/service",
    },
};

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
