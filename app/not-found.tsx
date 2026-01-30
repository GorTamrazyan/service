// app/not-found.tsx
"use client";

import Link from "next/link";
import { FaHome, FaSearch, FaTools } from "react-icons/fa";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)]/3 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <div className="relative w-full py-6 bg-[var(--color-secondary)] shadow-sm border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center group"
                    >
                        <div className="flex items-center space-x-4 transition-transform duration-300 group-hover:scale-105">
                            {/* Enhanced Fence icon */}
                            <div className="text-[var(--color-accent)] transform transition-all duration-300 group-hover:rotate-6">
                                <svg
                                    width="60"
                                    height="40"
                                    viewBox="0 0 60 40"
                                    className="drop-shadow-lg"
                                    fill="currentColor"
                                >
                                    <rect x="8" y="8" width="6" height="24" />
                                    <rect x="18" y="8" width="6" height="24" />
                                    <rect x="28" y="8" width="6" height="24" />
                                    <rect x="38" y="8" width="6" height="24" />
                                    <rect x="4" y="12" width="44" height="4" />
                                    <rect x="4" y="20" width="44" height="4" />
                                    <polygon points="8,8 11,4 14,8" />
                                    <polygon points="18,8 21,4 24,8" />
                                    <polygon points="28,8 31,4 34,8" />
                                    <polygon points="38,8 41,4 44,8" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-[var(--color-primary)]">
                                ONIK&apos;S VINYL
                            </h1>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative flex-1 flex items-center justify-center px-4 py-12">
                <div className="max-w-2xl w-full text-center">
                    {/* 404 Number with animation */}
                    <div className="mb-8 relative">
                        <div className="text-[200px] md:text-[280px] font-black text-[var(--color-primary)]/10 leading-none select-none">
                            404
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                {/* Animated fence icon */}
                                <div className="animate-bounce">
                                    <svg
                                        width="120"
                                        height="80"
                                        viewBox="0 0 60 40"
                                        className="text-[var(--color-accent)]"
                                        fill="currentColor"
                                    >
                                        <rect
                                            x="8"
                                            y="8"
                                            width="6"
                                            height="24"
                                        />
                                        <rect
                                            x="18"
                                            y="8"
                                            width="6"
                                            height="24"
                                        />
                                        <rect
                                            x="28"
                                            y="8"
                                            width="6"
                                            height="24"
                                        />
                                        <rect
                                            x="38"
                                            y="8"
                                            width="6"
                                            height="24"
                                        />
                                        <rect
                                            x="4"
                                            y="12"
                                            width="44"
                                            height="4"
                                        />
                                        <rect
                                            x="4"
                                            y="20"
                                            width="44"
                                            height="4"
                                        />
                                        <polygon points="8,8 11,4 14,8" />
                                        <polygon points="18,8 21,4 24,8" />
                                        <polygon points="28,8 31,4 34,8" />
                                        <polygon points="38,8 41,4 44,8" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-4">
                            Page Not Found
                        </h2>
                        <p className="text-lg text-[var(--color-text)]/70 max-w-md mx-auto">
                            Oops! Looks like you&apos;ve wandered off the path.
                            The page you&apos;re looking for doesn&apos;t exist
                            or has been moved.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:from-[var(--color-primary)]/90 hover:to-[var(--color-accent)]/90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <FaHome className="w-5 h-5" />
                            <span>Back to Home</span>
                        </Link>

                        <Link
                            href="/client/dashboard/products"
                            className="group inline-flex items-center gap-3 bg-[var(--color-card-bg)] hover:bg-[var(--color-card-bg)]/80 border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text)] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <FaSearch className="w-5 h-5 text-[var(--color-accent)]" />
                            <span>Browse Products</span>
                        </Link>
                    </div>

                    {/* Additional Links */}
                    <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                        <p className="text-[var(--color-text)]/60 mb-4">
                            Need help? Here are some useful links:
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                href="/client/dashboard/service"
                                className="text-[var(--color-primary)] hover:text-[var(--color-accent)] font-medium transition-colors duration-200 flex items-center gap-2"
                            >
                                <FaTools className="w-4 h-4" />
                                Services
                            </Link>
                            <span className="text-[var(--color-text)]/30">
                                |
                            </span>
                            <Link
                                href="/client/dashboard/about"
                                className="text-[var(--color-primary)] hover:text-[var(--color-accent)] font-medium transition-colors duration-200"
                            >
                                About Us
                            </Link>
                            <span className="text-[var(--color-text)]/30">
                                |
                            </span>
                            <Link
                                href="/client/sign-in"
                                className="text-[var(--color-primary)] hover:text-[var(--color-accent)] font-medium transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="relative py-6 text-center">
                <p className="text-[var(--color-text)]/50 text-sm">
                    © 2024 ONIK&apos;S VINYL - Premium Fencing Solutions
                </p>
            </div>

            <style jsx>{`
                @keyframes bounce {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .animate-bounce {
                    animation: bounce 2s infinite;
                }
            `}</style>
        </div>
    );
}
