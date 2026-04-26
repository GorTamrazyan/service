"use client";

import React, { useState, useEffect } from "react";
import { X, Filter, Check } from "lucide-react";
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

const EMPTY: FilterState = {
    categoryId: undefined,
    typeOfProductId: undefined,
    materialId: undefined,
    colorIds: [],
    minPrice: "",
    maxPrice: "",
};

export default function ProductFilters({
    isOpen,
    onClose,
    onApplyFilters,
    initialFilters,
}: ProductFiltersProps) {
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [categories, setCategories] = useState<Category[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [typeOfProducts, setTypeOfProducts] = useState<TypeOfProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        Promise.all([
            fetch("/api/categories").then((r) => r.json()),
            fetch("/api/materials").then((r) => r.json()),
            fetch("/api/colors").then((r) => r.json()),
            fetch("/api/type-of-products").then((r) => r.json()),
        ])
            .then(([cats, mats, cols, types]) => {
                setCategories(cats);
                setMaterials(mats);
                setColors(cols);
                setTypeOfProducts(types);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [isOpen]);

    useEffect(() => { setFilters(initialFilters); }, [initialFilters]);

    const toggleColor = (id: string) =>
        setFilters((prev) => ({
            ...prev,
            colorIds: prev.colorIds.includes(id)
                ? prev.colorIds.filter((c) => c !== id)
                : [...prev.colorIds, id],
        }));

    const hasActive =
        !!(filters.categoryId || filters.typeOfProductId || filters.materialId ||
        filters.colorIds.length > 0 || filters.minPrice || filters.maxPrice);

    const handleApply = () => { onApplyFilters(filters); onClose(); };
    const handleReset = () => { setFilters(EMPTY); onApplyFilters(EMPTY); };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed left-0 top-0 h-full w-80 md:w-96 bg-[var(--color-secondary)] z-50 shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)] flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <Filter className="w-4 h-4 text-[var(--color-primary)]" />
                        <span className="font-serif text-lg font-semibold text-[var(--color-primary)]">
                            <T>Filters</T>
                        </span>
                        {hasActive && (
                            <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                                {[
                                    filters.categoryId,
                                    filters.typeOfProductId,
                                    filters.materialId,
                                    ...filters.colorIds,
                                    filters.minPrice,
                                    filters.maxPrice,
                                ].filter(Boolean).length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-[var(--color-gray-500)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-text)] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
                        </div>
                    ) : (
                        <>
                            {/* Product type */}
                            <Section label="Product Type">
                                <div className="flex flex-wrap gap-2">
                                    <Chip
                                        active={!filters.typeOfProductId}
                                        onClick={() => setFilters({ ...filters, typeOfProductId: undefined })}
                                    >
                                        <T>All</T>
                                    </Chip>
                                    {typeOfProducts.map((t) => (
                                        <Chip
                                            key={t.id}
                                            active={filters.typeOfProductId === t.id}
                                            onClick={() => setFilters({ ...filters, typeOfProductId: t.id })}
                                        >
                                            <T>{t.name}</T>
                                        </Chip>
                                    ))}
                                </div>
                            </Section>

                            <Divider />

                            {/* Category */}
                            <Section label="Category">
                                <div className="flex flex-wrap gap-2">
                                    <Chip
                                        active={!filters.categoryId}
                                        onClick={() => setFilters({ ...filters, categoryId: undefined })}
                                    >
                                        <T>All</T>
                                    </Chip>
                                    {categories.map((c) => (
                                        <Chip
                                            key={c.id}
                                            active={filters.categoryId === c.id}
                                            onClick={() => setFilters({ ...filters, categoryId: c.id })}
                                        >
                                            <T>{c.name}</T>
                                        </Chip>
                                    ))}
                                </div>
                            </Section>

                            <Divider />

                            {/* Material */}
                            <Section label="Material">
                                <div className="space-y-1.5">
                                    {materials.map((m) => {
                                        const checked = filters.materialId === m.id;
                                        return (
                                            <label
                                                key={m.id}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-colors cursor-pointer"
                                            >
                                                <div className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                                                    checked
                                                        ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                                                        : "border-[var(--color-border)]"
                                                }`}>
                                                    {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                                </div>
                                                <span className="text-sm text-[var(--color-text)]"><T>{m.name}</T></span>
                                                <input
                                                    type="radio"
                                                    name="material"
                                                    checked={checked}
                                                    onChange={() => setFilters({
                                                        ...filters,
                                                        materialId: checked ? undefined : m.id,
                                                    })}
                                                    className="hidden"
                                                />
                                            </label>
                                        );
                                    })}
                                </div>
                            </Section>

                            <Divider />

                            {/* Colors */}
                            <Section label="Colors" badge={filters.colorIds.length || undefined}>
                                <div className="grid grid-cols-5 gap-2">
                                    {colors.map((c) => {
                                        const selected = filters.colorIds.includes(c.id || "");
                                        return (
                                            <button
                                                key={c.id}
                                                onClick={() => toggleColor(c.id || "")}
                                                title={c.name}
                                                className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                                                    selected
                                                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                                        : "border-[var(--color-border)] hover:border-[var(--color-primary)]/40"
                                                }`}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-full border border-[var(--color-border)] shadow-sm"
                                                    style={{ backgroundColor: c.hexCode }}
                                                />
                                                <span className="text-[10px] text-[var(--color-gray-500)] truncate w-full text-center leading-tight">
                                                    {c.name}
                                                </span>
                                                {selected && (
                                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--color-accent)] rounded-full flex items-center justify-center">
                                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Section>

                            <Divider />

                            {/* Price range */}
                            <Section label="Price Range">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-[var(--color-gray-500)] mb-1.5 block"><T>Min</T></label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-gray-500)]">$</span>
                                            <input
                                                type="number"
                                                value={filters.minPrice}
                                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                                placeholder="0"
                                                className="w-full pl-6 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-[var(--color-gray-500)] mb-1.5 block"><T>Max</T></label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-gray-500)]">$</span>
                                            <input
                                                type="number"
                                                value={filters.maxPrice}
                                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                                placeholder="1000"
                                                className="w-full pl-6 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="mt-4">
                                    <div className="relative h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                                        <div
                                            className="absolute h-full bg-[var(--color-accent)] rounded-full"
                                            style={{
                                                width: `${((parseInt(filters.maxPrice || "1000") - parseInt(filters.minPrice || "0")) / 1000) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-[var(--color-gray-500)] mt-1">
                                        <span>${filters.minPrice || 0}</span>
                                        <span>${filters.maxPrice || 1000}</span>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[var(--color-border)] flex-shrink-0 flex gap-3">
                    {hasActive && (
                        <button
                            onClick={handleReset}
                            className="flex-1 py-3 border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] rounded-full hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            <T>Reset</T>
                        </button>
                    )}
                    <button
                        onClick={handleApply}
                        className="flex-1 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                    >
                        <T>Apply Filters</T>
                    </button>
                </div>
            </div>
        </>
    );
}

function Section({ label, badge, children }: { label: string; badge?: number; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[var(--color-text)]"><T>{label}</T></h3>
                {badge ? (
                    <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                        {badge}
                    </span>
                ) : null}
            </div>
            {children}
        </div>
    );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                active
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            }`}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="h-px bg-[var(--color-border)]" />;
}
