// components/Header.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    FaSearch,
    FaShoppingCart,
    FaUserCircle,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { T } from "./T";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { getTotalItems, isAuthenticated } = useCart();

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
        if (isSearchOpen) {
            setSearchQuery(""); // Очищаем поиск при закрытии
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Перенаправляем на страницу продуктов с поисковым запросом
            router.push(
                `/client/dashboard/products?search=${encodeURIComponent(
                    searchQuery.trim()
                )}`
            );
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleSearchInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchSubmit(e);
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full shadow-md py-4 px-8 flex flex-col bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] z-50">
            <div className="flex justify-between items-center w-full">
                {/* Mobile menu button - only visible on small screens */}
                <div className="flex items-center md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        aria-label="Меню"
                        className="text-[var(--color-background)] hover:text-[var(--color-accent)] transition-colors duration-200 mr-4"
                    >
                        {isMobileMenuOpen ? (
                            <FaTimes className="w-5 h-5" />
                        ) : (
                            <FaBars className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link
                        href="/client/dashboard/home"
                        className="text-2xl font-bold text-[var(--color-background)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                        <Image
                            src="/images/oniks_vinyl_text.png"
                            alt="Логотип компании"
                            width={30}
                            height={40}
                            priority={true}
                        />
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow justify-center items-center hidden md:flex space-x-6">
                    <Link
                        href="/client/dashboard/home"
                        className={getLinkClassName("/client/dashboard/home")}
                    >
                        <T>Home</T>
                    </Link>
                    <Link
                        href="/client/dashboard/products"
                        className={getLinkClassName(
                            "/client/dashboard/products"
                        )}
                    >
                        <T>Products</T>
                    </Link>
                    <Link
                        href="/client/dashboard/service"
                        className={getLinkClassName(
                            "/client/dashboard/service"
                        )}
                    >
                        <T>Service</T>
                    </Link>
                    <Link
                        href="/client/dashboard/about"
                        className={getLinkClassName("/client/dashboard/about")}
                    >
                        <T>About us</T>
                    </Link>
                </nav>

                {/* Icons (for mobile/tablet and other actions) */}
                <div className="flex-shrink-0 flex items-center space-x-6">
                    {isAuthenticated ? (
                        <Link
                            href="/client/dashboard/cart"
                            aria-label="Cart"
                            className="relative text-white hover:text-[var(--color-accent)] transition-colors duration-200 hidden md:inline-flex"
                        >
                            <FaShoppingCart className="w-5 h-5" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                    ) : (
                        <button
                            onClick={() =>
                                alert(
                                    "Log in to your account to access your shopping cart."
                                )
                            }
                            aria-label="Cart"
                            className="relative text-white/60 hover:text-[var(--color-accent)] transition-colors duration-200 hidden md:inline-flex cursor-pointer"
                        >
                            <FaShoppingCart className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        aria-label="Search"
                        onClick={toggleSearch}
                        className="text-[var(--color-background)] hover:text-[var(--color-accent)] transition-colors duration-200"
                    >
                        <FaSearch className="w-5 h-5" />
                    </button>
                    {/* Cart icon for mobile - only show on mobile */}
                    {isAuthenticated ? (
                        <Link
                            href="/client/dashboard/cart"
                            aria-label="Корзина"
                            className="relative text-white hover:text-[var(--color-accent)] transition-colors duration-200 md:hidden"
                        >
                            <FaShoppingCart className="w-5 h-5" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                    ) : (
                        <button
                            onClick={() =>
                                alert("Войдите в аккаунт для доступа к корзине")
                            }
                            aria-label="Корзина"
                            className="relative text-white/60 hover:text-[var(--color-accent)] transition-colors duration-200 md:hidden cursor-pointer"
                        >
                            <FaShoppingCart className="w-5 h-5" />
                        </button>
                    )}
                    {isAuthenticated ? (
                        <Link
                            href="/client/dashboard/profile"
                            aria-label="Профиль"
                            className="text-[var(--color-background)] hover:text-[var(--color-accent)] transition-colors duration-200"
                        >
                            <FaUserCircle className="w-6 h-6" />
                        </Link>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/client/sign-in"
                                className="text-[var(--color-background)] hover:text-[var(--color-accent)] transition-colors duration-200 text-sm font-medium"
                            >
                                <T>Sign In</T>
                            </Link>
                            <span className="text-[var(--color-background)]">
                                |
                            </span>
                            <Link
                                href="/client/register"
                                className="text-[var(--color-background)] hover:text-[var(--color-accent)] transition-colors duration-200 text-sm font-medium"
                            >
                                <T>Register</T>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {/* Search input field */}
            <div
                className={`
                    absolute top-full left-0 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-8 py-3 overflow-hidden transition-all duration-300 ease-in-out
                    ${
                        isSearchOpen
                            ? "max-h-20 opacity-100"
                            : "max-h-0 opacity-0"
                    }
                    flex justify-center items-center
                `}
            >
                <form
                    onSubmit={handleSearchSubmit}
                    className="w-full max-w-lg flex gap-2"
                >
                    <input
                        type="text"
                        placeholder="What are you looking for?"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyPress={handleSearchKeyPress}
                        className="flex-1 p-2 rounded-md border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-md hover:bg-[var(--color-accent)]/80 transition-colors duration-200"
                    >
                        <FaSearch className="w-4 h-4" />
                    </button>
                </form>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={`
                    absolute top-full left-0 w-full bg-[var(--color-primary)] shadow-lg transition-all duration-300 ease-in-out md:hidden
                    ${
                        isMobileMenuOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0 overflow-hidden"
                    }
                `}
            >
                <nav className="flex flex-col py-4 px-8 space-y-4">
                    <Link
                        href="/client/dashboard/home"
                        className={`${getLinkClassName(
                            "/client/dashboard/home"
                        )} py-2 border-b border-[var(--color-background)]/20`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <T>Home</T>
                    </Link>
                    <Link
                        href="/client/dashboard/products"
                        className={`${getLinkClassName(
                            "/client/dashboard/products"
                        )} py-2 border-b border-[var(--color-background)]/20`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <T>Products</T>
                    </Link>
                    <Link
                        href="/client/dashboard/service"
                        className={`${getLinkClassName(
                            "/client/dashboard/service"
                        )} py-2 border-b border-[var(--color-background)]/20`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <T>Service</T>
                    </Link>
                    <Link
                        href="/client/dashboard/about"
                        className={`${getLinkClassName(
                            "/client/dashboard/about"
                        )} py-2`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <T>About us</T>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
