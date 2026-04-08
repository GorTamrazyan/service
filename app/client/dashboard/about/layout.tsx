import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about ONIK'S VINYL — 15+ years of excellence in vinyl fencing, 10,000+ completed projects, 98% customer satisfaction.",
    alternates: { canonical: "https://oniksvinyl.com/client/dashboard/about" },
    openGraph: {
        title: "About ONIK'S VINYL",
        description: "15+ years of excellence in vinyl fencing. 10,000+ completed projects, 98% customer satisfaction.",
        url: "https://oniksvinyl.com/client/dashboard/about",
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
