// app/client/components/ProductList.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

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
    selectedCategory: string;
}

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

// =========================================================================
// ОБНОВЛЁННЫЙ КОМПОНЕНТ ProductCard
// =========================================================================
function ProductCard({ product }: { product: Product }) {
    return (
        <div
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col
                 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
            {product.imageUrl && (
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                    priority
                />
            )}
            <div className="p-5 flex flex-col flex-grow">
                {" "}
                {/* Добавляем flex-grow для заполнения доступного пространства */}
                {/* Название продукта: фиксированная высота для 2-х строк, обрезание текста */}
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2 h-14 overflow-hidden line-clamp-2">
                    {product.name}
                </h3>
                {/* Описание продукта: фиксированная высота для 3-х строк, обрезание текста */}
                <p className="text-base text-[var(--color-text)] mb-3 h-20 overflow-hidden line-clamp-3">
                    {product.description || "Нет описания."}
                </p>
                {/* Цена: всегда внизу, за счет flex-grow на родительском блоке p-5 */}
                <p className="text-lg font-bold text-[var(--color-accent)] mt-auto mb-4">
                    {`$${parseFloat(product.price).toFixed(2)}`}
                </p>
                <div className="flex justify-between items-center">
                    <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            product.inStock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {product.inStock ? "В наличии" : "Нет в наличии"}
                    </span>
                    <Link
                        href={`/client/dashboard/products/${product.id}`}
                        className="bg-[var(--color-primary)] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 text-sm"
                    >
                        Подробнее
                    </Link>
                </div>
            </div>
        </div>
    );
}
