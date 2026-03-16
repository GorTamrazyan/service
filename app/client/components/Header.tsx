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
    FaChevronDown,
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
    const [searchType, setSearchType] = useState<"products" | "services">(
        "products"
    );
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const { getTotalItems, isAuthenticated } = useCart();
    const { language, setLanguage } = useLanguage();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };
        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearchOpen]);

    const languages = [
        { code: "en", label: "English", flag: "🇺🇸" },
        { code: "es", label: "Español", flag: "🇪🇸" },
        { code: "ru", label: "Русский", flag: "🇷🇺" },
        { code: "hy", label: "Հայերեն", flag: "🇦🇲" },
    ];

    const languageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                setIsLanguageOpen(false);
            }
        };

        if (isLanguageOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLanguageOpen]);

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
            
            if (searchType === "products") {
                router.push(
                    `/client/dashboard/products?search=${encodeURIComponent(
                        searchQuery.trim()
                    )}`
                );
            } else {
                router.push(
                    `/client/dashboard/service?search=${encodeURIComponent(
                        searchQuery.trim()
                    )}`
                );
            }
            setIsSearchOpen(false);
            setSearchQuery("");
            setIsMobileMenuOpen(false);
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

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">

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

                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = getLinkClassName(
                                item.href,
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

                    <div className="flex items-center gap-3">

                        <button
                            onClick={toggleSearch}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group relative"
                            aria-label="Search"
                        >
                            <FaSearch className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>

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
                            <div className="relative" ref={languageRef}>
                                <button
                                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group flex items-center gap-2"
                                    aria-label="Language"
                                >
                                    <FaGlobe className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-white text-sm font-medium hidden sm:inline">
                                        {languages.find(l => l.code === language)?.flag}
                                    </span>
                                </button>
                                {isLanguageOpen && (
                                    <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 min-w-[160px]">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setIsLanguageOpen(false);
                                                }}
                                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                                                    language === lang.code
                                                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                <span className="text-lg">{lang.flag}</span>
                                                <span>{lang.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {isAuthenticated ? (
                            <Link
                                href="/client/dashboard/profile"
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
                                aria-label="Profile"
                            >
                                <FaUserCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </Link>
                        ) : (
                            <div className="flex gap-1">
                                <Link
                                    href="/client/sign-in"
                                    className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-primary)] font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                                >
                                    <FaUserCircle className="w-4 h-4" />
                                    <T>Sign In</T>
                                </Link>
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto" ref={searchRef}>
                <div
                    className={`
                        transition-all duration-500 ease-in-out overflow-hidden
                        ${
                            isSearchOpen
                                ? "max-h-32 opacity-100 mt-4"
                                : "max-h-0 opacity-0"
                        }
                    `}
                >
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <div className="flex flex-col sm:flex-row gap-3">

                            <div className="flex rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setSearchType("products")}
                                    className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 ${
                                        searchType === "products"
                                            ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-bold"
                                            : "text-white/70 hover:text-white"
                                    }`}
                                >
                                    <FaBox className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        <T>Products</T>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchType("services")}
                                    className={`flex items-center gap-2 px-4 py-3 transition-all duration-300 ${
                                        searchType === "services"
                                            ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-bold"
                                            : "text-white/70 hover:text-white"
                                    }`}
                                >
                                    <FaTools className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        <T>Services</T>
                                    </span>
                                </button>
                            </div>

                            <div className="relative flex-1">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                    <FaSearch className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={
                                        searchType === "products"
                                            ? "Search for products..."
                                            : "Search for services..."
                                    }
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    onKeyDown={handleSearchKeyDown}
                                    className="w-full pl-12 pr-24 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-primary)] font-bold rounded-xl hover:scale-105 transition-all duration-300"
                                >
                                    <T>Search</T>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div
                className={`
                    lg:hidden absolute top-full left-0 w-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary)]/95 backdrop-blur-lg border-t border-white/10 transition-all duration-500 ease-in-out overflow-hidden
                    ${
                        isMobileMenuOpen
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                    }
                `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav className="py-6 space-y-2">
                        {navItems.map((item) => {
                            const isActive = getLinkClassName(
                                item.href,
                            ).includes("font-bold");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                                        isActive
                                            ? "bg-white/10 text-[var(--color-accent)]"
                                            : "hover:bg-white/5"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">
                                        <T>{item.label}</T>
                                    </span>
                                </Link>
                            );
                        })}

                        {!isAuthenticated && (
                            <div className="border-t border-white/10 pt-4 mt-2">
                                <p className="text-white/60 text-sm px-6 mb-2">
                                    <T>Language</T>
                                </p>
                                <div className="grid grid-cols-2 gap-2 px-4">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                            }}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                                                language === lang.code
                                                    ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-bold"
                                                    : "bg-white/10 text-white hover:bg-white/20"
                                            }`}
                                        >
                                            <span className="text-lg">{lang.flag}</span>
                                            <span className="text-sm">{lang.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!isAuthenticated && (
                            <div className="space-y-2 mt-4">
                                <Link
                                    href="/client/sign-in"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-[var(--color-primary)] font-bold transition-all duration-300 hover:scale-105"
                                >
                                    <FaUserCircle className="w-5 h-5" />
                                    <span>
                                        <T>Sign In</T>
                                    </span>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
