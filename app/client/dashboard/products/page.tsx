// app/client/dashboard/products/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProductList from "../../../components/ProductList";
import ProductFilters from "../../../components/ProductFilters"; // Импортируем новый компонент

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    category: string | null;
    inStock: boolean;
}

export default function ProductPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    // Состояния для применённых фильтров (по этим значениям идет запрос к API)
    const [appliedCategory, setAppliedCategory] = useState<string>(
        searchParams.get("category") || "all"
    );
    const [appliedMinPrice, setAppliedMinPrice] = useState<string>(
        searchParams.get("minPrice") || ""
    );
    const [appliedMaxPrice, setAppliedMaxPrice] = useState<string>(
        searchParams.get("maxPrice") || ""
    );

    // Функция для применения фильтров, вызываемая из ProductFilters
    const handleApplyFilters = useCallback(
        (category: string, minPrice: string, maxPrice: string) => {
            setAppliedCategory(category);
            setAppliedMinPrice(minPrice);
            setAppliedMaxPrice(maxPrice);

            // Обновляем URL без перезагрузки страницы
            const params = new URLSearchParams();
            if (category !== "all") {
                params.set("category", category);
            }
            if (minPrice) {
                params.set("minPrice", minPrice);
            }
            if (maxPrice) {
                params.set("maxPrice", maxPrice);
            }
            router.push(`?${params.toString()}`, { scroll: false });
        },
        [router]
    );

    // Функция для сброса фильтров
    const handleResetFilters = useCallback(() => {
        setAppliedCategory("all");
        setAppliedMinPrice("");
        setAppliedMaxPrice("");
        router.push("?", { scroll: false }); // Сбрасываем URL
    }, [router]);

    // Функция для получения продуктов с учетом ПРИМЕНЕННЫХ фильтров
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (appliedCategory !== "all") {
                params.append("category", appliedCategory);
            }
            if (appliedMinPrice) {
                params.append("minPrice", appliedMinPrice);
            }
            if (appliedMaxPrice) {
                params.append("maxPrice", appliedMaxPrice);
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
    }, [appliedCategory, appliedMinPrice, appliedMaxPrice]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch("/api/categories");
                if (!response.ok) {
                    throw new Error(
                        `Ошибка HTTP при загрузке категорий! Статус: ${response.status}`
                    );
                }
                const data = await response.json();
                setCategories(["all", ...data]);
            } catch (e: any) {
                console.error("Ошибка при загрузке категорий:", e);
            }
        }
        fetchCategories();
    }, []);

    const showGroupedView =
        appliedCategory === "all" && !appliedMinPrice && !appliedMaxPrice;

    if (loading) {
        return (
            <div className="bg-[var(--color-background)] text-[var(--color-text)] py-20 text-center">
                <p className="text-xl">Загрузка продуктов...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[var(--color-background)] text-[var(--color-text)] py-20 text-center">
                <p className="text-xl text-red-600">
                    Ошибка при загрузке продуктов: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
                        Наши Продукты: Заборы для Любых Нужд
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        Откройте для себя наш широкий ассортимент
                        высококачественных заборов. Мы предлагаем решения,
                        которые сочетают в себе прочность, безопасность и
                        эстетическую привлекательность.
                    </p>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Используем ProductFilters вместо inline-кода */}
                <ProductFilters
                    onApplyFilters={handleApplyFilters}
                    onResetFilters={handleResetFilters}
                    initialCategory={appliedCategory}
                    initialMinPrice={appliedMinPrice}
                    initialMaxPrice={appliedMaxPrice}
                    availableCategories={categories}
                />

                <section className="mb-12 md:mb-16">
                    <ProductList
                        products={products}
                        showGroupedView={showGroupedView}
                        selectedCategory={appliedCategory}
                    />
                </section>

                <section className="text-center bg-[var(--color-primary)] text-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Не нашли то, что искали?
                    </h2>
                    <p className="text-xl mb-6">
                        Свяжитесь с нами, чтобы получить индивидуальное решение,
                        разработанное специально для вас!
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        Получить Консультацию
                    </Link>
                </section>
            </div>
        </div>
    );
}
