// app/client/dashboard/service/page.tsx
"use client";

import React from "react";
import { T } from "../../../components/T";
import { ServiceCard } from "@/app/components/ServiceCard";
import { ConsultationCard } from "@/app/components/ConsultationCard";
import Link from "next/link";
import {
    FaHammer,
    FaWrench,
    FaTools,
    FaCheckCircle,
} from "react-icons/fa"; // Иконки для услуг и преимуществ





export default function ServicePage() {
        const services = [
            {
                icon: FaHammer,
                title: "Installing a fence",
                description: "Professional installation of fences of any complexity",
                features: [
                    "Site preparation and marking",
                    "Pole installation with concreting",
                    "Installation of sections and corrugated sheets",
                    "Painting and protective coating",
                    "Work warranty up to 5 years",
                ],
            },
            {
                icon: FaWrench,
                title: "Repair and restoration",
                description:
                    "Restoration and modernization of existing fences",
                features: [
                    "Structural Condition Diagnostics",
                    "Replacing Damaged Elements",
                    "Reinforcing Foundations and Pillars",
                    "Renewing Protective Coating",
                    "Modernizing Old Fences",
                ],
            },
        ];

        const consultations = [
            {
                title: "Free",
                description: "Basic telephone consultation",
                price: "0 $",
                features: [
                    "Telephone consultation up to 15 minutes",
                    "General recommendations for fence types",
                    "Approximate cost estimate",
                ],
            },
            {
                title: "Easy",
                description: "Detailed consultation with on-site visit",
                price: "2 000 $",
                features: [
                    "Specialist on-site visit",
                    "Site survey",
                    "On-site consultation up to 1 hour",
                    "Recommendations for material selection",
                    "Preliminary estimate",
                ],
            },
            {
                title: "Average",
                description: "Complex analysis with visualization",
                price: "5 000 $",
                features: [
                    "Everything from the 'Easy' plan",
                    "Detailed technical plan",
                    "3D visualization of the future fence",
                    "Calculation of several options",
                    "Consultation up to 2 hours",
                    "Assistance in choosing a contractor",
                ],
            },
            {
                title: "Full",
                description: "Premium project support",
                price: "10 000 $",
                features: [
                    "Everything from the 'Medium' plan",
                    "Detailed design with drawings",
                    "Several 3D visualization options",
                    "Full material calculation",
                    "Assistance with material procurement",
                    "Consultation throughout the project",
                    "Quality control of work",
                ],
            },
        ];
    
        return (
            <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Заголовок и Введение */}
                    <section className="text-center mb-12 md:mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
                            <T>
                                Our Services: Complete Range of Solutions for
                                Your Fence
                            </T>
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto">
                            <T>At</T>{" "}
                            <strong className="text-[var(--color-primary)]">
                                <T>[Your Company Name]</T>
                            </strong>{" "}
                            <T>
                                we offer not only high-quality fences, but also
                                a full range of services to ensure their
                                durability and perfect appearance. From delivery
                                to installation and subsequent maintenance – we
                                take care of every detail.
                            </T>
                        </p>
                    </section>

                    <hr className="border-[var(--color-accent)] my-8" />

                    {/* Список Услуг */}
                    <section className="mb-12 md:mb-16">
                            <div className="grid md:grid-cols-2 gap-8">
                                {services.map((service, index) => (
                                    <div
                                        key={index}
                                        className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                                        style={{
                                            animationDelay: `${index * 150}ms`,
                                        }}
                                    >
                                        <ServiceCard {...service} />
                                    </div>
                                ))}
                            </div>
                    </section>

                    <hr className="border-[var(--color-accent)] my-8" />

                    <section className="py-20 px-4 bg-gray-50">
                        <div className="container mx-auto max-w-7xl">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
                                    <T>Consultations</T>
                                </h2>
                                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                                    <T>
                                        Choose the right consultation plan for
                                        your project
                                    </T>
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {consultations.map((consultation, index) => (
                                    <ConsultationCard
                                        key={index}
                                        {...consultation}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    <hr className="border-[var(--color-accent)] my-8" />

                    {/* Преимущества работы с нами для услуг */}
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
                                            You will always know the exact cost
                                            of work without hidden fees.
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
                                            From consultation to post-service –
                                            we are with you at every stage.
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
};