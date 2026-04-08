import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description:
        "Explore premium custom vinyl fences and gates by ONIK'S VINYL. Quality installation, 15-year warranty, free quotes.",
    alternates: { canonical: "https://oniksvinyl.com/client/dashboard/home" },
    openGraph: {
        title: "ONIK'S VINYL — Premium Custom Vinyl Fencing",
        description: "Explore premium custom vinyl fences and gates. Quality installation, 15-year warranty, free quotes.",
        url: "https://oniksvinyl.com/client/dashboard/home",
    },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
