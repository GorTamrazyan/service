import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about ONIK'S VINYL — family-owned vinyl fence company serving Southern California since 2010. Made in USA materials, 15-year warranty.",
    alternates: { canonical: "https://oniksvinyl.com/client/dashboard/about" },
    openGraph: {
        title: "About ONIK'S VINYL",
        description: "Family-owned vinyl fence company serving Southern California since 2010.",
        url: "https://oniksvinyl.com/client/dashboard/about",
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
