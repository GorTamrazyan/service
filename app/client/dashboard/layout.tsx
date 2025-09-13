// app/layout.tsx
import { Inter } from "next/font/google"; // Пример импорта шрифта
import FirebaseAnalyticsInitializer from "../../components/FirebaseAnalyticsInitializer"; // <--- Импортируем наш новый компонент
import { CartProvider } from "../context/CartContext";
import Header from "../../components/Header"; // Если у вас есть общий Header
import Footer from "../../components/Footer"; // Импортируем Footer

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
       <div className="min-h-screen flex flex-col">
                <CartProvider>
                    <Header /> {/* Если у вас есть общий Header */}
                    <main className="flex-1 p-10">
                        {children}
                    </main>
                    <Footer />
                </CartProvider>
                {/* <Suspense fallback={null}> */}
                <FirebaseAnalyticsInitializer />{" "}
                {/* <--- ДОБАВЛЕНО: Инициализация Analytics здесь */}
                {/* </Suspense> */}
            </div>
    );
}
