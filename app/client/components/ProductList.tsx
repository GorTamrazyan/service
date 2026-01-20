// app/client/components/ProductList.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { T } from "./T";
import ProductModal from "./ProductModal";
import type { Material, Color } from "../../lib/firebase/products/types";

// Интерфейс для продукта
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

interface ProductListProps {
    products: Product[];
    showGroupedView: boolean;
    selectedCategory?: string;
}

// =========================================================================
// ОСНОВНОЙ КОМПОНЕНТ: ProductList
// =========================================================================
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
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center capitalize">
                            {category}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </>
    );
}

// =========================================================================
// ОТДЕЛЬНЫЙ КОМПОНЕНТ: ProductCard (с улучшениями)
// =========================================================================
export function ProductCard({ product }: { product: Product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
   
    return (
        <>
            <div className="bg-[var(--color-card-bg)] rounded-3xl shadow-lg overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-[var(--color-border)] group">
    {/* Изображение товара с эффектом */}
    <div className="relative p-3">
        <div className="relative w-full h-[200px] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
            {product.imageUrl ? (
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={400}
                    height={500}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    priority
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            )}
            
            
        </div>
        
        {/* Эффект при наведении на изображение */}
        <div className="absolute inset-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-full h-[200px] rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
        </div>
    </div>

    {/* Контент карточки */}
    <div className="p-5 flex flex-col flex-grow">
        {/* Название товара */}
        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2 min-h-[3.5rem] line-clamp-2 leading-tight">
            <T>{product.name}</T>
        </h3>
     
        <div className="mb-4">
            <p className="text-sm text-[var(--color-text)]/80 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                <T>{product.description || "No description available."}</T>
            </p>
        </div>

   
        {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-[var(--color-text)]/60">
                        <T>Colors</T>:
                    </span>
                    <span className="text-xs text-[var(--color-text)]/40">
                        {product.colors.length} <T>options</T>
                    </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((color) => (
                        <button
                            key={color.id}
                            className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95"
                            style={{ backgroundColor: color.hexCode }}
                            aria-label={`Color: ${color.name}`}
                            title={color.name}
                        />
                    ))}
                    {product.colors.length > 6 && (
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">+{product.colors.length - 6}</span>
                        </div>
                    )}
                </div>
            </div>
        )}


        <div className="mt-auto space-y-4">
            {/* Цена */}
            <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[var(--color-accent)]">
                        ${parseFloat(product.price).toFixed(2)}
                    </span>
                    
                </div>
                
                
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-2">
                {/*<button
                    onClick={handleAddToCart}
                    disabled={isColorRequiredAndMissing}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 flex items-center justify-center gap-2 group/btn ${
                        isColorRequiredAndMissing
                            ? "text-gray-400 border-gray-300 dark:border-gray-700 cursor-not-allowed"
                            : "text-[var(--color-success)] border-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-white"
                    }`}
                >
                    <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <T>Add to cart</T>
                </button>*/}
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 py-3 rounded-xl text-[var(--color-primary)] font-semibold text-sm border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                >
                    <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <T>Details</T>
                </button>
            </div>
            
            
        </div>
    </div>

    
</div>

{/* Product Modal */}
<ProductModal
    product={product}
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
/>
</>
);}
