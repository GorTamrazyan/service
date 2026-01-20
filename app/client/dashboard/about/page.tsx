// app/client/dashboard/about/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    FaShieldAlt,
    FaTools,
    FaHandshake,
    FaLightbulb,
    FaAward,
    FaHeart,
    FaChevronRight,
    FaStar,
    FaHistory,
    FaUsers,
    FaLeaf,
} from "react-icons/fa";
import { T } from "../../components/T";

// Импортируем Swiper React компоненты
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Импортируем стили Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

export default function AboutUsPage() {
    // Данные для карусели "До и После"
    const carouselImages = [
        {
            before: "/images/projects/before1.jpg",
            after: "/images/projects/after1.jpg",
            description: "Old wooden fence replaced with modern vinyl fencing",
            location: "Residential, Seattle",
        },
        {
            before: "/images/projects/before2.jpg",
            after: "/images/projects/after2.jpg",
            description:
                "Commercial property secured with premium metal fencing",
            location: "Business Complex, Chicago",
        },
        {
            before: "/images/projects/before3.jpg",
            after: "/images/projects/after3.jpg",
            description: "Complete yard transformation with decorative fencing",
            location: "Private Estate, Miami",
        },
        {
            before: "/images/projects/before4.jpg",
            after: "/images/projects/after4.jpg",
            description: "Pool area enclosure with elegant safety fencing",
            location: "Luxury Villa, Los Angeles",
        },
    ];

    const values = [
        {
            icon: FaStar,
            title: "Quality",
            description:
                "We strive for excellence in everything we do, from material selection to final installation.",
            color: "text-[var(--color-accent)]",
            gradient: "from-[var(--color-accent)]/20 to-transparent",
        },
        {
            icon: FaHeart,
            title: "Honesty",
            description:
                "Building long-term relationships based on trust, transparency and open communication.",
            color: "text-[var(--color-primary)]",
            gradient: "from-[var(--color-primary)]/20 to-transparent",
        },
        {
            icon: FaUsers,
            title: "Customer Focus",
            description:
                "Your needs and satisfaction are the driving force of our entire business.",
            color: "text-[var(--color-accent)]",
            gradient: "from-[var(--color-accent)]/20 to-transparent",
        },
        {
            icon: FaLeaf,
            title: "Innovation",
            description:
                "Constantly searching for better ways to provide modern and effective fencing solutions.",
            color: "text-[var(--color-primary)]",
            gradient: "from-[var(--color-primary)]/20 to-transparent",
        },
    ];

    const milestones = [
        {
            year: "2010",
            title: "Company Founded",
            description: "Started with a vision for quality fencing",
        },
        {
            year: "2013",
            title: "First Major Project",
            description: "Completed 500+ residential installations",
        },
        {
            year: "2016",
            title: "Expansion",
            description: "Opened second manufacturing facility",
        },
        {
            year: "2020",
            title: "Premium Line Launch",
            description: "Introduced eco-friendly vinyl collection",
        },
        {
            year: "2024",
            title: "Industry Leader",
            description: "Recognized as top fencing provider in US",
        },
    ];

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)]">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)]/90 to-[var(--color-accent)]/30">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <Image
                        src="/images/about/hero-fence.jpg"
                        alt="Premium fencing manufacturing"
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                    <div className="max-w-3xl">
                        <div className="mb-8">
                            <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold border border-white/30">
                                <FaAward className="w-5 h-5" />
                                <T>Trusted Since 2010</T>
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 text-white">
                            <span className="block">
                                <T>Crafting</T>
                            </span>
                            <span className="block text-[var(--color-accent)]">
                                <T>Boundaries</T>
                            </span>
                            <span className="block text-4xl md:text-5xl mt-4">
                                <T>With Purpose</T>
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl leading-relaxed">
                            <T>
                                Leading the fencing industry with premium
                                materials, expert craftsmanship, and unwavering
                                dedication to quality.
                            </T>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/contact"
                                className="group inline-flex items-center justify-center gap-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-primary)] font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                            >
                                <T>Start Your Project</T>
                                <FaChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link
                                href="#projects"
                                className="group inline-flex items-center justify-center gap-3 border-2 border-white/40 hover:border-white text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 backdrop-blur-sm"
                            >
                                <T>View Our Work</T>
                                <FaChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Mission Section */}
            <section className="py-24 bg-gradient-to-b from-white to-[var(--color-card-bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] mb-8">
                            <T>Our Mission & Vision</T>
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <div className="relative p-12 rounded-3xl bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border border-white/20 backdrop-blur-sm">
                                <FaAward className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 text-[var(--color-accent)] bg-white p-3 rounded-full shadow-xl" />
                                <p className="text-2xl md:text-3xl font-semibold text-[var(--color-primary)] leading-relaxed italic text-center">
                                    <T>
                                        "To redefine property boundaries through
                                        innovative design, exceptional
                                        craftsmanship, and sustainable
                                        materials—creating spaces that inspire
                                        security and beauty for generations."
                                    </T>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Before & After Carousel - Modern */}
            <section id="projects" className="py-24 bg-[var(--color-card-bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] mb-6">
                            <T>Transformations That Speak</T>
                        </h2>
                        <p className="text-xl text-[var(--color-text)]/80 max-w-3xl mx-auto">
                            <T>
                                Witness the remarkable before-and-after journeys
                                of spaces transformed by our premium fencing
                                solutions.
                            </T>
                        </p>
                    </div>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        loop={true}
                        className="rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {carouselImages.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10">
                                    <div className="absolute inset-0 flex flex-col md:flex-row">
                                        {/* Before Image */}
                                        <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                            <Image
                                                src={item.before}
                                                alt={`Before: ${item.description}`}
                                                fill
                                                className="object-cover transition-all duration-700 hover:scale-110"
                                            />
                                            <div className="absolute bottom-8 left-8 z-20">
                                                <span className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm md:text-base font-bold px-6 py-3 rounded-full shadow-xl">
                                                    <T>BEFORE</T>
                                                </span>
                                            </div>
                                        </div>

                                        {/* After Image */}
                                        <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                            <Image
                                                src={item.after}
                                                alt={`After: ${item.description}`}
                                                fill
                                                className="object-cover transition-all duration-700 hover:scale-110"
                                            />
                                            <div className="absolute bottom-8 right-8 z-20">
                                                <span className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-primary)] text-sm md:text-base font-bold px-6 py-3 rounded-full shadow-xl">
                                                    <T>AFTER</T>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 z-30">
                                        <div className="max-w-4xl mx-auto text-center">
                                            <p className="text-xl md:text-2xl text-white font-semibold mb-3">
                                                <T>{item.description}</T>
                                            </p>
                                            <p className="text-white/80 flex items-center justify-center gap-2">
                                                <FaHistory className="w-4 h-4" />
                                                <T>{item.location}</T>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 bg-gradient-to-b from-[var(--color-background)] to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] mb-6">
                            <T>Our Journey</T>
                        </h2>
                        <p className="text-xl text-[var(--color-text)]/80 max-w-3xl mx-auto">
                            <T>
                                Over a decade of dedication to excellence in
                                fencing solutions across America.
                            </T>
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-primary)]" />

                        {/* Timeline items */}
                        <div className="space-y-20">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className={`relative flex items-center ${
                                        index % 2 === 0
                                            ? "flex-row"
                                            : "flex-row-reverse"
                                    }`}
                                >
                                    {/* Content */}
                                    <div
                                        className={`w-1/2 ${
                                            index % 2 === 0
                                                ? "pr-12 text-right"
                                                : "pl-12"
                                        }`}
                                    >
                                        <div className="inline-block p-8 rounded-2xl bg-white shadow-2xl border border-gray-100 hover:border-[var(--color-accent)]/30 transition-all duration-500">
                                            <div className="text-5xl font-black text-[var(--color-primary)] mb-4">
                                                {milestone.year}
                                            </div>
                                            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                                <T>{milestone.title}</T>
                                            </h3>
                                            <p className="text-[var(--color-text)]/80">
                                                <T>{milestone.description}</T>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Dot */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[var(--color-accent)] border-4 border-white shadow-xl" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Values Grid */}
            <section className="py-24 bg-[var(--color-card-bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] mb-6">
                            <T>Our Core Values</T>
                        </h2>
                        <p className="text-xl text-[var(--color-text)]/80 max-w-3xl mx-auto">
                            <T>
                                The principles that guide every decision and
                                every project we undertake.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[var(--color-accent)]/30 transition-all duration-500 hover:scale-[1.02]"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                />
                                <div
                                    className={`relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl ${value.color} bg-white/10 mb-8 group-hover:scale-110 transition-transform duration-500`}
                                >
                                    <value.icon className="w-10 h-10" />
                                </div>
                                <h3 className="relative z-10 text-2xl font-bold text-[var(--color-primary)] mb-4">
                                    <T>{value.title}</T>
                                </h3>
                                <p className="relative z-10 text-[var(--color-text)]/80 leading-relaxed">
                                    <T>{value.description}</T>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us - Modern Stats */}
            <section className="py-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            <T>Why We Stand Out</T>
                        </h2>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto">
                            <T>
                                Numbers that reflect our commitment to
                                excellence and customer satisfaction.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: FaShieldAlt,
                                value: "15+",
                                label: "Years Experience",
                                color: "text-[var(--color-accent)]",
                            },
                            {
                                icon: FaTools,
                                value: "5000+",
                                label: "Projects Completed",
                                color: "text-white",
                            },
                            {
                                icon: FaHandshake,
                                value: "98%",
                                label: "Client Satisfaction",
                                color: "text-[var(--color-accent)]",
                            },
                            {
                                icon: FaLightbulb,
                                value: "50+",
                                label: "Expert Team Members",
                                color: "text-white",
                            },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-6 ${stat.color}`}
                                >
                                    <stat.icon className="w-10 h-10" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black text-white mb-3">
                                    {stat.value}
                                </div>
                                <div className="text-lg text-white/80 font-medium">
                                    <T>{stat.label}</T>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: FaShieldAlt,
                                title: "Experience and Expertise",
                                description:
                                    "Highly qualified specialists with years of experience in fencing solutions.",
                            },
                            {
                                icon: FaTools,
                                title: "Material Quality",
                                description:
                                    "Certified, durable materials from trusted suppliers for lasting results.",
                            },
                            {
                                icon: FaHandshake,
                                title: "Individual Approach",
                                description:
                                    "Custom solutions tailored to your unique needs and preferences.",
                            },
                            {
                                icon: FaLightbulb,
                                title: "Excellent Service",
                                description:
                                    "Smooth professional process from consultation to completion.",
                            },
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-[var(--color-accent)] mb-6">
                                    <benefit.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">
                                    <T>{benefit.title}</T>
                                </h3>
                                <p className="text-white/80">
                                    <T>{benefit.description}</T>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern CTA Section */}
            <section className="py-24 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--color-primary)] mb-8">
                            <T>Partner With Excellence</T>
                        </h2>
                        <p className="text-2xl text-[var(--color-primary)]/90 mb-12">
                            <T>
                                Ready to transform your property with fencing
                                that combines beauty, security, and durability?
                            </T>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/contact"
                                className="group inline-flex items-center justify-center gap-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold py-5 px-12 rounded-full text-xl transition-all duration-300 hover:scale-105 shadow-2xl"
                            >
                                <T>Get Free Estimate</T>
                                <FaChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link
                                href="/client/dashboard/products"
                                className="group inline-flex items-center justify-center gap-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white font-bold py-5 px-12 rounded-full text-xl transition-all duration-300 hover:scale-105"
                            >
                                <T>Browse Products</T>
                                <FaChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                        <p className="mt-8 text-[var(--color-primary)]/70 text-lg">
                            <T>
                                Schedule your free consultation today—no
                                obligation, just expert advice.
                            </T>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
