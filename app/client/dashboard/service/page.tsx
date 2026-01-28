// app/client/dashboard/service/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IconType } from "@/types/icon";
import {
    FaHammer,
    FaWrench,
    FaTools,
    FaCheckCircle,
    FaMoneyBillWave,
    FaUsers,
    FaCalendarAlt,
    FaClock,
    FaVideo,
    FaTimes,
    FaStar,
    FaShieldAlt,
    FaHeadset,
    FaSearch,
} from "react-icons/fa";
import { T } from "../../components/T";
import { ServiceCard } from "../../components/ServiceCard";
import { ConsultationCard } from "../../components/ConsultationCard";
import Link from "next/link";
import { Service, Consultation } from "../../../lib/firebase/products/types";
import AppointmentBooking from "../../components/AppointmentBooking";
import { useCart } from "../../context/CartContext";

const IconMap: Record<string, IconType> = {
    FaHammer: FaHammer as IconType,
    FaWrench: FaWrench as IconType,
    FaTools: FaTools as IconType,
    FaMoneyBillWave: FaMoneyBillWave as IconType,
    FaUsers: FaUsers as IconType,
    FaCalendarAlt: FaCalendarAlt as IconType,
    FaClock: FaClock as IconType,
    FaVideo: FaVideo as IconType,
    FaStar: FaStar as IconType,
    FaShieldAlt: FaShieldAlt as IconType,
    FaHeadset: FaHeadset as IconType,
};

const getIconComponent = (iconName: string): IconType => {
    return IconMap[iconName] || (FaTools as IconType);
};

// Удалено - больше не нужен

export default function ServicePage() {
    const searchParams = useSearchParams();
    const [services, setServices] = useState<Service[]>([]);
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [filteredConsultations, setFilteredConsultations] = useState<
        Consultation[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedConsultation, setSelectedConsultation] =
        useState<Consultation | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [addedServiceName, setAddedServiceName] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const { addServiceToCart } = useCart();

    // Получаем параметр поиска из URL
    useEffect(() => {
        const search = searchParams?.get("search");
        if (search) {
            setSearchQuery(search);
        }
    }, [searchParams]);

    const fetchServiceData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const servicesResponse = await fetch("/api/service");
            const servicesData = await servicesResponse.json();
            if (!servicesResponse.ok) {
                throw new Error(
                    servicesData.message || "Ошибка загрузки услуг"
                );
            }
            setServices(servicesData as Service[]);

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

    // Функция фильтрации услуг и консультаций
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredServices(services);
            setFilteredConsultations(consultations);
            return;
        }

        const searchLower = searchQuery.toLowerCase().trim();

        // Фильтруем услуги
        const filteredSvcs = services.filter((service) => {
            const titleMatch = service.title
                .toLowerCase()
                .includes(searchLower);
            const descriptionMatch =
                service.description?.toLowerCase().includes(searchLower) ||
                false;
            return titleMatch || descriptionMatch;
        });

        // Фильтруем консультации
        const filteredCons = consultations.filter((consultation) => {
            const titleMatch = consultation.title
                .toLowerCase()
                .includes(searchLower);
            const descriptionMatch =
                consultation.description?.toLowerCase().includes(searchLower) ||
                false;
            const featuresMatch =
                consultation.features?.some((feature) =>
                    feature.toLowerCase().includes(searchLower)
                ) || false;
            return titleMatch || descriptionMatch || featuresMatch;
        });

        setFilteredServices(filteredSvcs);
        setFilteredConsultations(filteredCons);
    }, [searchQuery, services, consultations]);

    const handleBookConsultation = (consultation: Consultation) => {
        setSelectedConsultation(consultation);
        setShowBookingModal(true);
    };

    const handleOrderService = (service: Service) => {
        addServiceToCart({
            id: service.id,
            name: service.title,
            price: parseFloat(service.price),
            description: service.description,
        });

        setAddedServiceName(service.title);
        setShowNotification(true);

        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative mb-8 mx-auto w-24 h-24">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center">
                            <div className="w-12 h-12 text-[var(--color-primary)] animate-spin">
                                <svg fill="none" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-4">
                        <T>Loading Services</T>
                    </h2>
                    <p className="text-[var(--color-text)]/60 text-lg">
                        <T>Please wait while we fetch services...</T>
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-xl flex items-center justify-center">
                        <FaTimes className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 mb-3">
                        <T>Something went wrong</T>
                    </h2>
                    <p className="text-[var(--color-text)]/80 mb-8">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white font-bold py-3 px-6 rounded-full hover:scale-105 transition-all duration-200"
                    >
                        <T>Try Again</T>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 py-16 md:py-24">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30">
                            <FaStar className="w-5 h-5 text-white" />
                            <span className="text-white font-bold text-sm">
                                <T>Premium Services</T>
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                            <span className="block">
                                <T>Professional</T>
                            </span>
                            <span className="block text-[var(--color-accent)]">
                                <T>Fencing Services</T>
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            <T>
                                Comprehensive fencing solutions from expert
                                installation to ongoing maintenance and
                                professional consultations.
                            </T>
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Search services and consultations..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    >
                                        <FaTimes className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Search Results Info */}
                        {searchQuery && (
                            <div className="mt-6 text-white/90">
                                <p>
                                    <T>Found</T>: {filteredServices.length}{" "}
                                    <T>services</T>,{" "}
                                    {filteredConsultations.length}{" "}
                                    <T>consultations</T>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-[var(--color-primary)] mb-4">
                            <T>Our Services</T>
                        </h2>
                        <p className="text-lg text-[var(--color-text)]/80 max-w-2xl mx-auto">
                            <T>
                                Professional fencing services tailored to your
                                needs
                            </T>
                        </p>
                    </div>

                    {filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    icon={getIconComponent(
                                        service.icon || "FaTools"
                                    )}
                                    title={service.title}
                                    description={service.description}
                                    price={service.price}
                                    features={service.features}
                                    onOrder={() => handleOrderService(service)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center">
                                <FaSearch className="w-10 h-10 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                <T>No services found</T>
                            </h3>
                            <p className="text-[var(--color-text)]/70 max-w-md mx-auto mb-6">
                                <T>Try adjusting your search query</T>
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
                            >
                                <T>Clear Search</T>
                            </button>
                        </div>
                    )}
                </div>

                {/* Consultations Section */}
                <div>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-[var(--color-primary)] mb-4">
                            <T>Consultation Plans</T>
                        </h2>
                        <p className="text-lg text-[var(--color-text)]/80 max-w-2xl mx-auto">
                            <T>
                                Choose the consultation package that fits your
                                project
                            </T>
                        </p>
                    </div>

                    {filteredConsultations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredConsultations.map((consultation) => (
                                <ConsultationCard
                                    key={consultation.id}
                                    title={consultation.title}
                                    price={consultation.price}
                                    duration={consultation.duration}
                                    features={consultation.features}
                                    description={consultation.description}
                                    onBook={() =>
                                        handleBookConsultation(consultation)
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center">
                                <FaSearch className="w-10 h-10 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                <T>No consultations found</T>
                            </h3>
                            <p className="text-[var(--color-text)]/70 max-w-md mx-auto mb-6">
                                <T>Try adjusting your search query</T>
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
                            >
                                <T>Clear Search</T>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Notification */}
            {showNotification && (
                <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-in-right">
                    <div className="flex items-center gap-3">
                        <FaCheckCircle className="w-6 h-6" />
                        <div>
                            <p className="font-bold">
                                <T>Added to Cart!</T>
                            </p>
                            <p className="text-sm">{addedServiceName}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && selectedConsultation && (
                <AppointmentBooking
                    isOpen={showBookingModal}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedConsultation(null);
                    }}
                    consultationType={selectedConsultation.title}
                    duration={selectedConsultation.duration}
                    features={selectedConsultation.features}
                    price={
                        typeof selectedConsultation.price === "string"
                            ? parseFloat(selectedConsultation.price)
                            : selectedConsultation.price
                    }
                    description={selectedConsultation.description}
                />
            )}
        </div>
    );
}
