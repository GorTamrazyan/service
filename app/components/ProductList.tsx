// app/client/components/ProductList.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../client/context/CartContext"; // Убедитесь, что путь правильный

// Интерфейс для продукта
interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    category: string | null;
    inStock: boolean;
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
        const category = product.category || "Другие";
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
                <p className="text-2xl text-gray-600">
                    К сожалению, продукты не найдены по вашим критериям.
                </p>
                <p className="text-lg text-gray-500 mt-2">
                    Попробуйте изменить фильтры или свяжитесь с нами.
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
                            {category} Заборы
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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

    const handleAddToCart = () => {
        addToCart(product);
        alert(`${product.name} добавлен в корзину!`);
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100">
            {product.imageUrl && (
                <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                        priority
                    />
                </div>
            )}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2 h-14 overflow-hidden line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-sm text-[var(--color-text)] mb-3 h-20 overflow-hidden line-clamp-3 leading-relaxed">
                    {product.description || "Нет описания."}
                </p>
                <div className="flex items-baseline mt-auto mb-4">
                    <p className="text-2xl font-extrabold text-[var(--color-accent)]">
                        {`$${parseFloat(product.price).toFixed(2)}`}
                    </p>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border
                            ${
                                product.inStock
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                            }
                        `}
                    >
                        {product.inStock ? "В наличии" : "Нет в наличии"}
                    </span>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className={`
                            py-2 px-4 rounded-full text-white font-semibold text-sm
                            transition-all duration-200 ease-in-out transform hover:scale-105
                            ${
                                product.inStock
                                    ? "bg-[var(--color-primary)] hover:bg-opacity-90 shadow-md hover:shadow-lg"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }
                        `}
                    >
                        {product.inStock
                            ? "Добавить в корзину"
                            : "Нет в наличии"}
                    </button>
                    <Link
                        href={`/client/dashboard/products/${product.id}`}
                        className="py-2 px-4 rounded-full text-[var(--color-primary)] font-semibold text-sm border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center text-center"
                    >
                        Подробнее
                    </Link>
                </div>
            </div>
        </div>
    );
}
