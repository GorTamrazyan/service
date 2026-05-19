"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Search, X } from "lucide-react";
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

const EMPTY_FILTERS: FilterState = {
    categoryId: undefined,
    typeOfProductId: undefined,
    materialId: undefined,
    colorIds: [],
    minPrice: "",
    maxPrice: "",
};

export default function ProductPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [typeOfProducts, setTypeOfProducts] = useState<TypeOfProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

    useEffect(() => {
        const search = searchParams?.get("search");
        if (search) setSearchQuery(search);
    }, [searchParams]);

    useEffect(() => {
        async function loadTypeOfProducts() {
            try {
                const res = await fetch("/api/type-of-products");
                if (res.ok) setTypeOfProducts(await res.json());
            } catch {}
        }
        loadTypeOfProducts();
    }, []);

    const fetchProducts = useCallback(async (currentFilters: FilterState) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (currentFilters.categoryId) params.append("categoryId", currentFilters.categoryId);
            if (currentFilters.typeOfProductId) params.append("typeOfProductId", currentFilters.typeOfProductId);
            if (currentFilters.materialId) params.append("materialId", currentFilters.materialId);
            if (currentFilters.colorIds.length > 0) params.append("colorIds", currentFilters.colorIds.join(","));
            if (currentFilters.minPrice) params.append("minPrice", currentFilters.minPrice);
            if (currentFilters.maxPrice) params.append("maxPrice", currentFilters.maxPrice);
            const qs = params.toString();
            const res = await fetch(`/api/products${qs ? `?${qs}` : ""}`);
            if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
            setProducts(await res.json());
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterBySearch = useCallback((list: Product[], q: string) => {
        if (!q.trim()) return list;
        const s = q.toLowerCase().trim();
        return list.filter((p) =>
            p.name.toLowerCase().includes(s) ||
            p.description?.toLowerCase().includes(s) ||
            p.material?.name.toLowerCase().includes(s) ||
            p.colors?.some((c) => c.name.toLowerCase().includes(s)) ||
            p.tags?.some((t) => t.toLowerCase().includes(s))
        );
    }, []);

    useEffect(() => {
        setFilteredProducts(filterBySearch(products, searchQuery));
    }, [products, searchQuery, filterBySearch]);

    useEffect(() => { fetchProducts(filters); }, []);

    const handleApplyFilters = (newFilters: FilterState) => {
        setFilters(newFilters);
        fetchProducts(newFilters);
    };

    const clearAll = () => {
        setSearchQuery("");
        setFilters(EMPTY_FILTERS);
        fetchProducts(EMPTY_FILTERS);
    };

    const hasActiveFilters =
        !!(filters.categoryId || filters.typeOfProductId || filters.materialId ||
        filters.colorIds.length > 0 || filters.minPrice || filters.maxPrice);

    const hasActiveSearch = searchQuery.trim().length > 0;
    const shouldGroup = !hasActiveFilters && !hasActiveSearch;

    const fenceTypeId = typeOfProducts.find((t) =>
        t.name.toLowerCase().includes("fence") || t.name.toLowerCase().includes("забор")
    )?.id;
    const gateTypeId = typeOfProducts.find((t) =>
        t.name.toLowerCase().includes("gate") || t.name.toLowerCase().includes("ворота")
    )?.id;

    let fenceProducts: Product[] = [];
    let gateProducts: Product[] = [];

    if (shouldGroup) {
        filteredProducts.forEach((p) => {
            if (gateTypeId && p.typeOfProductId === gateTypeId) gateProducts.push(p);
            else fenceProducts.push(p);
        });
    } else {
        fenceProducts = filteredProducts;
    }

    const activeFilterCount =
        (filters.categoryId ? 1 : 0) +
        (filters.typeOfProductId ? 1 : 0) +
        (filters.materialId ? 1 : 0) +
        filters.colorIds.length +
        (filters.minPrice ? 1 : 0) +
        (filters.maxPrice ? 1 : 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="text-center max-w-sm">
                    <p className="text-[var(--color-gray-500)] mb-4">{error}</p>
                    <button
                        onClick={() => fetchProducts(filters)}
                        className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/90 transition-colors text-sm font-semibold"
                    >
                        <T>Try Again</T>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Page header */}
            <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                    <T>Catalog</T>
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[var(--color-primary)] mt-1 mb-4">
                    <T>Our Products</T>
                </h1>
                <p className="text-[var(--color-gray-500)] max-w-xl mb-6">
                    <T>Discover our premium selection of vinyl fences and gates</T>
                </p>

                {/* Search + filter bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gray-500)]" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-9 py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] placeholder-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-500)] hover:text-[var(--color-text)] transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        <T>Filters</T>
                        {activeFilterCount > 0 && (
                            <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {(hasActiveFilters || hasActiveSearch) && (
                        <button
                            onClick={clearAll}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm text-[var(--color-gray-500)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                            <T>Clear all</T>
                        </button>
                    )}
                </div>

                {/* Search hint */}
                {hasActiveSearch && (
                    <p className="mt-3 text-sm text-[var(--color-gray-500)]">
                        <T>Results for</T> "<span className="text-[var(--color-primary)] font-medium">{searchQuery}</span>" — {filteredProducts.length} <T>products</T>
                    </p>
                )}
            </div>

            {/* Product sections */}
            <div className="space-y-14">
                {shouldGroup ? (
                    <>
                        {fenceProducts.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="font-serif text-3xl font-semibold text-[var(--color-primary)]">
                                        <T>Fences</T>
                                    </h2>
                                    <div className="flex-1 h-px bg-[var(--color-border)]" />
                                    <span className="text-sm text-[var(--color-gray-500)]">{fenceProducts.length}</span>
                                </div>
                                <ProductList products={fenceProducts} showGroupedView={false} />
                            </section>
                        )}
                        {gateProducts.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="font-serif text-3xl font-semibold text-[var(--color-primary)]">
                                        <T>Gates</T>
                                    </h2>
                                    <div className="flex-1 h-px bg-[var(--color-border)]" />
                                    <span className="text-sm text-[var(--color-gray-500)]">{gateProducts.length}</span>
                                </div>
                                <ProductList products={gateProducts} showGroupedView={false} />
                            </section>
                        )}
                        {fenceProducts.length === 0 && gateProducts.length === 0 && (
                            <EmptyState onClear={clearAll} showClear={hasActiveFilters || hasActiveSearch} />
                        )}
                    </>
                ) : (
                    fenceProducts.length > 0
                        ? <ProductList products={fenceProducts} showGroupedView={false} />
                        : <EmptyState onClear={clearAll} showClear={true} />
                )}
            </div>

            <ProductFilters
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
                initialFilters={filters}
            />
        </div>
    );
}

function EmptyState({ onClear, showClear }: { onClear: () => void; showClear: boolean }) {
    return (
        <div className="text-center py-20">
            <p className="text-[var(--color-gray-500)] mb-4"><T>No products found</T></p>
            {showClear && (
                <button
                    onClick={onClear}
                    className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/90 transition-colors text-sm font-semibold"
                >
                    <T>Clear All Filters</T>
                </button>
            )}
        </div>
    );
}
