// app/client/dashboard/service/page.tsx
"use client";

import React, { useState, useEffect } from "react";
// Импортируем наш новый тип из папки types
import { IconType } from "../../../api/types/icon";
import {
    FaHammer,
    FaWrench,
    FaTools,
    FaCheckCircle,
    FaMoneyBillWave,
    FaUsers,
} from "react-icons/fa";

import { T } from "../../components/T";
import { ServiceCard } from "../../components/ServiceCard";
import { ConsultationCard } from "../../components/ConsultationCard";
import Link from "next/link";

// Импортируем типы данных для корректной работы
import { Service, Consultation } from "../../../lib/firebase/products/types";

// --- ИСПРАВЛЕНИЕ ОШИБКИ ТИПИЗАЦИИ ---

const IconMap: Record<string, IconType> = {
    FaHammer: FaHammer as IconType,
    FaWrench: FaWrench as IconType,
    FaTools: FaTools as IconType,
    FaMoneyBillWave: FaMoneyBillWave as IconType,
    FaUsers: FaUsers as IconType,
};

const getIconComponent = (iconName: string): IconType => {
    return IconMap[iconName] || (FaTools as IconType);
};

// ------------------------------------

export default function ServicePage() {
    const [services, setServices] = useState<Service[]>([]);
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Функция для загрузки данных об услугах и консультациях
    const fetchServiceData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Загрузка услуг через API-маршрут
            const servicesResponse = await fetch("/api/service");
            const servicesData = await servicesResponse.json();

            if (!servicesResponse.ok) {
                throw new Error(
                    servicesData.message || "Ошибка загрузки услуг"
                );
            }
            setServices(servicesData as Service[]);

            // 2. Загрузка консультаций через API-маршрут
            const consultationsResponse = await fetch("/api/consultations");
            const consultationsData = await consultationsResponse.json();

            if (!consultationsResponse.ok) {
                throw new Error(
                    consultationsData.message || "Ошибка загрузки консультаций"
                );
            }
            setConsultations(consultationsData as Consultation[]);
        } catch (err: any) {
            console.error("Failed to fetch service data:", err);
            setError(err.message || "Не удалось загрузить данные с сервера.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceData();
    }, []);

    // Если идет загрузка или произошла ошибка, показываем соответствующее сообщение
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-[var(--color-primary)]">
                    <T>Loading services and consultations...</T>
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-500">
                    <T>Error loading data:</T> {error}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок и Введение */}
                <section className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
                        <T>
                            Our Services: Complete Range of Solutions for Your
                            Fence
                        </T>
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        <T>At</T>{" "}
                        <strong className="text-[var(--color-primary)]">
                            <T>[Your Company Name]</T>
                        </strong>{" "}
                        <T>
                            we offer not only high-quality fences, but also a
                            full range of services to ensure their durability
                            and perfect appearance. From delivery to
                            installation and subsequent maintenance – we take
                            care of every detail.
                        </T>
                    </p>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Список Услуг */}
                {services.length > 0 && (
                    <section className="mb-12 md:mb-16">
                        <div className="grid md:grid-cols-2 gap-8">
                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                                    style={{
                                        animationDelay: `${index * 150}ms`,
                                    }}
                                >
                                    <ServiceCard
                                        {...service}
                                        // Передаем иконку с утвержденным типом
                                        icon={getIconComponent(service.icon)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Список Консультаций */}
                {consultations.length > 0 && (
                    <section className="py-20 px-4 bg-gray-50">
                        <div className="container mx-auto max-w-7xl">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
                                    <T>Consultations</T>
                                </h2>
                                <p className="text-lg text-gray-500  max-w-2xl mx-auto">
                                    <T>
                                        Choose the right consultation plan for
                                        your project
                                    </T>
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {consultations.map((consultation, index) => (
                                    <ConsultationCard
                                        key={consultation.id}
                                        {...consultation}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Преимущества работы с нами для услуг (Остаются статическими) */}
                <section className="mb-12 md:mb-16 bg-[var(--color-card-bg)] shadow-lg rounded-lg p-8">
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
                                    <T>
                                        Our teams consist of certified
                                        professionals with many years of
                                        experience.
                                    </T>
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
                                    <T>
                                        We provide warranty on all completed
                                        work and materials used.
                                    </T>
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
                                    <T>
                                        We value your time and complete work
                                        within the agreed time frame.
                                    </T>
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
                                    <T>
                                        You will always know the exact cost of
                                        work without hidden fees.
                                    </T>
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
                                    <T>
                                        We adapt our services to the unique
                                        needs of each client.
                                    </T>
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
                                    <T>
                                        From consultation to post-service – we
                                        are with you at every stage.
                                    </T>
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
                        <T>
                            Contact us today to discuss your needs and get
                            professional consultation!
                        </T>
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
