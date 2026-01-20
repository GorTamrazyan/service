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
    FaChevronDown,
    FaHome,
    FaBox,
    FaTools,
    FaInfoCircle,
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
            "text-white hover:text-[var(--color-accent)] transition-all duration-300 font-medium";
        const activeClasses =
            "text-[var(--color-accent)] font-bold relative group";

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

        return isActive ? `${activeClasses}` : baseClasses;
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            setSearchQuery("");
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
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

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchSubmit(e);
        }
    };

    const navItems = [
        {
            href: "/client/dashboard/home",
            label: "Home",
            icon: FaHome,
        },
        {
            href: "/client/dashboard/products",
            label: "Products",
            icon: FaBox,
        },
        {
            href: "/client/dashboard/service",
            label: "Service",
            icon: FaTools,
        },
        {
            href: "/client/dashboard/about",
            label: "About us",
            icon: FaInfoCircle,
        },
    ];

    return (
        <header className="fixed top-0 left-0 w-full py-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/95 to-[var(--color-primary)]/90 backdrop-blur-lg border-b border-white/10 z-50 shadow-2xl">
            {/* Main Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        aria-label="Menu"
                        className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                    >
                        {isMobileMenuOpen ? (
                            <FaTimes className="w-6 h-6 text-white" />
                        ) : (
                            <FaBars className="w-6 h-6 text-white" />
                        )}
                    </button>

                    {/* Logo */}
                    <Link
                        href="/client/dashboard/home"
                        className="flex items-center gap-3 group"
                    >
                        <div className="relative w-12 h-12 bg-white rounded-xl p-2 shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <Image
                                src="/images/oniks_vinyl_text.png"
                                alt="Company Logo"
                                width={40}
                                height={40}
                                priority={true}
                                className="object-contain"
                            />
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-black text-white tracking-tight">
                                VINYL FENCE
                            </h1>
                            <p className="text-xs text-white/70">
                                Premium Solutions
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = getLinkClassName(
                                item.href
                            ).includes("font-bold");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                                        isActive
                                            ? "bg-white/10 text-[var(--color-accent)]"
                                            : "hover:bg-white/5"
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="font-medium">
                                        <T>{item.label}</T>
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <button
                            onClick={toggleSearch}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group relative"
                            aria-label="Search"
                        >
                            <FaSearch className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Cart */}
                        {isAuthenticated ? (
                            <Link
                                href="/client/dashboard/cart"
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group relative"
                                aria-label="Cart"
                            >
                                <FaShoppingCart className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
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
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 relative group"
                                aria-label="Cart"
                            >
                                <FaShoppingCart className="w-5 h-5 text-white/60 group-hover:text-white" />
                            </button>
                        )}

                        {/* User/Auth */}
                        {isAuthenticated ? (
                            <Link
                                href="/client/dashboard/profile"
                                className="p-3 rounded-full bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 hover:from-[var(--color-accent)]/30 hover:to-[var(--color-accent)]/20 transition-all duration-300 group"
                                aria-label="Profile"
                            >
                                <FaUserCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </Link>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link
                                    href="/client/sign-in"
                                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 hover:scale-105"
                                >
                                    <T>Sign In</T>
                                </Link>
                                <Link
                                    href="/client/register"
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-primary)] font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                                >
                                    <T>Register</T>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div
                    className={`
                        mt-4 overflow-hidden transition-all duration-500 ease-in-out
                        ${
                            isSearchOpen
                                ? "max-h-20 opacity-100"
                                : "max-h-0 opacity-0"
                        }
                    `}
                >
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <FaSearch className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for products, services..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full pl-12 pr-24 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-primary)] font-bold rounded-xl hover:scale-105 transition-all duration-300"
                        >
                            <T>Search</T>
                        </button>
                    </form>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={`
                    lg:hidden absolute top-full left-0 w-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary)]/95 backdrop-blur-lg border-t border-white/10 transition-all duration-500 ease-in-out overflow-hidden
                    ${
                        isMobileMenuOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                    }
                `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav className="py-6 space-y-2">
                        {navItems.map((item) => {
                            const isActive = getLinkClassName(
                                item.href
                            ).includes("font-bold");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                                        isActive
                                            ? "bg-white/10 text-[var(--color-accent)]"
                                            : "hover:bg-white/5"
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            isActive
                                                ? "bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-accent)]/10"
                                                : "bg-white/5"
                                        }`}
                                    >
                                        <item.icon
                                            className={`w-5 h-5 ${
                                                isActive
                                                    ? "text-[var(--color-accent)]"
                                                    : "text-white"
                                            }`}
                                        />
                                    </div>
                                    <span className="font-medium text-lg">
                                        <T>{item.label}</T>
                                    </span>
                                </Link>
                            );
                        })}

                        {/* Mobile Auth Buttons */}
                        {!isAuthenticated && (
                            <div className="pt-6 px-6 space-y-3">
                                <Link
                                    href="/client/sign-in"
                                    className="block w-full text-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <T>Sign In</T>
                                </Link>
                                <Link
                                    href="/client/register"
                                    className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-primary)] font-bold hover:scale-105 transition-all duration-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <T>Register</T>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>

            {/* Active Indicator Animation */}
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        transform: translateY(-10px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </header>
    );
}
