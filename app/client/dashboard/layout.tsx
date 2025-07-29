// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../../components/Header"; // Предполагаем, что у вас есть компонент Header
import { CartProvider } from "../context/CartContext"; // <--- Импортируем CartProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Fencing Company - Your Trusted Partner",
    description:
        "High-quality fencing solutions for residential and commercial properties.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <CartProvider>
               
                <Header />
                <main className="flex-grow">{children}</main>
            </CartProvider>
        </div>
    );
}
