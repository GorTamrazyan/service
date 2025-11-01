// app/client/dashboard/about/page.tsx
"use client"; // <-- ДОБАВЬТЕ ЭТУ СТРОКУ В САМОЕ НАЧАЛО ФАЙЛА

import React, { useState } from "react";
import Link from "next/link";
import { FaShieldAlt, FaTools, FaHandshake, FaLightbulb } from "react-icons/fa";
import { T } from "../../../components/T";

// Импортируем Swiper React компоненты
import { Swiper, SwiperSlide } from "swiper/react";
// Импортируем необходимые модули Swiper (например, Navigation, Pagination)
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Импортируем стили Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export default function AboutUsPage() {
    // Данные для карусели "До и После"
    const carouselImages = [
        {
            before: "https://via.placeholder.com/800x600?text=До+Забора+1",
            after: "https://via.placeholder.com/800x600?text=После+Забора+1",
            description:
                "Old wooden fence replaced with modern vinyl.",
        },
        {
            before: "https://via.placeholder.com/800x600?text=До+Забора+2",
            after: "https://via.placeholder.com/800x600?text=После+Забора+2",
            description:
                "Installation of new metal fencing for security.",
        },
        {
            before: "https://via.placeholder.com/800x600?text=До+Забора+3",
            after: "https://via.placeholder.com/800x600?text=После+Забора+3",
            description: "Site transformation with decorative fencing.",
        },
        // Добавьте больше изображений по аналогии
    ];

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок и Введение */}
                <section className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
                        <T>About Us: Your Reliable Partner for Fences in America</T>
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        <T>Welcome to [Your Company Name] – a leader in manufacturing and installing quality fences across America. We specialize in providing durable and aesthetically appealing fencing solutions that protect your property and improve its appearance.</T>
                    </p>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto mt-2">
                        <T>From</T>{" "}
                        <strong className="text-[var(--color-accent)]">
                            <T>wooden and vinyl</T>
                        </strong>{" "}
                        <T>to</T>{" "}
                        <strong className="text-[var(--color-accent)]">
                            <T>metal and decorative</T>
                        </strong>{" "}
                        <T>— we offer a wide range of materials and designs to meet any need.</T>
                    </p>
                </section>

                {/* --- Карусель "До и После" --- */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                        <T>Our Projects: Before and After</T>
                    </h2>
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        className="rounded-lg shadow-xl"
                    >
                        {carouselImages.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-auto min-h-[400px] md:min-h-[550px] bg-[var(--color-gray-200)] rounded-lg overflow-hidden flex flex-col md:flex-row items-center justify-center">
                                    {/* Изображение "ДО" */}
                                    <div className="w-full md:w-1/2 h-full relative">
                                        <img
                                            src={item.before}
                                            alt={`Before: ${item.description}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                        <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-sm md:text-base font-bold px-3 py-1 rounded-full shadow-md">
                                            <T>BEFORE</T>
                                        </span>
                                    </div>

                                    {/* Изображение "ПОСЛЕ" */}
                                    <div className="w-full md:w-1/2 h-full relative">
                                        <img
                                            src={item.after}
                                            alt={`After: ${item.description}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                        <span className="absolute top-4 right-4 bg-[var(--color-accent)] text-[var(--color-primary)] text-sm md:text-base font-bold px-3 py-1 rounded-full shadow-md">
                                            <T>AFTER</T>
                                        </span>
                                    </div>
                                </div>
                                {/* Описание под слайдом */}
                                <p className="text-center text-md md:text-lg mt-4 mb-8 text-[var(--color-primary)] font-semibold">
                                    <T>{item.description}</T>
                                </p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
                {/* --- Конец Карусели "До и После" --- */}

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Наша Миссия */}
                <section className="mb-12 md:mb-16 bg-[var(--color-card-bg)] shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4 text-center">
                        <T>Our Mission</T>
                    </h2>
                    <p className="text-lg text-center max-w-4xl mx-auto">
                        <T>Our mission is to provide our clients with high-quality, reliable and beautiful fences, while providing exceptional service. We strive to exceed expectations by creating safe and stylish spaces for homes and businesses across the United States.</T>
                    </p>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Наша История / Наш Опыт */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6 text-center">
                        <T>Our History and Experience</T>
                    </h2>
                    <div className="flex flex-col md:flex-row items-center md:space-x-8">
                        <div className="md:w-1/2 mb-6 md:mb-0">
                            <img
                                src="https://via.placeholder.com/600x400?text=Company+Factory+or+Team+Image"
                                alt="Company history in fence manufacturing"
                                className="rounded-lg shadow-lg w-full h-auto object-cover"
                            />
                        </div>
                        <div className="md:w-1/2">
                            <p className="text-lg leading-relaxed mb-4">
                                <T>Founded in</T>{" "}
                                <strong className="text-[var(--color-accent)]">
                                    <T>[Year Founded]</T>
                                </strong>
                                <T>,</T>{" "}
                                <strong className="text-[var(--color-primary)]">
                                    <T>[Your Company Name]</T>
                                </strong>{" "}
                                <T>quickly gained a reputation as a reliable supplier and installer of fences. We grew out of a passion for quality, innovation and a desire to provide first-class services that exceed our clients' expectations.</T>
                            </p>
                            <p className="text-lg leading-relaxed">
                                <T>With more than</T>{" "}
                                <strong className="text-[var(--color-accent)]">
                                    <T>[Number]</T>
                                </strong>{" "}
                                <T>years of experience in the industry, we are proud of our heritage in fence manufacturing and installation. We constantly improve our methods and expand our range to offer the most modern and effective fencing solutions.</T>
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Почему выбирают нас? (Наши Преимущества) */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                        <T>Why choose us?</T>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-[var(--color-card-bg)] p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                            <FaShieldAlt className="text-[var(--color-accent)] w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                <T>Experience and Expertise</T>
                            </h3>
                            <p className="text-base">
                                <T>Our team consists of highly qualified specialists with many years of experience in designing, manufacturing and installing fences of any complexity.</T>
                            </p>
                        </div>
                        <div className="bg-[var(--color-card-bg)] p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                            <FaTools className="text-[var(--color-accent)] w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                <T>Material Quality</T>
                            </h3>
                            <p className="text-base">
                                <T>We use only certified, durable materials from trusted suppliers, which guarantees the strength and durability of every installed fence.</T>
                            </p>
                        </div>
                        <div className="bg-[var(--color-card-bg)] p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                            <FaHandshake className="text-[var(--color-accent)] w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                <T>Individual Approach</T>
                            </h3>
                            <p className="text-base">
                                <T>We understand that every project is unique. We listen carefully to your needs and offer individual solutions.</T>
                            </p>
                        </div>
                        <div className="bg-[var(--color-card-bg)] p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                            <FaLightbulb className="text-[var(--color-accent)] w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                <T>Excellent Service</T>
                            </h3>
                            <p className="text-base">
                                <T>From the first consultation to completion of installation, we guarantee a smooth and professional process. Your satisfaction is our top priority.</T>
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Наши Ценности */}
                <section className="mb-12 md:mb-16 bg-[var(--color-card-bg)] shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6 text-center">
                        <T>Our Values</T>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-accent)] mb-2">
                                <T>Quality</T>
                            </h3>
                            <p className="text-base">
                                <T>We strive for excellence in everything we do, from material selection to final installation, so that every fence serves for decades.</T>
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-accent)] mb-2">
                                <T>Honesty</T>
                            </h3>
                            <p className="text-base">
                                <T>We build long-term relationships with clients based on trust, transparency and open communication at every stage of the project.</T>
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-accent)] mb-2">
                                <T>Customer Focus</T>
                            </h3>
                            <p className="text-base">
                                <T>Your needs and satisfaction are the driving force of our entire business. We are here to turn your ideas into reality.</T>
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-accent)] mb-2">
                                <T>Innovation</T>
                            </h3>
                            <p className="text-base">
                                <T>We constantly search for new and better ways to provide you with the most modern and effective fencing solutions, following the latest industry trends.</T>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Призыв к действию (CTA) */}
                <section className="text-center bg-[var(--color-primary)] text-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <T>Ready to discuss your project?</T>
                    </h2>
                    <p className="text-xl mb-6">
                        <T>Contact us today to get a free consultation and estimate for your future fence!</T>
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        <T>Get Free Estimate</T>
                    </Link>
                </section>
            </div>
        </div>
    );
}
