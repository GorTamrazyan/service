// app/client/dashboard/products/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [typeOfProducts, setTypeOfProducts] = useState<TypeOfProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [filters, setFilters] = useState<FilterState>({
        categoryId: undefined,
        typeOfProductId: undefined,
        materialId: undefined,
        colorIds: [],
        minPrice: "",
        maxPrice: "",
    });

    // Получаем параметр поиска из URL при загрузке страницы
    useEffect(() => {
        const search = searchParams?.get("search");
        if (search) {
            setSearchQuery(search);
        }
    }, [searchParams]);

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

    // Функция поиска товаров по запросу
    const filterProductsBySearch = useCallback(
        (productsToFilter: Product[], query: string) => {
            if (!query.trim()) {
                return productsToFilter;
            }

            const searchLower = query.toLowerCase().trim();

            return productsToFilter.filter((product) => {
                // Поиск по названию
                const nameMatch = product.name
                    .toLowerCase()
                    .includes(searchLower);

                // Поиск по описанию
                const descriptionMatch =
                    product.description?.toLowerCase().includes(searchLower) ||
                    false;

                // Поиск по материалу
                const materialMatch =
                    product.material?.name
                        .toLowerCase()
                        .includes(searchLower) || false;

                // Поиск по цветам
                const colorMatch =
                    product.colors?.some((color) =>
                        color.name.toLowerCase().includes(searchLower)
                    ) || false;

                // Поиск по тегам
                const tagMatch =
                    product.tags?.some((tag) =>
                        tag.toLowerCase().includes(searchLower)
                    ) || false;

                return (
                    nameMatch ||
                    descriptionMatch ||
                    materialMatch ||
                    colorMatch ||
                    tagMatch
                );
            });
        },
        []
    );

    // Применение поиска при изменении товаров или запроса
    useEffect(() => {
        const filtered = filterProductsBySearch(products, searchQuery);
        setFilteredProducts(filtered);
    }, [products, searchQuery, filterProductsBySearch]);

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

    const hasActiveSearch = searchQuery.trim().length > 0;

    const [shouldGroup, setShouldGroup] = useState(
        !hasActiveFilters && !hasActiveSearch
    );

    // Обновляем shouldGroup при изменении фильтров или поиска
    useEffect(() => {
        setShouldGroup(!hasActiveFilters && !hasActiveSearch);
    }, [hasActiveFilters, hasActiveSearch]);

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

    // Используем filteredProducts вместо products
    if (shouldGroup) {
        filteredProducts.forEach((p) => {
            if (gateTypeId && p.typeOfProductId === gateTypeId) {
                gateProducts.push(p);
            } else {
                fenceProducts.push(p);
            }
        });
    } else {
        fenceProducts = filteredProducts;
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
                    <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-4">
                        <T>Loading Products</T>
                    </h2>
                    <p className="text-[var(--color-text)]/60 text-lg">
                        <T>Please wait while we fetch your products...</T>
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-xl flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 mb-3">
                        <T>Error Loading Products</T>
                    </h2>
                    <p className="text-[var(--color-text)]/70 mb-6">{error}</p>
                    <button
                        onClick={() => fetchProducts(filters)}
                        className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
                    >
                        <T>Try Again</T>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-secondary)]/20 to-[var(--color-background)]">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
                            <T>Our Products</T>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                            <T>
                                Discover our premium selection of fences and
                                gates
                            </T>
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-background)] to-transparent"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search and Filter Bar */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-primary)]/50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/50 hover:text-[var(--color-primary)] transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="group flex items-center gap-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white px-8 py-3 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        <Filter className="w-5 h-5" />
                        <T>Filters</T>
                        {hasActiveFilters && (
                            <span className="bg-white text-[var(--color-primary)] px-2 py-0.5 rounded-full text-xs font-bold">
                                Active
                            </span>
                        )}
                    </button>
                </div>

                {/* Search Results Info */}
                {searchQuery && (
                    <div className="mb-6 p-4 bg-[var(--color-primary)]/10 rounded-xl">
                        <p className="text-[var(--color-primary)] font-semibold">
                            <T>Search results for</T>: "{searchQuery}"
                            <span className="ml-2 text-[var(--color-text)]/70">
                                ({filteredProducts.length} <T>products found</T>
                                )
                            </span>
                        </p>
                    </div>
                )}

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--color-primary)]/10 hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 rounded-xl flex items-center justify-center mb-4">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">
                            <T>Quality Guaranteed</T>
                        </h3>
                        <p className="text-[var(--color-text)]/70">
                            <T>All products come with our quality assurance</T>
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--color-primary)]/10 hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent)]/80 rounded-xl flex items-center justify-center mb-4">
                            <Palette className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">
                            <T>Custom Options</T>
                        </h3>
                        <p className="text-[var(--color-text)]/70">
                            <T>Choose from various materials and colors</T>
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--color-primary)]/10 hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                            <Truck className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">
                            <T>Fast Delivery</T>
                        </h3>
                        <p className="text-[var(--color-text)]/70">
                            <T>Quick and reliable delivery service</T>
                        </p>
                    </div>
                </div>

                {/* Products Display */}
                <div className="space-y-12">
                    {shouldGroup ? (
                        <>
                            {/* Fences Section */}
                            {fenceProducts.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-4xl font-extrabold text-[var(--color-primary)]">
                                            <T>Fences</T>
                                        </h2>
                                        <div className="flex-1 h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent rounded-full"></div>
                                    </div>
                                    <ProductList
                                        products={fenceProducts}
                                        showGroupedView={true}
                                    />
                                </div>
                            )}

                            {/* Gates Section */}
                            {gateProducts.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-4xl font-extrabold text-[var(--color-primary)]">
                                            <T>Gates</T>
                                        </h2>
                                        <div className="flex-1 h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent rounded-full"></div>
                                    </div>
                                    <ProductList
                                        products={gateProducts}
                                        showGroupedView={true}
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
                                        <p className="text-[var(--color-text)]/70 max-w-md mx-auto mb-6">
                                            <T>
                                                Try adjusting your search or
                                                filters.
                                            </T>
                                        </p>
                                        {(searchQuery || hasActiveFilters) && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setFilters({
                                                        categoryId: undefined,
                                                        typeOfProductId:
                                                            undefined,
                                                        materialId: undefined,
                                                        colorIds: [],
                                                        minPrice: "",
                                                        maxPrice: "",
                                                    });
                                                    fetchProducts({
                                                        categoryId: undefined,
                                                        typeOfProductId:
                                                            undefined,
                                                        materialId: undefined,
                                                        colorIds: [],
                                                        minPrice: "",
                                                        maxPrice: "",
                                                    });
                                                }}
                                                className="mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
                                            >
                                                <T>Clear All Filters</T>
                                            </button>
                                        )}
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
                                    <p className="text-[var(--color-text)]/70 max-w-md mx-auto mb-6">
                                        <T>
                                            Your search or filters didn't match
                                            any products.
                                        </T>
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilters({
                                                categoryId: undefined,
                                                typeOfProductId: undefined,
                                                materialId: undefined,
                                                colorIds: [],
                                                minPrice: "",
                                                maxPrice: "",
                                            });
                                            fetchProducts({
                                                categoryId: undefined,
                                                typeOfProductId: undefined,
                                                materialId: undefined,
                                                colorIds: [],
                                                minPrice: "",
                                                maxPrice: "",
                                            });
                                        }}
                                        className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
                                    >
                                        <T>Clear All Filters</T>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Filter Modal */}
            <ProductFilters
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
                initialFilters={filters}
            />
        </div>
    );
}
