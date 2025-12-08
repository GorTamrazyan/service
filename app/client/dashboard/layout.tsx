// app/layout.tsx
import { Inter } from "next/font/google";
import FirebaseAnalyticsInitializer from "../components/FirebaseAnalyticsInitializer";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GuestBrowsingWrapper from "../components/GuestBrowsingWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "My Website",
    description: "A Next.js application with Firebase integration.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
            <GuestBrowsingWrapper>
                <CartProvider>
                    <Header />
                    <main className="flex-1 pt-10 sm:p-10">{children}</main>
                    <Footer />
                </CartProvider>
            </GuestBrowsingWrapper>
            <FirebaseAnalyticsInitializer />
        </div>
    );
}
