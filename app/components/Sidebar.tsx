// app/client/components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "../lib/firebase/firebase"; // Путь к firebase.ts
import { useRouter } from "next/navigation";

import {
    FaUserCircle,
    FaShoppingBag,
    FaMapMarkerAlt,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa"; // Иконки

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/client/dashboard/login");
        } catch (err: any) {
            console.error("Ошибка при выходе:", err.message);
            // Можно добавить уведомление пользователю
        }
    };

    const navItems = [
        {
            name: "Orders",
            href: "/client/dashboard/orders",
            icon: FaShoppingBag,
            label: "Заказы",
        },
        {
            name: "Addresses",
            href: "/client/dashboard/addresses",
            icon: FaMapMarkerAlt,
            label: "Адреса",
        },
        {
            name: "Account",
            href: "/client/dashboard/profile",
            icon: FaCog,
            label: "Аккаунт",
        }, // Изменил на profile
    ];

    return (
        <nav className="text-white flex flex-col h-full">
            {/* Аватар и имя пользователя (верхняя часть) */}
            <div className="flex items-center mb-10 pt-4">
                <FaUserCircle className="text-[var(--color-accent)] text-6xl mr-4" />{" "}
                {/* Золотистая иконка пользователя */}
                <div>
                    <h2 className="text-2xl font-semibold">John Doe</h2>{" "}
                    {/* TODO: Заменить на реальное имя пользователя */}
                    <p className="text-sm text-gray-300">
                        johndoe@example.com
                    </p>{" "}
                    {/* TODO: Заменить на реальный email */}
                </div>
            </div>

            {/* Разделитель */}
            <div className="border-b border-gray-700 mb-6"></div>

            {/* Навигационные ссылки */}
            <ul className="flex-grow space-y-2">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <Link href={item.href} legacyBehavior>
                            <a
                                className={`
                                    flex items-center p-3 rounded-lg text-lg
                                    ${
                                        pathname === item.href
                                            ? "bg-white text-[var(--color-primary)] font-bold shadow-md"
                                            : "text-white hover:bg-gray-700 transition-colors duration-200"
                                    }
                                `}
                            >
                                <item.icon className="mr-3 text-2xl" />
                                {item.label}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Кнопка "Выйти" (в конце сайдбара) */}
            <div className="mt-auto pt-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center p-3 rounded-lg text-lg text-white w-full
                               bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                    <FaSignOutAlt className="mr-3 text-2xl" />
                    Выйти
                </button>
            </div>
        </nav>
    );
}
