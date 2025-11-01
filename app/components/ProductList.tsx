// app/client/components/ProductList.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "../client/context/CartContext";
import { T } from "./T";
import ProductModal from "./ProductModal";
import type { Material, Color } from "../lib/firebase/products/types";

// Интерфейс для продукта
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

interface ProductListProps {
    products: Product[];
    showGroupedView: boolean;
    selectedCategory?: string;
}

// Основной компонент ProductList
export default function ProductList({
    products,
    showGroupedView,
    selectedCategory,
}: ProductListProps) {
    const groupedProducts = products.reduce((acc, product) => {
        const category = product.categorId || "Other";
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
                    <T>Unfortunately, no products were found matching your criteria.</T>
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
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center capitalize">
                            {category} <T>Fences</T>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {groupedProducts[category].map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </>
    );
}

// Отдельный компонент ProductCard
export function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        alert(`${product.name} added to cart!`);
    };

    return (
        <>
            <div className="bg-[var(--color-card-bg)] rounded-xl shadow-md overflow-hidden flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl border border-[var(--color-border)]">
                <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                        <Image
                            //src={product.imageUrl}
                            src="images/metal_fence_modern.jpeg"
                            alt={product.name}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                            priority
                        />
                    ) : (
                        <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2 h-14 overflow-hidden line-clamp-2">
                        <T>{product.name}</T>
                    </h3>
                    <div className="text-sm text-[var(--color-text)] mb-3 h-20 overflow-hidden line-clamp-3 leading-relaxed">
                        <T>{product.description || "No description."}</T>
                    </div>
                    <div className="flex items-baseline mt-auto mb-4">
                        <span className="text-2xl font-extrabold text-[var(--color-accent)]">
                            {`$${parseFloat(product.price).toFixed(2)}`}
                        </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-3">
                        <button
                            onClick={handleAddToCart}
                            className="py-2 px-4 rounded-full text-[var(--color-success)] font-semibold text-sm border border-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center text-center"
                        >
                                <T>Add to cart</T>
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="py-2 px-4 rounded-full text-[var(--color-primary)] font-semibold text-sm border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center text-center"
                        >
                            <T>Details</T>
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            <ProductModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={handleAddToCart}
            />
        </>
    );
}
