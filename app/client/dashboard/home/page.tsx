// app/client/dashboard/home/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    FaShieldAlt,
    FaTools,
    FaStar,
    FaTruck,
    FaUsers,
    FaTag,
    FaSpinner,
    FaChevronRight,
    FaQuoteLeft,
} from "react-icons/fa";

// ПРАВИЛЬНЫЙ импорт ProductCard из компонента ProductList
import { ProductCard } from "../../components/ProductList";
import { T } from "../../components/T";
import type { Material, Color } from "../../../lib/firebase/products/types";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    categorId: string | null;
    inStock: boolean;
    materialId?: string;
    material?: Material;
    colorIds?: string[];
    colors?: Color[];
    tags?: string[];
    images?: string[];
}

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeaturedProducts() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    "/api/products?featured=true&_limit=4"
                );
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
                }
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (e: any) {
                console.error("Ошибка загрузки продуктов:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchFeaturedProducts();
    }, []);

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)]">
            {/* Modern Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)/80] to-transparent z-10" />
                    <Image
                        src="/images/vinyl_fence_classic.jpeg"
                        alt="Premium fencing solutions"
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                    <div className="max-w-2xl">
                        <div className="mb-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-sm font-semibold">
                                <FaStar className="w-4 h-4" />
                                <T>Premium Quality Since 2010</T>
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 text-white">
                            <span className="block">
                                <T>High Quality</T>
                            </span>
                            <span className="block text-[var(--color-accent)] drop-shadow-lg">
                                <T>Fences</T>
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-xl leading-relaxed">
                            <T>
                                Transforming spaces with durable, beautiful
                                fencing solutions for homes and businesses
                                across the country.
                            </T>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/client/dashboard/products"
                                className="group inline-flex items-center justify-center gap-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-primary)] font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                <T>Explore Products</T>
                                <FaChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contact"
                                className="group inline-flex items-center justify-center gap-3 border-2 border-white/30 hover:border-[var(--color-accent)] text-white hover:text-[var(--color-accent)] font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 backdrop-blur-sm hover:backdrop-blur"
                            >
                                <T>Free Quote</T>
                                <FaChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "Projects Completed", value: "500+" },
                                { label: "Happy Clients", value: "98%" },
                                { label: "Warranty Years", value: "15" },
                                { label: "Expert Team", value: "50+" },
                            ].map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-white/70 uppercase tracking-wider">
                                        <T>{stat.label}</T>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products - Modern Grid */}
            <section className="py-24 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card-bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] mb-6">
                            <T>Featured Products</T>
                        </h2>
                        <p className="text-xl text-[var(--color-text)]/80 max-w-2xl mx-auto">
                            <T>
                                Discover our most popular fencing solutions,
                                designed for durability and aesthetic appeal.
                            </T>
                        </p>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative mx-auto w-24 h-24">
                                <div className="w-24 h-24 border-4 border-[var(--color-accent)]/20 rounded-full" />
                                <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-[var(--color-accent)] rounded-full animate-spin" />
                                <FaSpinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-[var(--color-accent)] animate-pulse" />
                            </div>
                            <p className="mt-6 text-xl text-[var(--color-primary)] font-semibold">
                                <T>Loading featured products...</T>
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-error)]/10 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-error)] flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        !
                                    </span>
                                </div>
                            </div>
                            <p className="text-2xl text-[var(--color-error)] font-semibold mb-4">
                                <T>Error loading products</T>
                            </p>
                            <p className="text-[var(--color-gray-500)]">
                                {error}
                            </p>
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="group relative"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent rounded-2xl -z-10 group-hover:scale-105 transition-transform duration-500" />
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && products.length === 0 && !error && (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-gray-200)] flex items-center justify-center">
                                <FaStar className="w-12 h-12 text-[var(--color-gray-400)]" />
                            </div>
                            <p className="text-2xl text-[var(--color-gray-600)] font-semibold">
                                <T>No featured products available</T>
                            </p>
                            <p className="text-[var(--color-gray-500)] mt-2">
                                <T>Check back soon for new arrivals</T>
                            </p>
                        </div>
                    )}

                    <div className="text-center mt-16">
                        <Link
                            href="/client/dashboard/products"
                            className="group inline-flex items-center gap-3 border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105"
                        >
                            <T>View All Products</T>
                            <FaChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Modern Benefits Section */}
            <section className="py-24 bg-[var(--color-card-bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] mb-6">
                            <T>Why Choose Us</T>
                        </h2>
                        <p className="text-xl text-[var(--color-text)]/80 max-w-3xl mx-auto">
                            <T>
                                We combine decades of experience with innovative
                                solutions to deliver exceptional fencing
                                results.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FaStar,
                                title: "Premium Quality",
                                description:
                                    "We use only the best materials, ensuring durability and beauty of every fence.",
                                color: "text-[var(--color-accent)]",
                                bg: "bg-[var(--color-accent)]/10",
                            },
                            {
                                icon: FaTruck,
                                title: "Full Service",
                                description:
                                    "From design and manufacturing to installation and maintenance.",
                                color: "text-[var(--color-primary)]",
                                bg: "bg-[var(--color-primary)]/10",
                            },
                            {
                                icon: FaUsers,
                                title: "Individual Approach",
                                description:
                                    "Each project is unique, and we carefully consider all your requirements.",
                                color: "text-[var(--color-accent)]",
                                bg: "bg-[var(--color-accent)]/10",
                            },
                            {
                                icon: FaShieldAlt,
                                title: "Reliability Guarantee",
                                description:
                                    "We provide warranty on all our products and work.",
                                color: "text-[var(--color-primary)]",
                                bg: "bg-[var(--color-primary)]/10",
                            },
                            {
                                icon: FaTag,
                                title: "Competitive Prices",
                                description:
                                    "Optimal price-quality ratio, making our fences accessible.",
                                color: "text-[var(--color-accent)]",
                                bg: "bg-[var(--color-accent)]/10",
                            },
                            {
                                icon: FaTools,
                                title: "Professional Installation",
                                description:
                                    "Experienced specialists completing installation quickly and efficiently.",
                                color: "text-[var(--color-primary)]",
                                bg: "bg-[var(--color-primary)]/10",
                            },
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[var(--color-accent)]/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                            >
                                <div
                                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${benefit.bg} ${benefit.color} mb-6 group-hover:scale-110 transition-transform duration-500`}
                                >
                                    <benefit.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
                                    <T>{benefit.title}</T>
                                </h3>
                                <p className="text-[var(--color-text)]/80 leading-relaxed">
                                    <T>{benefit.description}</T>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern Testimonials Preview */}
            <section className="py-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            <T>Client Stories</T>
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            <T>
                                See what our satisfied customers have to say
                                about our fencing solutions and service quality.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                quote: "Outstanding quality and professional installation team. Our fence looks amazing!",
                                author: "Sarah Johnson",
                                role: "Homeowner",
                            },
                            {
                                quote: "The perfect balance of durability and design. Exceeded our expectations.",
                                author: "Michael Chen",
                                role: "Business Owner",
                            },
                            {
                                quote: "From consultation to completion - flawless experience. Highly recommended!",
                                author: "Robert Williams",
                                role: "Property Manager",
                            },
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-[var(--color-accent)] transition-all duration-500"
                            >
                                <FaQuoteLeft className="w-10 h-10 text-[var(--color-accent)] mb-6" />
                                <p className="text-white/90 text-lg italic mb-8 leading-relaxed">
                                    "{testimonial.quote}"
                                </p>
                                <div className="border-t border-white/20 pt-6">
                                    <div className="font-bold text-white text-lg">
                                        {testimonial.author}
                                    </div>
                                    <div className="text-white/60">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href="/client/dashboard/testimonials"
                            className="group inline-flex items-center gap-3 bg-white hover:bg-white/90 text-[var(--color-primary)] font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                        >
                            <T>View All Testimonials</T>
                            <FaChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Modern CTA Section */}
            <section className="py-24 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--color-primary)] mb-8">
                            <T>Ready to Transform Your Space?</T>
                        </h2>
                        <p className="text-2xl text-[var(--color-primary)]/90 mb-12 max-w-3xl mx-auto">
                            <T>
                                Let's create the perfect fencing solution for
                                your property. Contact us today for a free
                                consultation.
                            </T>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/contact"
                                className="group inline-flex items-center justify-center gap-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold py-5 px-12 rounded-full text-xl transition-all duration-300 hover:scale-105 shadow-2xl"
                            >
                                <T>Start Your Project</T>
                                <FaChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link
                                href="/client/dashboard/products/catalog"
                                className="group inline-flex items-center justify-center gap-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white font-bold py-5 px-12 rounded-full text-xl transition-all duration-300 hover:scale-105"
                            >
                                <T>Browse Catalog</T>
                                <FaChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
