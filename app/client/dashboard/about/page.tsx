"use client";

import React, { useState, useEffect } from "react";
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
    FaTrophy,
    FaRocket,
} from "react-icons/fa";
import { T } from "../../components/T";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

export default function AboutUsPage() {
    
    const [carouselImages, setCarouselImages] = useState<any[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

    useEffect(() => {
        async function loadProjects() {
            try {
                setIsLoadingProjects(true);
                const response = await fetch(
                    "/api/before-after?activeOnly=true",
                );
                if (response.ok) {
                    const data = await response.json();
                    
                    const formattedProjects = data.map((project: any) => ({
                        before: project.beforeImage,
                        after: project.afterImage,
                        description: project.description,
                        location: project.location,
                    }));

                    if (formattedProjects.length > 0) {
                        setCarouselImages(formattedProjects);
                    } else {
                        
                        setCarouselImages(getDefaultProjects());
                    }
                } else {
                    console.error("Failed to load projects");
                    setCarouselImages(getDefaultProjects());
                }
            } catch (error) {
                console.error("Error loading projects:", error);
                setCarouselImages(getDefaultProjects());
            } finally {
                setIsLoadingProjects(false);
            }
        }

        loadProjects();
    }, []);

    const getDefaultProjects = () => [
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
            icon: FaRocket,
        },
        {
            year: "2013",
            title: "First Major Project",
            description: "Completed 500+ residential installations",
            icon: FaTools,
        },
        {
            year: "2016",
            title: "Expansion",
            description: "Opened second manufacturing facility",
            icon: FaShieldAlt,
        },
        {
            year: "2020",
            title: "Premium Line Launch",
            description: "Introduced eco-friendly vinyl collection",
            icon: FaLeaf,
        },
        {
            year: "2024",
            title: "Industry Leader",
            description: "Recognized as top fencing provider in US",
            icon: FaTrophy,
        },
    ];

    const stats = [
        {
            value: "15+",
            label: "Years Experience",
            icon: FaHistory,
        },
        {
            value: "10,000+",
            label: "Projects Completed",
            icon: FaTools,
        },
        {
            value: "98%",
            label: "Customer Satisfaction",
            icon: FaStar,
        },
        {
            value: "50+",
            label: "Expert Team",
            icon: FaUsers,
        },
    ];

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)]">

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
                            <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--color-background)]/20 backdrop-blur-sm text-[var(--color-text)] text-sm font-semibold border border-[var(--color-text)]/30">
                                <FaAward className="w-5 h-5" />
                                <T>Industry Leaders Since 2010</T>
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-[var(--color-background)] leading-tight mb-8">
                            <T>Crafting Quality</T>
                            <br />
                            <span className="text-[var(--color-accent)]">
                                <T>Since Day One</T>
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-[var(--color-background)]/90 mb-12 leading-relaxed">
                            <T>
                                We're not just building fences—we're creating
                                security, privacy, and beauty for homes and
                                businesses across America.
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
                                className="group inline-flex items-center justify-center gap-3 border-2 border-[var(--color-background)]/40 hover:border-[var(--color-background)] text-[var(--color-background)] font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 backdrop-blur-sm"
                            >
                                <T>View Our Work</T>
                                <FaChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card-bg)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] mb-8">
                            <T>Our Mission & Vision</T>
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <div className="relative p-12 rounded-3xl bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border border-[var(--color-text)]/20 backdrop-blur-sm">
                                <FaAward className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 text-[var(--color-accent)] bg-[var(--color-background)] p-3 rounded-full shadow-xl" />
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-8 rounded-2xl bg-[var(--color-background)] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[var(--color-text)]/10"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] mb-4">
                                    <stat.icon className="w-8 h-8 text-[var(--color-background)]" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black text-[var(--color-primary)] mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-[var(--color-text)]/70 font-medium">
                                    <T>{stat.label}</T>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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

                    {isLoadingProjects ? (
                        <div className="flex items-center justify-center h-96 rounded-3xl bg-[var(--color-background)]/50">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto mb-4"></div>
                                <p className="text-[var(--color-text)]/60">
                                    <T>Loading projects...</T>
                                </p>
                            </div>
                        </div>
                    ) : carouselImages.length > 0 ? (
                        <Swiper
                            modules={[
                                Navigation,
                                Pagination,
                                Autoplay,
                                EffectFade,
                            ]}
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

                                            <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                                <Image
                                                    src={item.before}
                                                    alt={`Before: ${item.description}`}
                                                    fill
                                                    className="object-cover transition-all duration-700 hover:scale-110"
                                                />
                                                <div className="absolute bottom-8 left-8 z-20">
                                                    <span className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-background)] text-sm md:text-base font-bold px-6 py-3 rounded-full shadow-xl">
                                                        <T>BEFORE</T>
                                                    </span>
                                                </div>
                                            </div>

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

                                        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                                            <div className="max-w-4xl mx-auto text-center">
                                                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-background)] mb-3">
                                                    {item.description}
                                                </h3>
                                                <p className="text-[var(--color-background)]/90 text-lg flex items-center justify-center gap-2">
                                                    <span>📍</span>
                                                    {item.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="text-center py-20 rounded-3xl bg-[var(--color-background)]/50">
                            <FaHistory className="w-16 h-16 text-[var(--color-text)]/30 mx-auto mb-4" />
                            <p className="text-[var(--color-text)]/60 text-lg">
                                <T>No projects available at the moment</T>
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card-bg)]">
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

                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-primary)]" />

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

                                    <div
                                        className={`w-1/2 ${
                                            index % 2 === 0
                                                ? "pr-12 text-right"
                                                : "pl-12"
                                        }`}
                                    >
                                        <div className="inline-block p-8 rounded-2xl bg-[var(--color-background)] shadow-2xl border border-[var(--color-text)]/10 hover:border-[var(--color-accent)]/30 transition-all duration-500 hover:scale-105">
                                            <div className="flex items-center gap-3 mb-4">
                                                {index % 2 === 0 ? (
                                                    <>
                                                        <div className="text-5xl font-black text-[var(--color-primary)]">
                                                            {milestone.year}
                                                        </div>
                                                        <milestone.icon className="w-8 h-8 text-[var(--color-accent)]" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <milestone.icon className="w-8 h-8 text-[var(--color-accent)]" />
                                                        <div className="text-5xl font-black text-[var(--color-primary)]">
                                                            {milestone.year}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                                <T>{milestone.title}</T>
                                            </h3>
                                            <p className="text-[var(--color-text)]/80">
                                                <T>{milestone.description}</T>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[var(--color-accent)] border-4 border-[var(--color-background)] shadow-xl z-10" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

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
                                className="group relative p-8 rounded-3xl bg-[var(--color-background)]/50 backdrop-blur-sm border border-[var(--color-text)]/10 hover:border-[var(--color-accent)]/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                />
                                <div
                                    className={`relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl ${value.color} bg-[var(--color-background)]/10 mb-8 group-hover:scale-110 transition-transform duration-500`}
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

            <section className="py-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-background)] mb-6">
                            <T>Why We Stand Out</T>
                        </h2>
                        <p className="text-xl text-[var(--color-background)]/80 max-w-3xl mx-auto">
                            <T>
                                Numbers that reflect our commitment to
                                excellence and customer satisfaction.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-10 rounded-3xl bg-[var(--color-background)]/10 backdrop-blur-sm border border-[var(--color-background)]/20 hover:bg-[var(--color-background)]/20 transition-all duration-300">
                            <FaShieldAlt className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-[var(--color-background)] mb-4">
                                <T>Lifetime Warranty</T>
                            </h3>
                            <p className="text-[var(--color-background)]/80 leading-relaxed">
                                <T>
                                    We stand behind our work with comprehensive
                                    warranty coverage on all installations.
                                </T>
                            </p>
                        </div>

                        <div className="text-center p-10 rounded-3xl bg-[var(--color-background)]/10 backdrop-blur-sm border border-[var(--color-background)]/20 hover:bg-[var(--color-background)]/20 transition-all duration-300">
                            <FaTools className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-[var(--color-background)] mb-4">
                                <T>Expert Installation</T>
                            </h3>
                            <p className="text-[var(--color-background)]/80 leading-relaxed">
                                <T>
                                    Our certified professionals ensure perfect
                                    installation every single time.
                                </T>
                            </p>
                        </div>

                        <div className="text-center p-10 rounded-3xl bg-[var(--color-background)]/10 backdrop-blur-sm border border-[var(--color-background)]/20 hover:bg-[var(--color-background)]/20 transition-all duration-300">
                            <FaHandshake className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-[var(--color-background)] mb-4">
                                <T>Customer First</T>
                            </h3>
                            <p className="text-[var(--color-background)]/80 leading-relaxed">
                                <T>
                                    Your satisfaction is our priority, with
                                    dedicated support throughout your project.
                                </T>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-card-bg)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-3xl p-12 md:p-16 shadow-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-background)] mb-6">
                            <T>Ready to Transform Your Space?</T>
                        </h2>
                        <p className="text-xl text-[var(--color-background)]/90 mb-10 leading-relaxed">
                            <T>
                                Let's bring your vision to life with our premium
                                fencing solutions. Contact us today for a free
                                consultation.
                            </T>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="group inline-flex items-center justify-center gap-3 bg-[var(--color-background)] text-[var(--color-primary)] hover:bg-[var(--color-background)]/90 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-xl"
                            >
                                <T>Start Your Project</T>
                                <FaChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link
                                href="/client/dashboard/products/catalog"
                                className="group inline-flex items-center justify-center gap-3 border-2 border-[var(--color-background)] text-[var(--color-background)] hover:bg-[var(--color-background)]/10 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300"
                            >
                                <T>Browse Catalog</T>
                                <FaChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
