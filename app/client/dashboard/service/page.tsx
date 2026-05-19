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

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredServices(services);
            setFilteredConsultations(consultations);
            return;
        }

        const searchLower = searchQuery.toLowerCase().trim();

        const filteredSvcs = services.filter((service) => {
            const titleMatch = service.title
                .toLowerCase()
                .includes(searchLower);
            const descriptionMatch =
                service.description?.toLowerCase().includes(searchLower) ||
                false;
            return titleMatch || descriptionMatch;
        });

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
            <div className="flex items-center justify-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="text-center max-w-md">
                    <p className="text-[var(--color-text)]/80 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-semibold py-3 px-6 rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                    >
                        <T>Try Again</T>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)]">

            <div className="mb-10">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                    <T>Premium</T>
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[var(--color-primary)] mt-1 mb-4">
                    <T>Fencing Services</T>
                </h1>
                <p className="text-[var(--color-gray-500)] max-w-2xl">
                    <T>
                        Comprehensive fencing solutions from expert installation
                        to ongoing maintenance and professional consultations.
                    </T>
                </p>
                <div className="relative mt-6 max-w-xl">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gray-500)]" />
                    <input
                        type="text"
                        placeholder="Search services and consultations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text)] placeholder-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-gray-500)] hover:text-[var(--color-text)] transition-colors"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="mt-3 text-sm text-[var(--color-gray-500)]">
                        <T>Found</T>: {filteredServices.length} <T>services</T>, {filteredConsultations.length} <T>consultations</T>
                    </p>
                )}
            </div>

            <div>
                <div className="mb-16">
                    <div className="mb-10">
                        <h2 className="font-serif text-3xl font-semibold text-[var(--color-primary)] mb-2">
                            <T>Our Services</T>
                        </h2>
                        <p className="text-[var(--color-gray-500)]">
                            <T>Professional fencing services tailored to your needs</T>
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
                            <p className="text-[var(--color-gray-500)] mb-4"><T>No services found</T></p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/90 transition-colors text-sm font-medium"
                            >
                                <T>Clear Search</T>
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <div className="mb-10">
                        <h2 className="font-serif text-3xl font-semibold text-[var(--color-primary)] mb-2">
                            <T>Consultation Plans</T>
                        </h2>
                        <p className="text-[var(--color-gray-500)]">
                            <T>Choose the consultation package that fits your project</T>
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
                            <p className="text-[var(--color-gray-500)] mb-4"><T>No consultations found</T></p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/90 transition-colors text-sm font-medium"
                            >
                                <T>Clear Search</T>
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
