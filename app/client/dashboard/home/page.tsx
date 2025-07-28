// app/client/dashboard/home/page.tsx
"use client"; // Обязательно, так как будут интерактивные элементы или эффекты

import React from "react";
import Link from "next/link";
import {
    FaShieldAlt,
    FaTools,
    FaStar,
    FaTruck,
    FaUsers,
    FaTag,
} from "react-icons/fa"; // Добавим новые иконки

export default function HomePage() {
    const featuredProducts = [
        {
            id: 1,
            name: "Современный Виниловый Забор",
            image: "https://via.placeholder.com/400x300?text=Виниловый+Забор", // Замените на реальное изображение
            price: "от $45/фут",
            description:
                "Идеальное решение для долговечности и минимального ухода. Стильный и прочный.",
            link: "/client/dashboard/products/vinyl-fence", // Ссылка на конкретный продукт
        },
        {
            id: 2,
            name: "Классический Деревянный Забор",
            image: "https://via.placeholder.com/400x300?text=Деревянный+Забор", // Замените на реальное изображение
            price: "от $30/фут",
            description:
                "Натуральная красота и прочность. Добавьте уюта вашему участку.",
            link: "/client/dashboard/products/wood-fence",
        },
        {
            id: 3,
            name: "Прочный Металлический Забор",
            image: "https://via.placeholder.com/400x300?text=Металлический+Забор", // Замените на реальное изображение
            price: "от $55/фут",
            description:
                "Максимальная безопасность и современный дизайн. Идеально для любого участка.",
            link: "/client/dashboard/products/metal-fence",
        },
        {
            id: 4,
            name: "Декоративный Кованый Забор",
            image: "https://via.placeholder.com/400x300?text=Кованый+Забор", // Замените на реальное изображение
            price: "по запросу",
            description:
                "Элегантность и эксклюзивность. Создайте неповторимый образ вашего дома.",
            link: "/client/dashboard/products/wrought-iron-fence",
        },
    ];

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={product.link}
                                className="block group"
                            >
                                <div
                                    className="bg-white rounded-lg shadow-lg overflow-hidden
                            transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                                >
                                    {" "}
                                    {/* Эффект поднятия */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-200">
                                            {product.name}
                                        </h3>
                                        <p className="text-base text-[var(--color-text)] mb-3">
                                            {product.description}
                                        </p>
                                        <p className="text-lg font-bold text-[var(--color-accent)] mb-4">
                                            {product.price}
                                        </p>
                                        <button className="w-full bg-[var(--color-primary)] text-white py-2 rounded-md hover:bg-opacity-90 transition-colors duration-200">
                                            Подробнее
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
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
