// app/layout.tsx
import { Inter } from "next/font/google"; // Пример импорта шрифта
import FirebaseAnalyticsInitializer from "../../components/FirebaseAnalyticsInitializer"; // <--- Импортируем наш новый компонент
import { CartProvider } from "../context/CartContext";
import Header from "../../components/Header"; // Если у вас есть общий Header

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
       <div>
                <CartProvider>
                    <Header /> {/* Если у вас есть общий Header */}
                    {children}
                </CartProvider>
                {/* <Suspense fallback={null}> */}
                <FirebaseAnalyticsInitializer />{" "}
                {/* <--- ДОБАВЛЕНО: Инициализация Analytics здесь */}
                {/* </Suspense> */}
            </div>
    );
}
