// app/layout.tsx
import { Inter } from "next/font/google";
import FirebaseAnalyticsInitializer from "../components/FirebaseAnalyticsInitializer";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GuestBrowsingWrapper from "../components/GuestBrowsingWrapper";
import { ThemeProvider } from "../../contexts/ThemeContext";

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
        <ThemeProvider scope="client">
            <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
                <GuestBrowsingWrapper>
                    <CartProvider>
                        <Header />
                        <main className="flex-1 pt-20 sm:pt-24 px-4 sm:px-10 pb-10">{children}</main>
                        <Footer />
                    </CartProvider>
                </GuestBrowsingWrapper>
                <FirebaseAnalyticsInitializer />
            </div>
        </ThemeProvider>
    );
}
