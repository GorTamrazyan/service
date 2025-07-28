// app/client/dashboard/about/page.tsx
"use client"; // <-- ДОБАВЬТЕ ЭТУ СТРОКУ В САМОЕ НАЧАЛО ФАЙЛА

import React, { useState } from "react"; // Убедитесь, что useState импортирован
import Link from "next/link";
import { FaShieldAlt, FaTools, FaHandshake, FaLightbulb } from "react-icons/fa";

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
                "Старый деревянный забор заменен на современный виниловый.",
        },
        {
            before: "https://via.placeholder.com/800x600?text=До+Забора+2",
            after: "https://via.placeholder.com/800x600?text=После+Забора+2",
            description:
                "Установка нового металлического ограждения для безопасности.",
        },
        {
            before: "https://via.placeholder.com/800x600?text=До+Забора+3",
            after: "https://via.placeholder.com/800x600?text=После+Забора+3",
            description: "Преображение участка с помощью декоративного забора.",
        },
        // Добавьте больше изображений по аналогии
    ];

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок и Введение */}
                <section className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight mb-4">
                        О нас: Ваш Надежный Партнер по Заборам в Америке
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        Добро пожаловать в{" "}
                        <strong className="text-[var(--color-primary)]">
                            [Название Вашей Компании]
                        </strong>{" "}
                        – лидера в производстве и установке качественных заборов
                        по всей Америке. Мы специализируемся на предоставлении
                        долговечных и эстетически привлекательных решений для
                        ограждений, которые защищают вашу собственность и
                        улучшают ее внешний вид.
                    </p>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto mt-2">
                        От{" "}
                        <strong className="text-[var(--color-accent)]">
                            деревянных и виниловых
                        </strong>{" "}
                        до{" "}
                        <strong className="text-[var(--color-accent)]">
                            металлических и декоративных
                        </strong>{" "}
                        — мы предлагаем широкий ассортимент материалов и
                        дизайнов, чтобы удовлетворить любые потребности.
                    </p>
                </section>

                {/* --- Карусель "До и После" --- */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                        Наши Проекты: До и После
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
                                <div className="relative w-full h-auto min-h-[400px] md:min-h-[550px] bg-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row items-center justify-center">
                                    {/* Изображение "ДО" */}
                                    <div className="w-full md:w-1/2 h-full relative">
                                        <img
                                            src={item.before}
                                            alt={`До: ${item.description}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                        <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-sm md:text-base font-bold px-3 py-1 rounded-full shadow-md">
                                            ДО
                                        </span>
                                    </div>

                                    {/* Изображение "ПОСЛЕ" */}
                                    <div className="w-full md:w-1/2 h-full relative">
                                        <img
                                            src={item.after}
                                            alt={`После: ${item.description}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                        <span className="absolute top-4 right-4 bg-[var(--color-accent)] text-[var(--color-primary)] text-sm md:text-base font-bold px-3 py-1 rounded-full shadow-md">
                                            ПОСЛЕ
                                        </span>
                                    </div>
                                </div>
                                {/* Описание под слайдом */}
                                <p className="text-center text-md md:text-lg mt-4 mb-8 text-[var(--color-primary)] font-semibold">
                                    {item.description}
                                </p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>
                {/* --- Конец Карусели "До и После" --- */}

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Наша Миссия */}
                <section className="mb-12 md:mb-16 bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4 text-center">
                        Наша Миссия
                    </h2>
                    <p className="text-lg text-center max-w-4xl mx-auto">
                        Наша миссия – обеспечивать наших клиентов
                        высококачественными, надежными и красивыми ограждениями,
                        предоставляя при этом исключительный сервис. Мы
                        стремимся превзойти ожидания, создавая безопасные и
                        стильные пространства для домов и предприятий по всей
                        территории США.
                    </p>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Наша История / Наш Опыт */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6 text-center">
                        Наша История и Опыт
                    </h2>
                    <div className="flex flex-col md:flex-row items-center md:space-x-8">
                        <div className="md:w-1/2 mb-6 md:mb-0">
                            <img
                                src="https://via.placeholder.com/600x400?text=Изображение+Завода+или+Команды"
                                alt="История компании по производству заборов"
                                className="rounded-lg shadow-lg w-full h-auto object-cover"
                            />
                        </div>
                        <div className="md:w-1/2">
                            <p className="text-lg leading-relaxed mb-4">
                                Основанная в{" "}
                                <strong className="text-[var(--color-accent)]">
                                    [Год Основания]
                                </strong>
                                ,{" "}
                                <strong className="text-[var(--color-primary)]">
                                    [Название Вашей Компании]
                                </strong>{" "}
                                быстро завоевала репутацию надежного поставщика
                                и установщика заборов. Мы выросли из страсти к
                                качеству, инновациям и желанию предоставлять
                                первоклассные услуги, которые превосходят
                                ожидания наших клиентов.
                            </p>
                            <p className="text-lg leading-relaxed">
                                С более чем{" "}
                                <strong className="text-[var(--color-accent)]">
                                    [Количество]
                                </strong>{" "}
                                годами опыта в индустрии, мы гордимся своим
                                наследием в производстве и установке заборов. Мы
                                постоянно совершенствуем наши методы и расширяем
                                ассортимент, чтобы предлагать самые современные
                                и эффективные решения для ограждений.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Почему выбирают нас? (Наши Преимущества) */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                        Почему выбирают нас?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                            <FaShieldAlt className="text-[var(--color-accent)] w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                Опыт и Экспертиза
                            </h3>
                            <p className="text-base">
                                Наша команда состоит из высококвалифицированных
                                специалистов с многолетним опытом в
                                проектировании, производстве и установке заборов
                                любой сложности.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                            <FaTools className="text-[var(--color-accent)] w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                Качество Материалов
                            </h3>
                            <p className="text-base">
                                Мы используем только сертифицированные,
                                долговечные материалы от проверенных
                                поставщиков, что гарантирует прочность и
                                долговечность каждого установленного забора.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                            <FaHandshake className="text-[var(--color-accent)] w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                Индивидуальный Подход
                            </h3>
                            <p className="text-base">
                                Мы понимаем, что каждый проект уникален. Мы
                                внимательно прислушиваемся к вашим потребностям
                                и предлагаем индивидуальные решения.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                            <FaLightbulb className="text-[var(--color-accent)] w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                                Превосходный Сервис
                            </h3>
                            <p className="text-base">
                                От первой консультации до завершения установки,
                                мы гарантируем гладкий и профессиональный
                                процесс. Ваше удовлетворение – наш главный
                                приоритет.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-[var(--color-accent)] my-8" />

                {/* Наши Ценности */}
                <section className="mb-12 md:mb-16 bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6 text-center">
                        Наши Ценности
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-accent)] mb-2">
                                Качество
                            </h3>
                            <p className="text-base">
                                Мы стремимся к совершенству во всем, что мы
                                делаем, от выбора материалов до финальной
                                установки, чтобы каждый забор служил
                                десятилетиями.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-accent)] mb-2">
                                Честность
                            </h3>
                            <p className="text-base">
                                Мы строим долгосрочные отношения с клиентами на
                                основе доверия, прозрачности и открытого общения
                                на каждом этапе проекта.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-accent)] mb-2">
                                Клиентоориентированность
                            </h3>
                            <p className="text-base">
                                Ваши потребности и удовлетворение являются
                                движущей силой всего нашего бизнеса. Мы здесь,
                                чтобы превратить ваши идеи в реальность.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-accent)] mb-2">
                                Инновации
                            </h3>
                            <p className="text-base">
                                Мы постоянно ищем новые и лучшие способы
                                предоставить вам самые современные и эффективные
                                решения для ограждений, следуя последним
                                тенденциям индустрии.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Призыв к действию (CTA) */}
                <section className="text-center bg-[var(--color-primary)] text-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Готовы обсудить ваш проект?
                    </h2>
                    <p className="text-xl mb-6">
                        Свяжитесь с нами сегодня, чтобы получить бесплатную
                        консультацию и оценку вашего будущего ограждения!
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
                    >
                        Получить Бесплатную Оценку
                    </Link>
                </section>
            </div>
        </div>
    );
}
