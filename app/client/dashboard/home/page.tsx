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
    images?: string[]; // Массив URL изображений
}

export default function HomePage() {
    // Language context не используется, так как все переводы через T компонент
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeaturedProducts() {
            setLoading(true);
            setError(null);
            try {
                // Загружаем популярные продукты из базы данных (максимум 4)
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
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="text-center mb-16 md:mb-20 bg-[var(--color-primary)] text-white p-8 md:p-12 rounded-lg shadow-xl relative overflow-hidden">
                    <Image
                        src={"/images/vinyl_fence_classic.jpeg"}
                        alt="background"
                        fill
                        className="object-cover absolute inset-0 z-0"
                    />
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                            <T>High Quality Fences for Your</T>{" "}
                            <span className="text-[var(--color-accent)]">
                                <T>Home and Business</T>
                            </span>
                            !
                        </h1>
                        <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8">
                            <T>
                                We offer a full range of fencing solutions, from
                                design and manufacturing to professional
                                installation. Our products combine reliability,
                                aesthetics and functionality.
                            </T>
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link
                                href="/client/dashboard/products"
                                className="inline-block bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg"
                            >
                                <T>View Products</T>
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-block border-2 border-white hover:border-[var(--color-accent)] text-white hover:text-[var(--color-accent)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg"
                            >
                                <T>Get Free Quote</T>
                            </Link>
                        </div>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-12" />

                {/* Featured Products Section */}
                <section className="mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-10 text-center">
                        <T>Featured Products</T>
                    </h2>

                    {loading && (
                        <div className="flex justify-center items-center py-10">
                            <FaSpinner className="animate-spin text-5xl text-[var(--color-accent)]" />
                            <p className="ml-4 text-2xl text-[var(--color-primary)]">
                                <T>Loading featured products...</T>
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-10">
                            <p className="text-xl text-[var(--color-error)]">
                                <T>Error loading products</T>: {error}
                            </p>
                            <p className="text-sm text-[var(--color-gray-500)] mt-2">
                                Попробуйте обновить страницу или свяжитесь с
                                нами
                            </p>
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-2xl text-[var(--color-gray-600)]">
                                <T>Error loading products</T>
                            </p>
                        </div>
                    )}

                    {products.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.slice(0, 4).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link
                            href="/client/dashboard/products"
                            className="inline-block bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                        >
                            <T>View All Products</T>
                        </Link>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-12" />

                {/* Benefits Section */}
                <section className="mb-16 md:mb-20 bg-[var(--color-card-bg)] shadow-lg rounded-lg p-8 md:p-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                        <T>Why customers choose our company</T>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex items-start space-x-4">
                            <FaStar className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    <T>Premium Quality</T>
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    <T>
                                        We use only the best materials, ensuring
                                        durability and beauty of every fence.
                                    </T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaTruck className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    <T>Full Service</T>
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    <T>
                                        From design and manufacturing to
                                        installation and maintenance - we
                                        provide a comprehensive approach.
                                    </T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaUsers className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    <T>Individual Approach</T>
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    <T>
                                        Each project is unique, and we carefully
                                        consider all your wishes and
                                        requirements.
                                    </T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaShieldAlt className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    <T>Reliability Guarantee</T>
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    <T>
                                        We provide warranty on all our products
                                        and work, confirming our confidence in
                                        quality.
                                    </T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaTag className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    <T>Competitive Prices</T>
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    <T>
                                        We offer optimal price-quality ratio,
                                        making our fences accessible.
                                    </T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaTools className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    <T>Professional Installation</T>
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    <T>
                                        Our teams are experienced specialists
                                        who will complete installation quickly
                                        and efficiently.
                                    </T>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="mb-16 md:mb-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">
                        <T>What Our Customers Say</T>
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto text-[var(--color-text)]">
                        <T>
                            See what our satisfied customers have to say about
                            our fencing solutions and service quality.
                        </T>
                    </p>
                    <Link
                        href="/client/dashboard/testimonials"
                        className="inline-block mt-6 bg-[var(--color-primary)] hover:bg-opacity-90  text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        <T>Read Testimonials</T>
                    </Link>
                </section>

                {/* Final CTA Section */}
                <section className="text-center bg-[var(--color-accent)] text-[var(--color-primary)] p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <T>Start your project today!</T>
                    </h2>
                    <p className="text-xl mb-6">
                        <T>
                            We are ready to bring your ideas about the perfect
                            fence to life. Contact us for a free consultation.
                        </T>
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-[var(--color-primary)] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        <T>Contact Us</T>
                    </Link>
                </section>
            </div>
        </div>
    );
}
