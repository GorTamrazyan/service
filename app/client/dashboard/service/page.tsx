// app/client/dashboard/service/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { IconType } from "../../../api/types/icon";
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

interface SelectedConsultation {
    id: string;
    title: string;
    duration: number;
    features: string[];
    price: number;
    description: string;
}

export default function ServicePage() {
    const [services, setServices] = useState<Service[]>([]);
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedConsultation, setSelectedConsultation] = useState<SelectedConsultation | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [addedServiceName, setAddedServiceName] = useState<string>("");
    const { addServiceToCart } = useCart();

    const fetchServiceData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const servicesResponse = await fetch("/api/service");
            const servicesData = await servicesResponse.json();
            if (!servicesResponse.ok) {
                throw new Error(servicesData.message || "Ошибка загрузки услуг");
            }
            setServices(servicesData as Service[]);

            const consultationsResponse = await fetch("/api/consultations");
            const consultationsData = await consultationsResponse.json();
            if (!consultationsResponse.ok) {
                throw new Error(consultationsData.message || "Ошибка загрузки консультаций");
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

    const handleBookConsultation = (consultation: Consultation) => {
        setSelectedConsultation({
            id: consultation.id,
            title: consultation.title,
            duration: consultation.duration,
            features: consultation.features,
            price: consultation.price,
            description: consultation.description,
        });
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
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative mb-8 mx-auto w-24 h-24">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center">
                            <div className="w-12 h-12 text-[var(--color-primary)] animate-spin">
                                <svg fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                        <T>Loading Our Services</T>
                    </h2>
                    <p className="text-[var(--color-text)]/60">
                        <T>Discovering premium solutions for you</T>
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[var(--color-background)] to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-error)] flex items-center justify-center">
                            <span className="text-white font-bold text-xl">!</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-error)] mb-4">
                        <T>Oops! Something went wrong</T>
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
                                Comprehensive fencing solutions from expert installation 
                                to ongoing maintenance and professional consultations.
                            </T>
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                                <FaShieldAlt className="w-4 h-4 text-white" />
                                <span className="text-white text-sm"><T>15-Year Warranty</T></span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                                <FaUsers className="w-4 h-4 text-white" />
                                <span className="text-white text-sm"><T>Expert Team</T></span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                                <FaHeadset className="w-4 h-4 text-white" />
                                <span className="text-white text-sm"><T>24/7 Support</T></span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                                <FaMoneyBillWave className="w-4 h-4 text-white" />
                                <span className="text-white text-sm"><T>Best Price</T></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {/* Notification */}
                {showNotification && (
                    <div className="mb-8 animate-slideIn">
                        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 border border-white/20">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <FaCheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">
                                    <T>Service Added!</T>
                                </p>
                                <p className="text-sm text-white/90">
                                    "{addedServiceName}" <T>has been added to your cart</T>
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNotification(false)}
                                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Services Section */}
                {services.length > 0 && (
                    <section className="mb-16 md:mb-20">
                        <div className="mb-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-2 h-10 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">
                                        <T>Premium Services</T>
                                    </h2>
                                    <p className="text-[var(--color-text)]/70 text-sm mt-1">
                                        <T>Comprehensive solutions from installation to maintenance</T>
                                    </p>
                                </div>
                                <div className="ml-auto px-4 py-2 bg-[var(--color-primary)]/10 rounded-lg">
                                    <span className="font-bold text-[var(--color-primary)]">
                                        {services.length}
                                    </span>
                                    <span className="text-[var(--color-text)]/70 text-sm ml-2">
                                        <T>services</T>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    className="animate-fadeIn"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <ServiceCard
                                        {...service}
                                        icon={getIconComponent(service.icon)}
                                        onOrder={() => handleOrderService(service)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Divider */}
                <div className="relative my-12">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--color-accent)]/30"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-6 bg-[var(--color-background)] text-[var(--color-primary)] text-lg font-bold">
                            <T>Professional Consultations</T>
                        </span>
                    </div>
                </div>

                {/* Consultations Section */}
                {consultations.length > 0 && (
                    <section className="mb-16 md:mb-20">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4">
                                <T>Expert Consultation Plans</T>
                            </h2>
                            <p className="text-[var(--color-text)]/70 max-w-2xl mx-auto">
                                <T>Get personalized guidance from our fencing specialists</T>
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {consultations.map((consultation, index) => (
                                <div
                                    key={consultation.id}
                                    className="animate-fadeIn"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <ConsultationCard
                                        title={consultation.title}
                                        description={consultation.description}
                                        price={`$${consultation.price}`}
                                        features={consultation.features.slice(0, 3 + (index % 2))}
                                        duration={consultation.duration}
                                        onBook={() => handleBookConsultation(consultation)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Appointment Booking Modal */}
                <AppointmentBooking
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    consultationType={selectedConsultation?.title || ""}
                    duration={selectedConsultation?.duration || 0}
                    features={selectedConsultation?.features || []}
                    price={selectedConsultation?.price || 0}
                    description={selectedConsultation?.description || ""}
                />

                {/* CTA Section */}
                <section className="mt-20">
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 rounded-2xl overflow-hidden">
                        <div className="p-10 md:p-14 text-center">
                            <div className="max-w-3xl mx-auto">
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30">
                                    <FaCalendarAlt className="w-6 h-6 text-white" />
                                    <span className="text-white font-bold">
                                        <T>Start Your Project</T>
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    <T>Ready to Begin?</T>
                                </h2>

                                <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                                    <T>
                                        Book your free consultation today and let our
                                        experts guide you through the perfect fencing solution.
                                    </T>
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => {
                                            if (consultations.length > 0) {
                                                handleBookConsultation(consultations[0]);
                                            }
                                        }}
                                        className="group bg-white text-[var(--color-primary)] font-bold py-4 px-10 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            <T>Book Free Consultation</T>
                                            <svg
                                                className="w-5 h-5 transform group-hover:translate-x-2 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </button>

                                    <Link
                                        href="/contact"
                                        className="group border-2 border-white text-white font-bold py-4 px-10 rounded-xl hover:bg-white/10 transition-all duration-300"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            <T>Contact Us Directly</T>
                                            <svg
                                                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </span>
                                    </Link>
                                </div>

                                <p className="text-white/60 text-sm mt-8">
                                    <T>Response within 24 hours • No obligation • Flexible scheduling</T>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}