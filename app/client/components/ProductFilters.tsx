// app/client/components/ProductFilters.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Filter } from "lucide-react"; // Добавили Filter
import { T } from "./T";
import type {
    Material,
    Color,
    Category,
    TypeOfProduct,
} from "../../lib/firebase/products/types";

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
                const [categoriesRes, materialsRes, colorsRes, typesRes] =
                    await Promise.all([
                        fetch("/api/categories"),
                        fetch("/api/materials"),
                        fetch("/api/colors"),
                        fetch("/api/type-of-products"),
                    ]);

                const [categoriesData, materialsData, colorsData, typesData] =
                    await Promise.all([
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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 animate-in fade-in"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-80 md:w-96 bg-gradient-to-b from-[var(--color-card-bg)] to-[var(--color-background)] z-50 shadow-2xl overflow-y-auto transform transition-transform duration-300 animate-in slide-in-from-left">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent border-b border-[var(--color-border)] px-6 py-5 flex items-center justify-between z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--color-primary)]/20 rounded-lg">
                            <Filter className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-primary)]">
                                <T>Filters</T>
                            </h2>
                            {hasActiveFilters && (
                                <p className="text-xs text-[var(--color-text)]/60">
                                    {
                                        Object.values(filters).filter((v) =>
                                            Array.isArray(v)
                                                ? v.length > 0
                                                : Boolean(v)
                                        ).length
                                    }{" "}
                                    <T>active</T>
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-[var(--color-primary)]/10 rounded-xl transition-all duration-200 hover:scale-110"
                    >
                        <X className="w-5 h-5 text-[var(--color-primary)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 mx-auto border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin mb-4"></div>
                            <p className="text-[var(--color-text)]">
                                <T>Loading filters...</T>
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Product Type */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                                    <h3 className="font-bold text-[var(--color-primary)] text-base">
                                        <T>Product Type</T>
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                typeOfProductId: undefined,
                                            })
                                        }
                                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                                            !filters.typeOfProductId
                                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg scale-105"
                                                : "bg-[var(--color-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                                        }`}
                                    >
                                        <T>All</T>
                                    </button>
                                    {typeOfProducts.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() =>
                                                setFilters({
                                                    ...filters,
                                                    typeOfProductId: type.id,
                                                })
                                            }
                                            className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                                                filters.typeOfProductId ===
                                                type.id
                                                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg scale-105"
                                                    : "bg-[var(--color-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                                            }`}
                                        >
                                            <T>{type.name}</T>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>

                            {/* Category */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                                    <h3 className="font-bold text-[var(--color-primary)] text-base">
                                        <T>Category</T>
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() =>
                                                setFilters({
                                                    ...filters,
                                                    categoryId: undefined,
                                                })
                                            }
                                            className={`px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                                                !filters.categoryId
                                                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                                    : "bg-[var(--color-secondary)] border-[var(--color-border)] hover:bg-[var(--color-primary)]/10"
                                            }`}
                                        >
                                            <T>All</T>
                                        </button>
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        categoryId: category.id,
                                                    })
                                                }
                                                className={`px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                                                    filters.categoryId ===
                                                    category.id
                                                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                                        : "bg-[var(--color-secondary)] border-[var(--color-border)] hover:bg-[var(--color-primary)]/10"
                                                }`}
                                            >
                                                <T>{category.name}</T>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>

                            {/* Material */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                                    <h3 className="font-bold text-[var(--color-primary)] text-base">
                                        <T>Material</T>
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {materials.map((material) => (
                                        <label
                                            key={material.id}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-200 cursor-pointer group"
                                        >
                                            <div className="relative flex-shrink-0">
                                                <div
                                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                        filters.materialId ===
                                                        material.id
                                                            ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                                                            : "border-[var(--color-border)] group-hover:border-[var(--color-primary)]"
                                                    }`}
                                                >
                                                    {filters.materialId ===
                                                        material.id && (
                                                        <svg
                                                            className="w-3 h-3 text-white"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="flex-1 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                                                <T>{material.name}</T>
                                            </span>
                                            <input
                                                type="radio"
                                                name="material"
                                                checked={
                                                    filters.materialId ===
                                                    material.id
                                                }
                                                onChange={() =>
                                                    setFilters({
                                                        ...filters,
                                                        materialId:
                                                            filters.materialId ===
                                                            material.id
                                                                ? undefined
                                                                : material.id,
                                                    })
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>

                            {/* Colors */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                                    <h3 className="font-bold text-[var(--color-primary)] text-base">
                                        <T>Colors</T>
                                    </h3>
                                    {filters.colorIds.length > 0 && (
                                        <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full">
                                            {filters.colorIds.length}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() =>
                                                handleColorToggle(
                                                    color.id || ""
                                                )
                                            }
                                            className={`relative group flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                                                filters.colorIds.includes(
                                                    color.id || ""
                                                )
                                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 scale-110"
                                                    : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                                            }`}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm mb-2"
                                                style={{
                                                    backgroundColor:
                                                        color.hexCode,
                                                }}
                                            />
                                            <span className="text-xs text-[var(--color-text)] truncate w-full text-center">
                                                <T>{color.name}</T>
                                            </span>
                                            {filters.colorIds.includes(
                                                color.id || ""
                                            ) && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-accent)] rounded-full flex items-center justify-center shadow-md">
                                                    <svg
                                                        className="w-3 h-3 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>

                            {/* Price Range */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                                    <h3 className="font-bold text-[var(--color-primary)] text-base">
                                        <T>Price Range</T>
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-[var(--color-text)] mb-2 block">
                                                <T>Min</T>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text)]/60">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    value={filters.minPrice}
                                                    onChange={(e) =>
                                                        setFilters({
                                                            ...filters,
                                                            minPrice:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="0"
                                                    className="w-full pl-8 pr-3 py-3 border-2 border-[var(--color-border)] rounded-xl bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-[var(--color-text)] mb-2 block">
                                                <T>Max</T>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text)]/60">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    value={filters.maxPrice}
                                                    onChange={(e) =>
                                                        setFilters({
                                                            ...filters,
                                                            maxPrice:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="1000"
                                                    className="w-full pl-8 pr-3 py-3 border-2 border-[var(--color-border)] rounded-xl bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Price Range Slider */}
                                    <div className="pt-2">
                                        <div className="flex items-center justify-between text-sm text-[var(--color-text)]/60 mb-1">
                                            <span>
                                                ${filters.minPrice || 0}
                                            </span>
                                            <span>
                                                ${filters.maxPrice || 1000}
                                            </span>
                                        </div>
                                        <div className="relative h-2">
                                            <div className="absolute w-full h-2 bg-[var(--color-border)] rounded-full"></div>
                                            <div
                                                className="absolute h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"
                                                style={{
                                                    width: `${
                                                        ((parseInt(
                                                            filters.maxPrice ||
                                                                "1000"
                                                        ) -
                                                            parseInt(
                                                                filters.minPrice ||
                                                                    "0"
                                                            )) /
                                                            1000) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gradient-to-t from-[var(--color-card-bg)] via-[var(--color-card-bg)] to-transparent border-t border-[var(--color-border)] px-6 py-5 space-y-3 backdrop-blur-sm">
                    <div className="flex gap-3">
                        {hasActiveFilters && (
                            <button
                                onClick={handleReset}
                                className="flex-1 py-3.5 px-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-xl hover:bg-[var(--color-primary)]/10 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                <T>Reset All</T>
                            </button>
                        )}
                        <button
                            onClick={handleApply}
                            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                            <T>Apply Filters</T>
                        </button>
                    </div>
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
