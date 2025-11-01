// app/client/dashboard/products/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import ProductList from "../../../components/ProductList";
import ProductFilters, { FilterState } from "../../../components/ProductFilters";
import { T } from "../../../components/T";
import type { Material, Color, TypeOfProduct } from "../../../lib/firebase/products/types";

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
    images?: string[]; // Массив URL изображений
}

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [typeOfProducts, setTypeOfProducts] = useState<TypeOfProduct[]>([]);

    // Состояние фильтров
    const [filters, setFilters] = useState<FilterState>({
        categoryId: undefined,
        typeOfProductId: undefined,
        materialId: undefined,
        colorIds: [],
        minPrice: "",
        maxPrice: "",
    });

    // Загрузка типов продуктов
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

    // Функция для получения продуктов с учетом фильтров
    const fetchProducts = useCallback(async (currentFilters: FilterState) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();

            if (currentFilters.categoryId) {
                params.append("categoryId", currentFilters.categoryId);
            }
            if (currentFilters.typeOfProductId) {
                params.append("typeOfProductId", currentFilters.typeOfProductId);
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

    // Загрузка продуктов при монтировании
    useEffect(() => {
        fetchProducts(filters);
    }, []);

    // Применение фильтров
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

    // Если есть активные фильтры, не группируем
    const shouldGroup = !hasActiveFilters;

    // Находим ID типов "fence" и "gate"
    const fenceTypeId = typeOfProducts.find(
        (t) => t.name.toLowerCase().includes("fence") || t.name.toLowerCase().includes("забор")
    )?.id;
    const gateTypeId = typeOfProducts.find(
        (t) => t.name.toLowerCase().includes("gate") || t.name.toLowerCase().includes("ворота")
    )?.id;

    console.log("Type of products:", typeOfProducts);
    console.log("Fence type ID:", fenceTypeId);
    console.log("Gate type ID:", gateTypeId);
    console.log("Sample product:", products[0]);

    // Группируем продукты по типу (для отображения раздельно)
    let fenceProducts: Product[] = [];
    let gateProducts: Product[] = [];

    if (shouldGroup) {
        // Группировка по typeOfProductId
        products.forEach((p) => {
            if (gateTypeId && p.typeOfProductId === gateTypeId) {
                gateProducts.push(p);
            } else {
                // Все остальные продукты (в том числе без typeOfProductId) идут в заборы
                fenceProducts.push(p);
            }
        });
    } else {
        // Если фильтры активны, показываем все продукты как заборы (не делим)
        fenceProducts = products;
    }

    if (loading) {
        return (
            <div className="bg-[var(--color-background)] text-[var(--color-text)] py-20 text-center">
                <p className="text-xl">
                    <T>Loading products...</T>
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[var(--color-background)] text-[var(--color-text)] py-20 text-center">
                <p className="text-xl text-[var(--color-error)]">
                    <T>Error loading products</T>: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <section className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
                        <T>Our Products: Fences for Any Need</T>
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        <T>
                            Discover our wide range of high-quality fences. We offer
                            solutions that combine strength, safety and aesthetic appeal.
                        </T>
                    </p>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Filter Button */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md"
                    >
                        <Filter className="w-5 h-5" />
                        <T>Filters</T>
                        {hasActiveFilters && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                                {Object.values(filters).filter((v) =>
                                    Array.isArray(v) ? v.length > 0 : Boolean(v)
                                ).length}
                            </span>
                        )}
                    </button>

                    <p className="text-[var(--color-text)]">
                        <T>Total products</T>: {products.length}
                    </p>
                </div>

                {/* Product List */}
                <section className="mb-12 md:mb-16 space-y-16">
                    {shouldGroup ? (
                        <>
                            {/* Fences Section */}
                            {fenceProducts.length > 0 && (
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                                        <T>
                                            {typeOfProducts.find((t) => t.id === fenceTypeId)?.name ||
                                                "Fences"}
                                        </T>
                                    </h2>
                                    <ProductList
                                        products={fenceProducts}
                                        showGroupedView={false}
                                    />
                                </div>
                            )}

                            {/* Gates Section */}
                            {gateProducts.length > 0 && (
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                                        <T>
                                            {typeOfProducts.find((t) => t.id === gateTypeId)?.name ||
                                                "Gates"}
                                        </T>
                                    </h2>
                                    <ProductList
                                        products={gateProducts}
                                        showGroupedView={false}
                                    />
                                </div>
                            )}

                            {/* No products found */}
                            {fenceProducts.length === 0 && gateProducts.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-2xl text-[var(--color-text)]">
                                        <T>No products found matching your filters.</T>
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Filtered products - no grouping */}
                            {fenceProducts.length > 0 ? (
                                <ProductList products={fenceProducts} showGroupedView={false} />
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-2xl text-[var(--color-text)]">
                                        <T>No products found matching your filters.</T>
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* Contact Section */}
                <section className="text-center bg-[var(--color-primary)] text-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <T>Didn't find what you were looking for?</T>
                    </h2>
                    <p className="text-xl mb-6">
                        <T>
                            Contact us to get a custom solution designed specifically for
                            you!
                        </T>
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        <T>Get Consultation</T>
                    </Link>
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
