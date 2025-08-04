// app/client/dashboard/home/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    FaShieldAlt,
    FaTools,
    FaStar,
    FaTruck,
    FaUsers,
    FaTag,
    FaSpinner,
} from "react-icons/fa";

// ПРАВИЛЬНЫЙ импорт ProductCard из компонента ProductList
import { ProductCard } from "../../../components/ProductList";

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

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeaturedProducts() {
            setLoading(true);
            setError(null);
            try {
                // Загружаем популярные продукты из базы данных (максимум 4)
                const response = await fetch(
                    "/api/products?featured=true&_limit=4"
                );
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
                }
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (e: any) {
                console.error("Ошибка загрузки продуктов:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchFeaturedProducts();
    }, []);

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="text-center mb-16 md:mb-20 bg-[var(--color-primary)] text-white p-8 md:p-12 rounded-lg shadow-xl relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{
                            backgroundImage:
                                "url('/images/hero-background.jpg')",
                        }}
                    ></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                            Добро пожаловать домой,{" "}
                            <span className="text-[var(--color-accent)]">
                                Уважаемый клиент
                            </span>
                            !
                        </h1>
                        <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8">
                            Ваш идеальный забор ждет вас. Откройте для себя нашу
                            коллекцию, получите мгновенную оценку и начните
                            преображение вашего участка уже сегодня!
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link
                                href="/client/dashboard/products"
                                className="inline-block bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg"
                            >
                                Посмотреть Все Заборы
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-block border-2 border-white hover:border-[var(--color-accent)] text-white hover:text-[var(--color-accent)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg"
                            >
                                Получить Бесплатную Оценку
                            </Link>
                        </div>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-12" />

                {/* Featured Products Section */}
                <section className="mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-10 text-center">
                        Наши Популярные Решения
                    </h2>

                    {loading && (
                        <div className="flex justify-center items-center py-10">
                            <FaSpinner className="animate-spin text-5xl text-[var(--color-accent)]" />
                            <p className="ml-4 text-2xl text-[var(--color-primary)]">
                                Загрузка популярных продуктов...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-10">
                            <p className="text-xl text-red-600">
                                Ошибка при загрузке продуктов: {error}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Попробуйте обновить страницу или свяжитесь с
                                нами
                            </p>
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-2xl text-gray-600">
                                Популярные продукты не найдены.
                            </p>
                        </div>
                    )}

                    {products.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link
                            href="/client/dashboard/products"
                            className="inline-block bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                        >
                            Смотреть Все Заборы
                        </Link>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-12" />

                {/* Benefits Section */}
                <section className="mb-16 md:mb-20 bg-white shadow-lg rounded-lg p-8 md:p-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                        Почему клиенты выбирают{" "}
                        <span className="text-[var(--color-accent)]">
                            нашу компанию
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex items-start space-x-4">
                            <FaStar className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    Высшее Качество
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    Мы используем только лучшие материалы,
                                    гарантируя долговечность и красоту каждого
                                    забора.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaTruck className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    Полный Спектр Услуг
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    От проектирования и производства до
                                    установки и обслуживания — мы обеспечиваем
                                    комплексный подход.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaUsers className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    Индивидуальный Подход
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    Каждый проект уникален, и мы тщательно
                                    учитываем все ваши пожелания и требования.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaShieldAlt className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    Гарантия Надежности
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    Мы предоставляем гарантию на все наши
                                    изделия и работы, подтверждая нашу
                                    уверенность в качестве.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaTag className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    Конкурентные Цены
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    Предлагаем оптимальное соотношение цены и
                                    качества, делая наши заборы доступными.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaTools className="text-[var(--color-accent)] w-10 h-10 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                    Профессиональный Монтаж
                                </h3>
                                <p className="text-base text-[var(--color-text)]">
                                    Наши бригады — это опытные специалисты,
                                    которые выполнят установку быстро и
                                    качественно.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="mb-16 md:mb-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">
                        Что говорят наши клиенты
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto text-[var(--color-text)]">
                        Доверие наших клиентов — лучшая награда. Прочитайте их
                        истории успеха.
                    </p>
                    <Link
                        href="/client/dashboard/testimonials"
                        className="inline-block mt-6 bg-[var(--color-primary)] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        Читать Отзывы
                    </Link>
                </section>

                {/* Final CTA Section */}
                <section className="text-center bg-[var(--color-accent)] text-[var(--color-primary)] p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Начните свой проект уже сегодня!
                    </h2>
                    <p className="text-xl mb-6">
                        Мы готовы воплотить в жизнь ваши идеи об идеальном
                        заборе. Свяжитесь с нами для бесплатной консультации.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-[var(--color-primary)] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        Связаться с Нами
                    </Link>
                </section>
            </div>
        </div>
    );
}
