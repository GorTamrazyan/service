// app/client/dashboard/products/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Filter, Zap, Shield, Palette, Ruler, Truck } from "lucide-react";
import ProductList from "../../components/ProductList";
import ProductFilters, { FilterState } from "../../components/ProductFilters";
import { T } from "../../components/T";
import type {
    Material,
    Color,
    TypeOfProduct,
} from "../../../lib/firebase/products/types";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    categorId: string | null;
    typeOfProductId?: string;
    inStock: boolean;
    materialId?: string;
    material?: Material;
    colorIds?: string[];
    colors?: Color[];
    tags?: string[];
    images?: string[];
}

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [typeOfProducts, setTypeOfProducts] = useState<TypeOfProduct[]>([]);

    const [filters, setFilters] = useState<FilterState>({
        categoryId: undefined,
        typeOfProductId: undefined,
        materialId: undefined,
        colorIds: [],
        minPrice: "",
        maxPrice: "",
    });

    useEffect(() => {
        async function loadTypeOfProducts() {
            try {
                const response = await fetch("/api/type-of-products");
                if (response.ok) {
                    const data = await response.json();
                    setTypeOfProducts(data);
                }
            } catch (error) {
                console.error("Error loading type of products:", error);
            }
        }
        loadTypeOfProducts();
    }, []);

    const fetchProducts = useCallback(async (currentFilters: FilterState) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();

            if (currentFilters.categoryId) {
                params.append("categoryId", currentFilters.categoryId);
            }
            if (currentFilters.typeOfProductId) {
                params.append(
                    "typeOfProductId",
                    currentFilters.typeOfProductId
                );
            }
            if (currentFilters.materialId) {
                params.append("materialId", currentFilters.materialId);
            }
            if (currentFilters.colorIds.length > 0) {
                params.append("colorIds", currentFilters.colorIds.join(","));
            }
            if (currentFilters.minPrice) {
                params.append("minPrice", currentFilters.minPrice);
            }
            if (currentFilters.maxPrice) {
                params.append("maxPrice", currentFilters.maxPrice);
            }

            const queryString = params.toString();
            const url = `/api/products${queryString ? `?${queryString}` : ""}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(filters);
    }, []);

    const handleApplyFilters = (newFilters: FilterState) => {
        setFilters(newFilters);
        fetchProducts(newFilters);
    };

    const hasActiveFilters =
        filters.categoryId ||
        filters.typeOfProductId ||
        filters.materialId ||
        filters.colorIds.length > 0 ||
        filters.minPrice ||
        filters.maxPrice;

    const [shouldGroup, setShouldGroup] = useState(!hasActiveFilters);

    const fenceTypeId = typeOfProducts.find(
        (t) =>
            t.name.toLowerCase().includes("fence") ||
            t.name.toLowerCase().includes("забор")
    )?.id;
    const gateTypeId = typeOfProducts.find(
        (t) =>
            t.name.toLowerCase().includes("gate") ||
            t.name.toLowerCase().includes("ворота")
    )?.id;

    let fenceProducts: Product[] = [];
    let gateProducts: Product[] = [];

    if (shouldGroup) {
        products.forEach((p) => {
            if (gateTypeId && p.typeOfProductId === gateTypeId) {
                gateProducts.push(p);
            } else {
                fenceProducts.push(p);
            }
        });
    } else {
        fenceProducts = products;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative mb-8 mx-auto w-24 h-24">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center">
                            <div className="w-12 h-12 text-[var(--color-primary)] animate-spin">
                                <svg fill="none" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                        <T>Loading Products</T>
                    </h2>
                    <p className="text-[var(--color-text)]/60">
                        <T>Discovering premium fencing solutions</T>
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[var(--color-background)] to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-error)] flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                                !
                            </span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-error)] mb-4">
                        <T>Oops! Something went wrong</T>
                    </h2>
                    <p className="text-[var(--color-text)]/80 mb-8">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white font-bold py-3 px-6 rounded-full hover:scale-105 transition-all duration-200"
                    >
                        <T>Try Again</T>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 py-16 md:py-24">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30">
                            <Zap className="w-5 h-5 text-white" />
                            <span className="text-white font-bold text-sm">
                                <T>Premium Collection</T>
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                            <span className="block">
                                <T>Premium Quality</T>
                            </span>
                            <span className="block text-[var(--color-accent)]">
                                <T>Fencing Solutions</T>
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            <T>
                                Discover our collection of durable, secure, and
                                beautifully designed fences and gates for your
                                property.
                            </T>
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                                <Shield className="w-4 h-4 text-white" />
                                <span className="text-white text-sm">
                                    <T>15-Year Warranty</T>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                                <Palette className="w-4 h-4 text-white" />
                                <span className="text-white text-sm">
                                    <T>Multiple Colors</T>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                                <Ruler className="w-4 h-4 text-white" />
                                <span className="text-white text-sm">
                                    <T>Custom Sizes</T>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                                <Truck className="w-4 h-4 text-white" />
                                <span className="text-white text-sm">
                                    <T>Fast Delivery</T>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {/* Control Bar */}
                <div className="bg-[var(--color-card-bg)] rounded-xl shadow-lg p-6 mb-10 border border-[var(--color-border)]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="group relative flex items-center gap-3 bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-lg hover:bg-[var(--color-primary)]/90 transition-all duration-200 shadow-md"
                            >
                                <Filter className="w-5 h-5" />
                                <span>
                                    <T>Filters</T>
                                </span>
                                {hasActiveFilters && (
                                    <span className="ml-2 bg-white text-[var(--color-primary)] text-xs px-2 py-1 rounded-full font-bold">
                                        {
                                            Object.values(filters).filter((v) =>
                                                Array.isArray(v)
                                                    ? v.length > 0
                                                    : Boolean(v)
                                            ).length
                                        }
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                                    <div className="text-2xl font-bold text-[var(--color-primary)]">
                                        {products.length}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-[var(--color-text)]/70">
                                        <T>Products Available</T>
                                    </div>
                                    <div className="text-sm text-[var(--color-text)] font-medium">
                                        <T>Premium Selection</T>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--color-gray-100)] rounded-lg border border-[var(--color-border)]">
                                <span className="text-sm text-[var(--color-text)] font-medium">
                                    <T>Group by Type</T>
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={shouldGroup}
                                        onChange={() =>
                                            setShouldGroup(!shouldGroup)
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-[var(--color-gray-300)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="space-y-16">
                    {shouldGroup ? (
                        <>
                            {/* Fences Section */}
                            {fenceProducts.length > 0 && (
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">
                                                    <T>
                                                        {typeOfProducts.find(
                                                            (t) =>
                                                                t.id ===
                                                                fenceTypeId
                                                        )?.name ||
                                                            "Premium Fences"}
                                                    </T>
                                                </h2>
                                                <p className="text-[var(--color-text)]/70 mt-1 text-sm">
                                                    <T>
                                                        Durable and secure
                                                        fencing solutions
                                                    </T>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-[var(--color-primary)]/10 rounded-lg">
                                            <span className="text-lg font-bold text-[var(--color-primary)]">
                                                {fenceProducts.length}
                                            </span>
                                            <span className="text-[var(--color-text)]/70 ml-2 text-sm">
                                                <T>items</T>
                                            </span>
                                        </div>
                                    </div>
                                    <ProductList
                                        products={fenceProducts}
                                        showGroupedView={false}
                                    />
                                </div>
                            )}

                            {/* Gates Section */}
                            {gateProducts.length > 0 && (
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-primary)] rounded-full"></div>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">
                                                    <T>
                                                        {typeOfProducts.find(
                                                            (t) =>
                                                                t.id ===
                                                                gateTypeId
                                                        )?.name ||
                                                            "Security Gates"}
                                                    </T>
                                                </h2>
                                                <p className="text-[var(--color-text)]/70 mt-1 text-sm">
                                                    <T>
                                                        Secure and elegant gate
                                                        solutions
                                                    </T>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-[var(--color-primary)]/10 rounded-lg">
                                            <span className="text-lg font-bold text-[var(--color-primary)]">
                                                {gateProducts.length}
                                            </span>
                                            <span className="text-[var(--color-text)]/70 ml-2 text-sm">
                                                <T>items</T>
                                            </span>
                                        </div>
                                    </div>
                                    <ProductList
                                        products={gateProducts}
                                        showGroupedView={false}
                                    />
                                </div>
                            )}

                            {/* No products found */}
                            {fenceProducts.length === 0 &&
                                gateProducts.length === 0 && (
                                    <div className="text-center py-20">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-10 h-10 text-[var(--color-primary)]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                            <T>No products found</T>
                                        </h3>
                                        <p className="text-[var(--color-text)]/70 max-w-md mx-auto">
                                            <T>
                                                Try adjusting your filters or
                                                browse our entire collection.
                                            </T>
                                        </p>
                                        <button
                                            onClick={() =>
                                                setIsFilterOpen(true)
                                            }
                                            className="mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
                                        >
                                            <T>Adjust Filters</T>
                                        </button>
                                    </div>
                                )}
                        </>
                    ) : (
                        <>
                            {/* Filtered products - no grouping */}
                            {fenceProducts.length > 0 ? (
                                <ProductList
                                    products={fenceProducts}
                                    showGroupedView={false}
                                />
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-10 h-10 text-[var(--color-primary)]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                        <T>No matching products</T>
                                    </h3>
                                    <p className="text-[var(--color-text)]/70 max-w-md mx-auto">
                                        <T>
                                            Your filters didn't match any
                                            products. Try different criteria.
                                        </T>
                                    </p>
                                    <button
                                        onClick={() => setIsFilterOpen(true)}
                                        className="mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
                                    >
                                        <T>Adjust Filters</T>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Contact Section */}
                <section className="mt-20">
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 rounded-2xl overflow-hidden">
                        <div className="p-10 md:p-14 text-center">
                            <div className="max-w-3xl mx-auto">
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 rounded-full mb-8 border border-white/30">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="text-white font-bold">
                                        <T>Custom Solutions</T>
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    <T>Need a Custom Solution?</T>
                                </h2>

                                <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                                    <T>
                                        Contact our experts for personalized
                                        fence designs tailored to your specific
                                        requirements.
                                    </T>
                                </p>

                                <Link
                                    href="/contact"
                                    className="group inline-flex items-center gap-3 bg-white text-[var(--color-primary)] font-bold py-4 px-10 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg"
                                >
                                    <span>
                                        <T>Get Free Consultation</T>
                                    </span>
                                    <svg
                                        className="w-5 h-5 transform group-hover:translate-x-2 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Filter Sidebar */}
            <ProductFilters
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
                initialFilters={filters}
            />
        </div>
    );
}
