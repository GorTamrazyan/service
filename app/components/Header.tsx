// components/Header.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCart } from "../client/context/CartContext"; // <--- Import useCart hook

export default function Header() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { getTotalItems } = useCart(); // <--- Get the total number of items in the cart

    const getLinkClassName = (expectedPaths: string | string[]) => {
        const baseClasses =
            "text-[var(--color-background)] hover:text-[var(--color-accent)] transition-colors duration-200";
        const activeClasses =
            "text-[var(--color-accent)] font-semibold underline underline-offset-4";

        const paths = Array.isArray(expectedPaths)
            ? expectedPaths
            : [expectedPaths];

        const normalizedPaths = paths.map((path) =>
            path.endsWith("/") ? path.slice(0, -1) : path
        );

        const isActive = normalizedPaths.some((path) => {
            const normalizedCurrent = pathname.endsWith("/")
                ? pathname.slice(0, -1)
                : pathname;

            return (
                normalizedCurrent === path ||
                (path !== "/" && normalizedCurrent.startsWith(`${path}/`))
            );
        });

        return isActive ? ` ${activeClasses}` : baseClasses;
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full shadow-md py-4 px-8 flex flex-col bg-[var(--color-primary)] z-50">
            <div className="flex justify-between items-center w-full">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link
                        href="/client/dashboard/home"
                        className="text-2xl font-bold text-white hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                        Ваш Лого
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow justify-center items-center hidden md:flex space-x-6">
                    <Link
                        href="/client/dashboard/home"
                        className={getLinkClassName("/client/dashboard/home")}
                    >
                        Home
                    </Link>
                    <Link
                        href="/client/dashboard/products"
                        className={getLinkClassName(
                            "/client/dashboard/products"
                        )}
                    >
                        Product
                    </Link>
                    <Link
                        href="/client/dashboard/service"
                        className={getLinkClassName(
                            "/client/dashboard/service"
                        )}
                    >
                        Service
                    </Link>
                    <Link
                        href="/client/dashboard/about"
                        className={getLinkClassName("/client/dashboard/about")}
                    >
                        About us
                    </Link>
                    {/* Cart icon in desktop navigation */}
                </nav>

                {/* Icons (for mobile/tablet and other actions) */}
                <div className="flex-shrink-0 flex items-center space-x-6">
                    <Link
                        href="/client/dashboard/cart"
                        aria-label="Корзина"
                        className="relative text-white hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                        <FaShoppingCart className="w-5 h-5" />
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {getTotalItems()}
                            </span>
                        )}
                    </Link>
                    <button
                        aria-label="Поиск"
                        onClick={toggleSearch}
                        className="text-white hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                        <FaSearch className="w-5 h-5" />
                    </button>
                    {/* Cart icon for mobile/tablet (if not already in main nav for larger screens) */}
                    <Link
                        href="/client/dashboard/cart"
                        aria-label="Корзина"
                        className="relative text-white hover:text-[var(--color-accent)] transition-colors duration-200 md:hidden" // Only show for mobile/tablet
                    >
                        <FaShoppingCart className="w-5 h-5" />
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {getTotalItems()}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/profile"
                        aria-label="Профиль"
                        className="text-white hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                        <FaUserCircle className="w-6 h-6" />
                    </Link>
                </div>
            </div>
            {/* Search input field */}
            <div
                className={`
                    absolute top-full left-0 w-full bg-[var(--color-primary)] px-8 py-3 overflow-hidden transition-all duration-300 ease-in-out
                    ${
                        isSearchOpen
                            ? "max-h-20 opacity-100"
                            : "max-h-0 opacity-0"
                    }
                    flex justify-center items-center
                `}
            >
                <input
                    type="text"
                    placeholder="Что ищем?"
                    className="p-2 rounded-md border border-gray-300 w-full max-w-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
            </div>
        </header>
    );
}
