// app/client/components/ProductFilters.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { T } from "./T";
import type { Material, Color, Category, TypeOfProduct } from "../lib/firebase/products/types";

interface ProductFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: FilterState) => void;
    initialFilters: FilterState;
}

export interface FilterState {
    categoryId?: string;
    typeOfProductId?: string;
    materialId?: string;
    colorIds: string[];
    minPrice: string;
    maxPrice: string;
}

export default function ProductFilters({
    isOpen,
    onClose,
    onApplyFilters,
    initialFilters,
}: ProductFiltersProps) {
    const [filters, setFilters] = useState<FilterState>(initialFilters);

    // Загружаем данные для фильтров
    const [categories, setCategories] = useState<Category[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [typeOfProducts, setTypeOfProducts] = useState<TypeOfProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Загрузка данных для фильтров
    useEffect(() => {
        async function loadFilterData() {
            setLoading(true);
            try {
                const [categoriesRes, materialsRes, colorsRes, typesRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/materials"),
                    fetch("/api/colors"),
                    fetch("/api/type-of-products"),
                ]);

                const [categoriesData, materialsData, colorsData, typesData] = await Promise.all([
                    categoriesRes.json(),
                    materialsRes.json(),
                    colorsRes.json(),
                    typesRes.json(),
                ]);

                setCategories(categoriesData);
                setMaterials(materialsData);
                setColors(colorsData);
                setTypeOfProducts(typesData);
            } catch (error) {
                console.error("Error loading filter data:", error);
            } finally {
                setLoading(false);
            }
        }

        if (isOpen) {
            loadFilterData();
        }
    }, [isOpen]);

    // Синхронизация с initialFilters
    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const handleColorToggle = (colorId: string) => {
        setFilters((prev) => ({
            ...prev,
            colorIds: prev.colorIds.includes(colorId)
                ? prev.colorIds.filter((id) => id !== colorId)
                : [...prev.colorIds, colorId],
        }));
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters: FilterState = {
            categoryId: undefined,
            typeOfProductId: undefined,
            materialId: undefined,
            colorIds: [],
            minPrice: "",
            maxPrice: "",
        };
        setFilters(resetFilters);
        onApplyFilters(resetFilters);
    };

    const hasActiveFilters =
        filters.categoryId ||
        filters.typeOfProductId ||
        filters.materialId ||
        filters.colorIds.length > 0 ||
        filters.minPrice ||
        filters.maxPrice;

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-80 bg-[var(--color-background)] z-50 shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[var(--color-background)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-[var(--color-primary)]">
                        <T>Filters</T>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="text-center py-4">
                            <p className="text-[var(--color-text)]">
                                <T>Loading filters...</T>
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Type of Product */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-[var(--color-primary)] text-sm uppercase">
                                    <T>Product Type</T>
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="typeOfProduct"
                                            checked={!filters.typeOfProductId}
                                            onChange={() =>
                                                setFilters({ ...filters, typeOfProductId: undefined })
                                            }
                                            className="w-4 h-4 text-[var(--color-accent)]"
                                        />
                                        <span className="text-[var(--color-text)]">
                                            <T>All</T>
                                        </span>
                                    </label>
                                    {typeOfProducts.map((type) => (
                                        <label
                                            key={type.id}
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="typeOfProduct"
                                                checked={filters.typeOfProductId === type.id}
                                                onChange={() =>
                                                    setFilters({ ...filters, typeOfProductId: type.id })
                                                }
                                                className="w-4 h-4 text-[var(--color-accent)]"
                                            />
                                            <span className="text-[var(--color-text)]">
                                                <T>{type.name}</T>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-[var(--color-border)]" />

                            {/* Category */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-[var(--color-primary)] text-sm uppercase">
                                    <T>Category</T>
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={!filters.categoryId}
                                            onChange={() =>
                                                setFilters({ ...filters, categoryId: undefined })
                                            }
                                            className="w-4 h-4 text-[var(--color-accent)]"
                                        />
                                        <span className="text-[var(--color-text)]">
                                            <T>All</T>
                                        </span>
                                    </label>
                                    {categories.map((category) => (
                                        <label
                                            key={category.id}
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={filters.categoryId === category.id}
                                                onChange={() =>
                                                    setFilters({ ...filters, categoryId: category.id })
                                                }
                                                className="w-4 h-4 text-[var(--color-accent)]"
                                            />
                                            <span className="text-[var(--color-text)]">
                                                <T>{category.name}</T>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-[var(--color-border)]" />

                            {/* Material */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-[var(--color-primary)] text-sm uppercase">
                                    <T>Material</T>
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="material"
                                            checked={!filters.materialId}
                                            onChange={() =>
                                                setFilters({ ...filters, materialId: undefined })
                                            }
                                            className="w-4 h-4 text-[var(--color-accent)]"
                                        />
                                        <span className="text-[var(--color-text)]">
                                            <T>All</T>
                                        </span>
                                    </label>
                                    {materials.map((material) => (
                                        <label
                                            key={material.id}
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="material"
                                                checked={filters.materialId === material.id}
                                                onChange={() =>
                                                    setFilters({ ...filters, materialId: material.id })
                                                }
                                                className="w-4 h-4 text-[var(--color-accent)]"
                                            />
                                            <span className="text-[var(--color-text)]">
                                                <T>{material.name}</T>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-[var(--color-border)]" />

                            {/* Colors */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-[var(--color-primary)] text-sm uppercase">
                                    <T>Colors</T>
                                </h3>
                                <div className="space-y-2">
                                    {colors.map((color) => (
                                        <label
                                            key={color.id}
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.colorIds.includes(color.id || "")}
                                                onChange={() => handleColorToggle(color.id || "")}
                                                className="w-4 h-4 text-[var(--color-accent)]"
                                            />
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                                style={{ backgroundColor: color.hexCode }}
                                            />
                                            <span className="text-[var(--color-text)]">
                                                <T>{color.name}</T>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-[var(--color-border)]" />

                            {/* Price Range */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-[var(--color-primary)] text-sm uppercase">
                                    <T>Price Range</T>
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm text-[var(--color-text)] mb-1 block">
                                            <T>Min Price</T>
                                        </label>
                                        <input
                                            type="number"
                                            value={filters.minPrice}
                                            onChange={(e) =>
                                                setFilters({ ...filters, minPrice: e.target.value })
                                            }
                                            placeholder="0"
                                            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--color-text)] mb-1 block">
                                            <T>Max Price</T>
                                        </label>
                                        <input
                                            type="number"
                                            value={filters.maxPrice}
                                            onChange={(e) =>
                                                setFilters({ ...filters, maxPrice: e.target.value })
                                            }
                                            placeholder="1000"
                                            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[var(--color-background)] border-t border-[var(--color-border)] px-6 py-4 space-y-3">
                    <button
                        onClick={handleApply}
                        className="w-full bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <T>Apply Filters</T>
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={handleReset}
                            className="w-full bg-gray-200 dark:bg-gray-700 text-[var(--color-text)] font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <T>Reset All</T>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
