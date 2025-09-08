// app/client/dashboard/service/page.tsx
"use client";

import React from "react";
import { T } from "../../../components/T";
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
                        <T>Our Services: Complete Range of Solutions for Your Fence</T>
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        <T>At</T>{" "}
                        <strong className="text-[var(--color-primary)]">
                            <T>[Your Company Name]</T>
                        </strong>{" "}
                        <T>we offer not only high-quality fences, but also a full range of services to ensure their durability and perfect appearance. From delivery to installation and subsequent maintenance – we take care of every detail.</T>
                    </p>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Список Услуг */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                        <T>What we offer</T>
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
                                <T>Material Delivery</T>
                            </h3>
                            <p className="text-lg leading-relaxed">
                                <T>We provide timely and safe delivery of all necessary materials for your fence directly to the site. You don't need to worry about logistics – we will do everything for you, guaranteeing the integrity and safety of every detail.</T>
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
                                <T>Professional Installation (Assembly)</T>
                            </h3>
                            <p className="text-lg leading-relaxed">
                                <T>Our experienced teams perform installation of fences of any complexity in compliance with all quality and safety standards. We guarantee fast, accurate and reliable installation that will serve you for many years.</T>
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
                                <T>Fence Repair and Restoration</T>
                            </h3>
                            <p className="text-lg leading-relaxed">
                                <T>If your fence needs repair after weather conditions, wear or damage, our specialists will quickly restore its functionality and appearance. We work with various materials and types of fencing.</T>
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
                                <T>Maintenance and Care</T>
                            </h3>
                            <p className="text-lg leading-relaxed">
                                <T>To extend the life of your fence, we offer regular maintenance and care services. This includes condition checking, minor repairs, painting or treatment so that your fence always looks like new.</T>
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Преимущества работы с нами для услуг */}
                <section className="mb-12 md:mb-16 bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6 text-center">
                        <T>Why choose our services?</T>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    <T>Experienced Specialists</T>
                                </h3>
                                <p className="text-base">
                                    <T>Our teams consist of certified professionals with many years of experience.</T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    <T>Quality Guarantee</T>
                                </h3>
                                <p className="text-base">
                                    <T>We provide warranty on all completed work and materials used.</T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    <T>Efficiency</T>
                                </h3>
                                <p className="text-base">
                                    <T>We value your time and complete work within the agreed time frame.</T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    <T>Transparent Pricing</T>
                                </h3>
                                <p className="text-base">
                                    <T>You will always know the exact cost of work without hidden fees.</T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    <T>Individual Approach</T>
                                </h3>
                                <p className="text-base">
                                    <T>We adapt our services to the unique needs of each client.</T>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-[var(--color-accent)] w-6 h-6 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                                    <T>Full Service</T>
                                </h3>
                                <p className="text-base">
                                    <T>From consultation to post-service – we are with you at every stage.</T>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Призыв к действию (CTA) */}
                <section className="text-center bg-[var(--color-primary)] text-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <T>Need help with your fence?</T>
                    </h2>
                    <p className="text-xl mb-6">
                        <T>Contact us today to discuss your needs and get professional consultation!</T>
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        <T>Get Consultation</T>
                    </Link>
                </section>
            </div>
        </div>
    );
}
