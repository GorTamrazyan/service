// app/client/dashboard/service/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
    FaTruck,
    FaHammer,
    FaWrench,
    FaTools,
    FaCheckCircle,
} from "react-icons/fa"; // Иконки для услуг и преимуществ

export default function ServicePage() {
    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок и Введение */}
                <section className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
                        Наши Услуги: Полный Спектр Решений для Вашего Забора
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        В{" "}
                        <strong className="text-[var(--color-primary)]">
                            [Название Вашей Компании]
                        </strong>{" "}
                        мы предлагаем не только высококачественные заборы, но и
                        полный комплекс услуг, чтобы обеспечить их долговечность
                        и безупречный вид. От доставки до установки и
                        последующего обслуживания – мы заботимся о каждой
                        детали.
                    </p>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Список Услуг */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                        Что мы предлагаем
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Услуга: Доставка материалов */}
                        <div
                            className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center
                        transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {" "}
                            {/* <-- Добавлены классы */}
                            <FaTruck className="text-[var(--color-accent)] w-16 h-16 mb-6" />
                            <h3 className="text-2xl font-semibold text-[var(--color-primary)] mb-3">
                                Доставка Материалов
                            </h3>
                            <p className="text-lg leading-relaxed">
                                Мы обеспечиваем своевременную и безопасную
                                доставку всех необходимых материалов для вашего
                                забора прямо на объект. Вам не нужно
                                беспокоиться о логистике – мы сделаем всё за
                                вас, гарантируя целостность и сохранность каждой
                                детали.
                            </p>
                        </div>

                        {/* Услуга: Профессиональная Установка */}
                        <div
                            className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center
                        transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {" "}
                            {/* <-- Добавлены классы */}
                            <FaHammer className="text-[var(--color-accent)] w-16 h-16 mb-6" />
                            <h3 className="text-2xl font-semibold text-[var(--color-primary)] mb-3">
                                Профессиональная Установка (Монтаж)
                            </h3>
                            <p className="text-lg leading-relaxed">
                                Наши опытные бригады выполняют монтаж заборов
                                любой сложности с соблюдением всех стандартов
                                качества и безопасности. Мы гарантируем быструю,
                                аккуратную и надежную установку, которая
                                прослужит вам долгие годы.
                            </p>
                        </div>

                        {/* Услуга: Ремонт и Восстановление */}
                        <div
                            className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center
                        transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {" "}
                            {/* <-- Добавлены классы */}
                            <FaWrench className="text-[var(--color-accent)] w-16 h-16 mb-6" />
                            <h3 className="text-2xl font-semibold text-[var(--color-primary)] mb-3">
                                Ремонт и Восстановление Заборов
                            </h3>
                            <p className="text-lg leading-relaxed">
                                Если ваш забор нуждается в ремонте после
                                погодных условий, износа или повреждений, наши
                                специалисты оперативно восстановят его
                                функциональность и внешний вид. Мы работаем с
                                различными материалами и типами ограждений.
                            </p>
                        </div>

                        {/* Услуга: Обслуживание и Уход */}
                        <div
                            className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center
                        transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {" "}
                            {/* <-- Добавлены классы */}
                            <FaTools className="text-[var(--color-accent)] w-16 h-16 mb-6" />
                            <h3 className="text-2xl font-semibold text-[var(--color-primary)] mb-3">
                                Обслуживание и Уход
                            </h3>
                            <p className="text-lg leading-relaxed">
                                Для продления срока службы вашего забора мы
                                предлагаем услуги по регулярному обслуживанию и
                                уходу. Это включает проверку состояния, мелкий
                                ремонт, покраску или обработку, чтобы ваш забор
                                всегда выглядел как новый.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Преимущества работы с нами для услуг */}
                <section className="mb-12 md:mb-16 bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6 text-center">
                        Почему выбирают наши услуги?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    Опытные Специалисты
                                </h3>
                                <p className="text-base">
                                    Наши команды состоят из сертифицированных
                                    профессионалов с многолетним опытом.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    Гарантия Качества
                                </h3>
                                <p className="text-base">
                                    Мы предоставляем гарантию на все выполненные
                                    работы и используемые материалы.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    Оперативность
                                </h3>
                                <p className="text-base">
                                    Мы ценим ваше время и выполняем работы в
                                    оговоренные сроки.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    Прозрачное Ценообразование
                                </h3>
                                <p className="text-base">
                                    Вы всегда будете знать точную стоимость
                                    работ без скрытых платежей.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    Индивидуальный Подход
                                </h3>
                                <p className="text-base">
                                    Мы адаптируем наши услуги под уникальные
                                    потребности каждого клиента.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    Полный Сервис
                                </h3>
                                <p className="text-base">
                                    От консультации до пост-обслуживания – мы
                                    рядом на каждом этапе.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Призыв к действию (CTA) */}
                <section className="text-center bg-[var(--color-primary)] text-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Нужна помощь с вашим забором?
                    </h2>
                    <p className="text-xl mb-6">
                        Свяжитесь с нами сегодня, чтобы обсудить ваши
                        потребности и получить профессиональную консультацию!
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
