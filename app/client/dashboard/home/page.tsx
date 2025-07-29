// app/client/dashboard/home/page.tsx
"use client"; // Обязательно, так как будут интерактивные элементы или эффекты

import React, { useEffect, useState } from "react"; // Импортируем useEffect и useState
import Link from "next/link";
import Image from "next/image"; // Импортируем Image для карточек
import {
    FaShieldAlt,
    FaTools,
    FaStar,
    FaTruck,
    FaUsers,
    FaTag,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext"; 

// Интерфейс для продукта - убедитесь, что он соответствует вашей структуре данных
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
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchFeaturedProducts() {
            setLoading(true);
            setError(null);
            try {
                // Загружаем, например, 4 последних или рекомендуемых продукта
                const response = await fetch('/api/products?_limit=4');
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
        }
        fetchFeaturedProducts();
    }, []); // Пустой массив зависимостей означает, что эффект запустится один раз при монтировании


    // --- Начало JSX разметки ---
    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Секция приветствия и призыв к действию (Hero Section) */}
                <section className="text-center mb-16 md:mb-20 bg-[var(--color-primary)] text-white p-8 md:p-12 rounded-lg shadow-xl relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{
                            backgroundImage:
                                "url('https://via.placeholder.com/1200x600?text=Фоновое+изображение+забора')",
                        }}
                    ></div>{" "}
                    {/* Замените на красивое фоновое изображение */}
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                            Добро пожаловать домой, [Имя Пользователя]!
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
                                href="/contact" // Или ссылка на форму быстрой оценки
                                className="inline-block border-2 border-white hover:border-[var(--color-accent)] text-white hover:text-[var(--color-accent)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg"
                            >
                                Получить Бесплатную Оценку
                            </Link>
                        </div>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-12" />

                {/* Секция "Выгодные Предложения" или "Рекомендуемые Продукты" */}
                <section className="mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-10 text-center">
                        Наши Популярные Решения
                    </h2>
                    {loading && (
                        <div className="text-center py-10">
                            <p className="text-xl">
                                Загрузка популярных продуктов...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-10">
                            <p className="text-xl text-red-600">
                                Ошибка при загрузке продуктов: {error}
                            </p>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-2xl text-gray-600">
                                Популярные продукты не найдены.
                            </p>
                        </div>
                    )}

                    {!loading && !error && products.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                // --- Начало кода ProductCard, повторённого здесь ---
                                <div
                                    key={product.id}
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
                                        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2 h-14 overflow-hidden line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-base text-[var(--color-text)] mb-3 h-20 overflow-hidden line-clamp-3">
                                            {product.description ||
                                                "Нет описания."}
                                        </p>
                                        <p className="text-lg font-bold text-[var(--color-accent)] mt-auto mb-4">
                                            {`$${parseFloat(
                                                product.price
                                            ).toFixed(2)}`}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span
                                                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                                    product.inStock
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {product.inStock
                                                    ? "В наличии"
                                                    : "Нет в наличии"}
                                            </span>
                                            <Link
                                                href={`/client/dashboard/products/${product.id}`}
                                                className="bg-[var(--color-primary)] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 text-sm"
                                            >
                                                Подробнее
                                            </Link>
                                            {/* Внутри products.map в home/page.tsx */}
                                            <div
                                                key={product.id}
                                                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col
    transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                                            >
                                                {/* ... изображение, название, описание, цена ... */}
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                                            product.inStock
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {product.inStock
                                                            ? "В наличии"
                                                            : "Нет в наличии"}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            // Используйте анонимную функцию, чтобы вызывать addToCart с product
                                                            addToCart(product);
                                                            alert(
                                                                `${product.name} добавлен в корзину!`
                                                            );
                                                        }}
                                                        disabled={
                                                            !product.inStock
                                                        }
                                                        className={`py-2 px-4 rounded-md transition-colors duration-200 text-sm ${
                                                            product.inStock
                                                                ? "bg-[var(--color-primary)] text-white hover:bg-opacity-90"
                                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        }`}
                                                    >
                                                        {product.inStock
                                                            ? "Добавить в корзину"
                                                            : "Нет в наличии"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

                {/* Секция "Наши Преимущества" (или "Почему выбирают нас") */}
                <section className="mb-16 md:mb-20 bg-white shadow-lg rounded-lg p-8 md:p-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                        Почему клиенты выбирают{" "}
                        <span className="text-[var(--color-accent)]">
                            [Название Вашей Компании]
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

                {/* Секция "Отзывы" (просто заголовок для примера, можно развернуть) */}
                <section className="mb-16 md:mb-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">
                        Что говорят наши клиенты
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto text-[var(--color-text)]">
                        Доверие наших клиентов — лучшая награда. Прочитайте их
                        истории успеха.
                    </p>
                    <Link
                        href="/client/dashboard/testimonials" // Ссылка на страницу с отзывами
                        className="inline-block mt-6 bg-[var(--color-primary)] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        Читать Отзывы
                    </Link>
                </section>

                {/* Финальный призыв к действию */}
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