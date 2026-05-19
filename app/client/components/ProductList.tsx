"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Ruler } from "lucide-react";
import { T } from "./T";
import ProductModal from "./ProductModal";
import type { Material, Color } from "../../lib/firebase/products/types";

interface Product {
    id: string;
    name: string;
    description: string | null;
    colorPrices?: Record<string, number>;
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
    featured?: boolean;
    discount?: number | null;
    dimensions?: { height?: number; width?: number; length?: number; unit?: string };
}

interface ProductListProps {
    products: Product[];
    showGroupedView: boolean;
    selectedCategory?: string;
}

export default function ProductList({
    products,
    showGroupedView,
    selectedCategory,
}: ProductListProps) {
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.categorId || (product as any).categoryId || "Other";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    const sortedCategoriesDisplay = Object.keys(groupedProducts).sort();

    if (products.length === 0) {
        return (
            <div className="col-span-full text-center py-10">
                <p className="text-2xl text-[var(--color-text)]">
                    <T>
                        Unfortunately, no products were found matching your
                        criteria.
                    </T>
                </p>
                <p className="text-lg text-[var(--color-text)]/70 mt-2">
                    <T>Try changing the filters or contact us.</T>
                </p>
            </div>
        );
    }

    return (
        <>
            {showGroupedView ? (
                sortedCategoriesDisplay.map((category) => (
                    <div key={category} className="mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-8 capitalize">
                            {category}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groupedProducts[category].map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </>
    );
}

export function ProductCard({ product: p }: { product: Product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const img = p.imageUrl ?? p.images?.[0] ?? null;
    const tag = p.featured ? "Featured" : (p.tags?.[0] ?? null);

    const prices = Object.values(p.colorPrices ?? {}).filter((v) => !isNaN(Number(v)));
    const minPrice = prices.length ? Math.min(...prices) : null;
    const maxPrice = prices.length ? Math.max(...prices) : null;
    const priceLabel = prices.length === 0
        ? null
        : minPrice === maxPrice
        ? `$${minPrice!.toFixed(0)}`
        : `$${minPrice!.toFixed(0)} – $${maxPrice!.toFixed(0)}`;

    const dims = p.dimensions;
    const dimsLabel = dims
        ? [dims.height && `${dims.height}`, dims.length && `${dims.length}`]
              .filter(Boolean)
              .join(" × ") + ` ${dims.unit ?? "ft"}`
        : null;

    return (
        <>
            <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] transition-all hover:-translate-y-1 hover:shadow-xl">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-gray-100)]">
                    {img ? (
                        <Image
                            src={img}
                            alt={p.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="h-full w-full bg-[var(--color-gray-200)]" />
                    )}
                    {tag && (
                        <span className="absolute left-3 top-3 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                            <T>{tag}</T>
                        </span>
                    )}
                    {p.discount && (
                        <span className="absolute right-3 top-3 rounded-full bg-[var(--color-error)] px-2.5 py-1 text-xs font-bold text-white">
                            -{p.discount}%
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5 gap-3">
                    {p.material && (
                        <span className="w-fit rounded-md bg-[var(--color-gray-100)] px-2 py-0.5 text-xs font-medium text-[var(--color-gray-500)]">
                            <T>{p.material.name}</T>
                        </span>
                    )}

                    <h3 className="font-serif text-lg font-semibold leading-snug text-[var(--color-text)] line-clamp-2">
                        <T>{p.name}</T>
                    </h3>

                    {p.description && (
                        <p className="text-xs leading-relaxed text-[var(--color-gray-500)] line-clamp-2">
                            <T>{p.description}</T>
                        </p>
                    )}

                    {dimsLabel && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-500)]">
                            <Ruler className="h-3.5 w-3.5 shrink-0" />
                            {dimsLabel}
                        </div>
                    )}

                    {p.colors && p.colors.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                            {p.colors.slice(0, 6).map((c) => (
                                <span
                                    key={c.id}
                                    title={c.name}
                                    className="h-5 w-5 rounded-full border border-[var(--color-border)] shadow-sm"
                                    style={{ backgroundColor: c.hexCode }}
                                />
                            ))}
                            {p.colors.length > 6 && (
                                <span className="text-xs text-[var(--color-gray-500)]">+{p.colors.length - 6}</span>
                            )}
                        </div>
                    )}

                    {p.tags && p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {p.tags.slice(0, 3).map((t) => (
                                <span key={t} className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-gray-500)]">
                                    <T>{t}</T>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-auto border-t border-[var(--color-border)] pt-4 flex items-center justify-between gap-2">
                        {priceLabel ? (
                            <span className="font-serif text-xl font-semibold text-[var(--color-accent)]">
                                {priceLabel}
                            </span>
                        ) : (
                            <span className="text-sm text-[var(--color-gray-500)]"><T>Price on request</T></span>
                        )}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                        >
                            <T>Details</T> <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </article>

            <ProductModal product={p} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
