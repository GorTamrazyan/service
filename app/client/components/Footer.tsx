"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { T } from "./T";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-secondary)] text-[var(--color-text)] mt-auto">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">

                            <div className="text-[var(--color-accent)]">
                                <svg width="40" height="28" viewBox="0 0 60 40" fill="currentColor">
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
                            <h3 className="text-xl font-bold text-[var(--color-primary)]">
                                ONIK'S VINYL
                            </h3>
                        </div>
                        <p className="text-[var(--color-text)]/70">
                            <T>Quality fences and protection for your home and business. Professional installation and reliable service since 2020.</T>
                        </p>
                        <div className="flex space-x-4">
                            <a 
                                href="https://facebook.com" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-text)]/60 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-text)]/60 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <FaInstagram className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-text)]/60 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://youtube.com" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-text)]/60 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <FaYoutube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                            <T>Quick Links</T>
                        </h4>
                        <nav className="space-y-2">
                            <Link 
                                href="/client/dashboard/products" 
                                className="block text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <T>Products</T>
                            </Link>
                            <Link 
                                href="/client/dashboard/cart" 
                                className="block text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <T>Shopping Cart</T>
                            </Link>
                            <Link 
                                href="/client/dashboard/profile" 
                                className="block text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <T>My Profile</T>
                            </Link>
                            <Link 
                                href="/about" 
                                className="block text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <T>About Us</T>
                            </Link>
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-[var(--color-primary)]">
                            <T>Contact Info</T>
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                                <span className="text-[var(--color-text)]/70">
                                    <T>123 Main Street, City, Country 12345</T>
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                                <a 
                                    href="tel:+1234567890" 
                                    className="text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                                >
                                    +1 (234) 567-890
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                                <a 
                                    href="mailto:info@oniksvinyl.com" 
                                    className="text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                                >
                                    info@oniksvinyl.com
                                </a>
                            </div>
                        </div>

                        <div className="pt-2">
                            <h5 className="text-sm font-semibold text-[var(--color-primary)] mb-2">
                                <T>Working Hours</T>
                            </h5>
                            <div className="space-y-1 text-sm text-[var(--color-text)]/70">
                                <div className="flex justify-between">
                                    <span><T>Mon - Fri:</T></span>
                                    <span>9:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span><T>Saturday:</T></span>
                                    <span>9:00 - 16:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span><T>Sunday:</T></span>
                                    <span><T>Closed</T></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-[var(--color-text)]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1 text-sm text-[var(--color-text)]/70 text-center">
                            <span>&copy; {currentYear} ONIK'S VINYL.</span>
                            <T>All rights reserved.</T>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <T>Made with</T>
                                <Heart className="w-4 h-4 text-red-500" />
                                <T>in Armenia</T>
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                            <Link
                                href="/privacy"
                                className="text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <T>Privacy Policy</T>
                            </Link>
                            <Link
                                href="/terms"
                                className="text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <T>Terms of Service</T>
                            </Link>
                            <Link
                                href="/refund"
                                className="text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <T>Refund Policy</T>
                            </Link>
                            <Link
                                href="/support"
                                className="text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors duration-200"
                            >
                                <T>Support</T>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}