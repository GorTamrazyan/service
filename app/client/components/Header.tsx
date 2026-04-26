"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    FaSearch,
    FaShoppingCart,
    FaUserCircle,
    FaBars,
    FaTimes,
    FaHome,
    FaBox,
    FaTools,
    FaInfoCircle,
    FaGlobe,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { T } from "./T";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState<"products" | "services">("products");
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const { getTotalItems, isAuthenticated } = useCart();
    const { language, setLanguage } = useLanguage();
    const searchRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };
        if (isSearchOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isSearchOpen]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
                setIsLanguageOpen(false);
            }
        };
        if (isLanguageOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isLanguageOpen]);

    const languages = [
        { code: "en", label: "English", flag: "🇺🇸" },
        { code: "es", label: "Español", flag: "🇪🇸" },
        { code: "ru", label: "Русский", flag: "🇷🇺" },
        { code: "hy", label: "Հայերեն", flag: "🇦🇲" },
    ];

    const navItems = [
        { href: "/client/dashboard/home", label: "Home", icon: FaHome },
        { href: "/client/dashboard/products", label: "Products", icon: FaBox },
        { href: "/client/dashboard/service", label: "Service", icon: FaTools },
        { href: "/client/dashboard/about", label: "About us", icon: FaInfoCircle },
    ];

    const isActive = (href: string) => {
        const normalized = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
        const normalizedHref = href.endsWith("/") ? href.slice(0, -1) : href;
        return normalized === normalizedHref || (normalizedHref !== "/" && normalized.startsWith(`${normalizedHref}/`));
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(
                searchType === "products"
                    ? `/client/dashboard/products?search=${encodeURIComponent(searchQuery.trim())}`
                    : `/client/dashboard/service?search=${encodeURIComponent(searchQuery.trim())}`
            );
            setIsSearchOpen(false);
            setSearchQuery("");
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-[var(--color-secondary)] border-b border-[var(--color-border)] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menu"
                        className="lg:hidden p-2 rounded-lg text-[var(--color-gray-500)] hover:bg-[var(--color-gray-100)] transition-colors"
                    >
                        {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                    </button>

                    {/* Logo */}
                    <Link href="/client/dashboard/home" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 bg-[var(--color-gray-100)] rounded-xl p-1.5 group-hover:scale-105 transition-transform duration-200">
                            <Image
                                src="/images/oniks_vinyl_text.png"
                                alt="Company Logo"
                                width={36}
                                height={36}
                                priority
                                className="object-contain"
                            />
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-serif text-lg font-semibold text-[var(--color-primary)] leading-tight tracking-tight">
                                ONIK'S VINYL
                            </p>
                            <p className="text-[10px] text-[var(--color-gray-500)] tracking-widest uppercase">
                                Premium Solutions
                            </p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                    isActive(item.href)
                                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                        : "text-[var(--color-gray-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-gray-100)]"
                                }`}
                            >
                                <item.icon className="w-3.5 h-3.5" />
                                <T>{item.label}</T>
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 rounded-full text-[var(--color-gray-500)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-primary)] transition-colors"
                            aria-label="Search"
                        >
                            <FaSearch className="w-4 h-4" />
                        </button>

                        {/* Language (unauthenticated) */}
                        {!isAuthenticated && (
                            <div className="relative" ref={languageRef}>
                                <button
                                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                    className="p-2 rounded-full text-[var(--color-gray-500)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                                    aria-label="Language"
                                >
                                    <FaGlobe className="w-4 h-4" />
                                    <span className="text-sm hidden sm:inline">
                                        {languages.find((l) => l.code === language)?.flag}
                                    </span>
                                </button>
                                {isLanguageOpen && (
                                    <div className="absolute top-full right-0 mt-2 bg-[var(--color-secondary)] rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden z-50 min-w-[160px]">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => { setLanguage(lang.code); setIsLanguageOpen(false); }}
                                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--color-gray-100)] transition-colors text-sm ${
                                                    language === lang.code
                                                        ? "text-[var(--color-primary)] font-semibold"
                                                        : "text-[var(--color-text)]"
                                                }`}
                                            >
                                                <span>{lang.flag}</span>
                                                <span>{lang.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cart (authenticated) */}
                        {isAuthenticated && (
                            <Link
                                href="/client/dashboard/cart"
                                className="p-2 rounded-full text-[var(--color-gray-500)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-primary)] transition-colors relative"
                                aria-label="Cart"
                            >
                                <FaShoppingCart className="w-4 h-4" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Profile / Sign In */}
                        {isAuthenticated ? (
                            <Link
                                href="/client/dashboard/profile"
                                className="p-2 rounded-full text-[var(--color-gray-500)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-primary)] transition-colors"
                                aria-label="Profile"
                            >
                                <FaUserCircle className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href="/client/sign-in"
                                className="hidden sm:flex items-center gap-2 px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                            >
                                <FaUserCircle className="w-3.5 h-3.5" />
                                <T>Sign In</T>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Search bar */}
            <div
                className={`border-t border-[var(--color-border)] overflow-hidden transition-all duration-300 ${
                    isSearchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                }`}
                ref={searchRef}
            >
                <form onSubmit={handleSearchSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2">
                    <div className="flex rounded-full border border-[var(--color-border)] overflow-hidden bg-[var(--color-gray-100)] text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => setSearchType("products")}
                            className={`px-4 py-2 transition-colors ${
                                searchType === "products"
                                    ? "bg-[var(--color-primary)] text-white"
                                    : "text-[var(--color-gray-600)] hover:text-[var(--color-primary)]"
                            }`}
                        >
                            <T>Products</T>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSearchType("services")}
                            className={`px-4 py-2 transition-colors ${
                                searchType === "services"
                                    ? "bg-[var(--color-primary)] text-white"
                                    : "text-[var(--color-gray-600)] hover:text-[var(--color-primary)]"
                            }`}
                        >
                            <T>Services</T>
                        </button>
                    </div>
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-gray-500)]" />
                        <input
                            autoFocus
                            type="text"
                            placeholder={searchType === "products" ? "Search products..." : "Search services..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-20 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] placeholder-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                        >
                            <T>Search</T>
                        </button>
                    </div>
                </form>
            </div>

            {/* Mobile menu */}
            <div
                className={`lg:hidden border-t border-[var(--color-border)] bg-[var(--color-secondary)] overflow-hidden transition-all duration-300 ${
                    isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                isActive(item.href)
                                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                    : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]"
                            }`}
                        >
                            <item.icon className="w-4 h-4" />
                            <T>{item.label}</T>
                        </Link>
                    ))}

                    {!isAuthenticated && (
                        <>
                            <div className="pt-3 border-t border-[var(--color-border)]">
                                <p className="text-xs text-[var(--color-gray-500)] px-4 mb-2 uppercase tracking-widest">
                                    <T>Language</T>
                                </p>
                                <div className="grid grid-cols-2 gap-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => setLanguage(lang.code)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                                                language === lang.code
                                                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                                                    : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]"
                                            }`}
                                        >
                                            <span>{lang.flag}</span>
                                            <span>{lang.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Link
                                href="/client/sign-in"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-primary)]/90 transition-colors mt-3"
                            >
                                <FaUserCircle className="w-4 h-4" />
                                <T>Sign In</T>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
