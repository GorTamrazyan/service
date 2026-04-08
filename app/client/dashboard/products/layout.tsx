import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Products",
    description:
        "Browse our full catalog of vinyl fences and gates. Filter by category, material, color, and price. Custom options available.",
    alternates: { canonical: "https://oniksvinyl.com/client/dashboard/products" },
    openGraph: {
        title: "Vinyl Fences & Gates Catalog | ONIK'S VINYL",
        description: "Browse our full catalog of vinyl fences and gates. Custom options available.",
        url: "https://oniksvinyl.com/client/dashboard/products",
    },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
