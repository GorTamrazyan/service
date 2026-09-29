"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    FaShieldAlt,
    FaTools,
    FaHandshake,
    FaAward,
    FaHeart,
    FaChevronRight,
    FaStar,
    FaHistory,
    FaUsers,
    FaLeaf,
    FaTrophy,
    FaRocket,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClipboardList,
    FaFileSignature,
    FaPaintRoller,
    FaSun,
    FaWater,
    FaHome,
    FaQuoteLeft,
    FaSwimmingPool,
    FaDoorOpen,
    FaBuilding,
    FaLayerGroup,
    FaUmbrella,
} from "react-icons/fa";
import { T } from "../../components/T";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

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
            description:
                "Old wooden fence replaced with modern vinyl privacy fencing",
            location: "Residential, North Hollywood",
        },
        {
            before: "/images/projects/before2.jpg",
            after: "/images/projects/after2.jpg",
            description:
                "Backyard secured with premium vinyl privacy fence with accent",
            location: "Private Home, Glendale",
        },
        {
            before: "/images/projects/before3.jpg",
            after: "/images/projects/after3.jpg",
            description: "Pool area enclosed with vinyl safety fencing",
            location: "Luxury Villa, Los Angeles",
        },
        {
            before: "/images/projects/before4.jpg",
            after: "/images/projects/after4.jpg",
            description: "Yard transformation with vinyl ranch rail fencing",
            location: "Ranch Property, Ventura County",
        },
    ];

    const services = [
        {
            icon: FaHome,
            title: "Vinyl Privacy Fences",
            description:
                "Solid panel fences that block the view and create a secluded, secure space for your family.",
        },
        {
            icon: FaShieldAlt,
            title: "Vinyl Picket Fences",
            description:
                "Classic picket styles that add charm and curb appeal while keeping children and pets safe.",
        },
        {
            icon: FaSwimmingPool,
            title: "Vinyl Pool Enclosures",
            description:
                "Elegant safety fencing around pools that meets code requirements and looks beautiful.",
        },
        {
            icon: FaDoorOpen,
            title: "Vinyl Gates",
            description:
                "Matching gates in all styles and sizes, including self-closing and self-latching options.",
        },
        {
            icon: FaLayerGroup,
            title: "Vinyl Wall Toppers",
            description:
                "Add privacy and style to existing block or masonry walls with decorative vinyl toppers.",
        },
        {
            icon: FaUmbrella,
            title: "Vinyl Patio Covers",
            description:
                "Durable patio covers that extend your outdoor living space and protect from the sun.",
        },
    ];

    const vinylAdvantages = [
        {
            icon: FaTrophy,
            title: "Great Investment",
            description:
                "It's durable, long-lasting and comes in a variety of styles to suit any home.",
        },
        {
            icon: FaHeart,
            title: "Beautiful to Look At",
            description:
                "Vinyl fence is a great option for homeowners who want to add beauty, style and privacy to their property.",
        },
        {
            icon: FaSun,
            title: "Weather Resistant",
            description:
                "Vinyl is the most recommended for its durability and versatility in any climate.",
        },
        {
            icon: FaPaintRoller,
            title: "Easy to Maintain",
            description:
                "They require little to no painting or staining, and they won't need to be replaced or repaired as often as wood fences.",
        },
    ];

    const workingProcess = [
        {
            icon: FaClipboardList,
            step: "Step 1",
            title: "Get Free Estimate",
            description:
                "We will visit your property for measurements and give you a free quote.",
        },
        {
            icon: FaFileSignature,
            step: "Step 2",
            title: "Sign Contract",
            description:
                "After quoting the estimate of works, we will ask you to sign a contract.",
        },
        {
            icon: FaTools,
            step: "Step 3",
            title: "Vinyl Fence Installation",
            description:
                "And finally, our highly-trained technicians will install your new fence.",
        },
    ];

    const testimonials = [
        {
            text: "Vinyl Fence General exceeded my expectations! Alex and his team installed a beautiful fence in my backyard, and I love that it's made in the USA. The quality is outstanding, and the installation was quick and professional. Highly recommend!",
            author: "Happy Customer",
            source: "Google Review",
        },
        {
            text: "Alex and his crew did an amazing job installing our new fence. The whole process was smooth, and the quality of the materials is top-notch. I love supporting a company that uses American-made products. Highly recommended!",
            author: "Happy Customer",
            source: "Google Review",
        },
        {
            text: "Excellent quality, great price and work done quickly. We couldn't have asked for a better experience with Fence General.",
            author: "Happy Customer",
            source: "Google Review",
        },
        {
            text: "Our new fence from Vinyl Fence General is perfect! Alex guided us through the process, and the installation was smooth. The quality of the American-made materials really stands out. We're so pleased with the results!",
            author: "Happy Customer",
            source: "Google Review",
        },
        {
            text: "The service is amazing and the staff is polite, knowledgeable and experienced. I called many companies for a construction fence and was either quoted too much or got responses from unprofessional companies.",
            author: "Happy Customer",
            source: "Google Review",
        },
        {
            text: "Alex and his team at Vinyl Fence General were amazing. The installation was quick and efficient, and the fence is incredibly sturdy. It's great to know that the materials are made in the USA. Highly recommend!",
            author: "Happy Customer",
            source: "Yelp Review",
        },
    ];

    const values = [
        {
            icon: FaStar,
            title: "Quality",
            description:
                "High-quality, American-made vinyl fence products, professionally installed to last for decades.",
            color: "text-[var(--color-accent)]",
            gradient: "from-[var(--color-accent)]/20 to-transparent",
        },
        {
            icon: FaHeart,
            title: "Honesty",
            description:
                "A family-owned business building long-term relationships based on trust and transparency.",
            color: "text-[var(--color-primary)]",
            gradient: "from-[var(--color-primary)]/20 to-transparent",
        },
        {
            icon: FaUsers,
            title: "Customer Focus",
            description:
                "Your needs and satisfaction are the driving force of our entire business, from estimate to final walkthrough.",
            color: "text-[var(--color-accent)]",
            gradient: "from-[var(--color-accent)]/20 to-transparent",
        },
        {
            icon: FaShieldAlt,
            title: "Made in the USA",
            description:
                "We install durable American-made vinyl fencing from trusted manufacturers such as DuraMax.",
            color: "text-[var(--color-primary)]",
            gradient: "from-[var(--color-primary)]/20 to-transparent",
        },
    ];

    const milestones = [
        {
            year: "2010",
            title: "Company Founded",
            description:
                "Vinyl Fence General opens in Los Angeles with a vision for quality, affordable fencing",
            icon: FaRocket,
        },
        {
            year: "2013",
            title: "Growing Reputation",
            description:
                "Became known as one of the finest vinyl fence installation companies in Los Angeles",
            icon: FaTools,
        },
        {
            year: "2016",
            title: "Service Area Expansion",
            description:
                "Extended installations across LA Metro, Orange and Ventura Counties",
            icon: FaShieldAlt,
        },
        {
            year: "2020",
            title: "10-Year Anniversary",
            description:
                "A decade of outstanding vinyl fence products and expert installations",
            icon: FaLeaf,
        },
        {
            year: "2024",
            title: "Top-Rated in LA",
            description:
                "Recognized among the best vinyl fence companies in Los Angeles County",
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
            value: "4.9/5",
            label: "Google Rating",
            icon: FaStar,
        },
        {
            value: "100+",
            label: "Happy Customer Reviews",
            icon: FaHeart,
        },
        {
            value: "4+",
            label: "Counties Served",
            icon: FaMapMarkerAlt,
        },
    ];

    const serviceAreas = [
        "San Fernando Valley",
        "Los Angeles Metro Area",
        "Orange County",
        "Ventura County",
        "And More",
    ];

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)]">
            {/* ============ HERO ============ */}
            <section className="pb-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                    <T>Family-Owned &amp; Operated Since 2010</T>
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[var(--color-primary)] mt-1 mb-4">
                    <T>The Best Vinyl Fencing Company In Los Angeles</T>
                </h1>
                <p className="text-[var(--color-gray-500)] max-w-2xl mb-8">
                    <T>
                        Vinyl fencing is a great way to add both privacy and
                        beauty to your Los Angeles home. We are your local vinyl
                        fencing company serving the San Fernando Valley, Los
                        Angeles Metro Area, Orange County, Ventura County and
                        more.
                    </T>
                </p>
                
            </section>

            {/* ============ MISSION & STATS ============ */}
            <section className="py-16 border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-6">
                            <T>Our Mission &amp; Vision</T>
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <div className="relative p-6 sm:p-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
                                <FaAward className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 text-[var(--color-accent)] bg-[var(--color-background)] p-3 rounded-full shadow" />
                                <p className="text-xl md:text-2xl font-serif font-semibold text-[var(--color-primary)] leading-relaxed italic text-center">
                                    <T>
                                        "To provide high-quality, durable and
                                        affordable vinyl fencing solutions,
                                        expertly installed, creating privacy,
                                        security and beauty for homes and
                                        businesses across Los Angeles."
                                    </T>
                                </p>
                            </div>
                        </div>
                        <p className="text-[var(--color-gray-500)] max-w-3xl mx-auto mt-8">
                            <T>
                                Vinyl Fence General is one of the finest vinyl
                                fence installation companies in Los Angeles.
                                Since 2010, we have been providing our customers
                                with an outstanding selection of vinyl fence
                                products. Our team will not only supply you with
                                quality products, but they are also reliable,
                                professional, and most importantly affordable!
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-8 rounded-xl bg-[var(--color-card-bg)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[var(--color-border)]"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)]/10 mb-4">
                                    <stat.icon className="w-8 h-8 text-[var(--color-primary)]" />
                                </div>
                                <div className="font-serif text-4xl md:text-5xl font-semibold text-[var(--color-primary)] mb-2">
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

            {/* ============ SERVICES ============ */}
            <section className="py-16 border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-4">
                            <T>Our Vinyl Fencing Services</T>
                        </h2>
                        <p className="text-[var(--color-gray-500)] max-w-3xl mx-auto">
                            <T>
                                Vinyl Fence General offers various vinyl fencing
                                services for residential and business purposes.
                                Check out these well-protected fences and gates
                                to find out why Fence General is among the best
                                vinyl fence installation companies in town.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group relative p-8 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-[var(--color-primary)] bg-[var(--color-gray-100)] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-xl font-semibold text-[var(--color-primary)] mb-3">
                                    <T>{service.title}</T>
                                </h3>
                                <p className="text-[var(--color-gray-500)] leading-relaxed text-sm">
                                    <T>{service.description}</T>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ VINYL ADVANTAGES ============ */}
            <section className="py-16 border-t border-[var(--color-border)] bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
                            <T>Vinyl Fence Advantages</T>
                        </h2>
                        <p className="text-white/80 max-w-3xl mx-auto">
                            <T>
                                There are many advantages and features that a
                                vinyl fence has. Because of this, these are
                                becoming more popular with people wanting to
                                fence in their yards, backyards and also along
                                their driveways.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {vinylAdvantages.map((advantage, index) => (
                            <div
                                key={index}
                                className="text-center p-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                            >
                                <advantage.icon className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6" />
                                <h3 className="font-serif text-xl font-semibold text-white mb-4">
                                    <T>{advantage.title}</T>
                                </h3>
                                <p className="text-white/80 leading-relaxed text-sm">
                                    <T>{advantage.description}</T>
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-white/70 text-sm max-w-2xl mx-auto">
                            <T>
                                No painting required — the color of your vinyl
                                fence stays the same for years to come. Vinyl
                                fences can last for over 30 years with proper
                                care, and they are resistant to rust and
                                corrosion, which is why they are preferred by
                                many homeowners in coastal areas.
                            </T>
                        </p>
                    </div>
                </div>
            </section>

            {/* ============ WORKING PROCESS ============ */}
            <section className="py-16 border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-4">
                            <T>Working Process</T>
                        </h2>
                        <p className="text-[var(--color-gray-500)] max-w-3xl mx-auto">
                            <T>
                                Are you looking to get vinyl fence installation
                                services? If yes, then calling us right away
                                would be the best choice. We are here to assist
                                you through the entire process.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {workingProcess.map((process, index) => (
                            <div
                                key={index}
                                className="relative text-center p-10 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <span className="absolute top-4 right-6 font-serif text-5xl font-semibold text-[var(--color-primary)]/10">
                                    {index + 1}
                                </span>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)]/10 mb-6">
                                    <process.icon className="w-8 h-8 text-[var(--color-primary)]" />
                                </div>
                                <span className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-2">
                                    <T>{process.step}</T>
                                </span>
                                <h3 className="font-serif text-xl font-semibold text-[var(--color-primary)] mb-4">
                                    <T>{process.title}</T>
                                </h3>
                                <p className="text-[var(--color-gray-500)] leading-relaxed text-sm">
                                    <T>{process.description}</T>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ PROJECTS CAROUSEL ============ */}
            <section
                id="projects"
                className="py-16 border-t border-[var(--color-border)]"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-4">
                            <T>Transformations That Speak</T>
                        </h2>
                        <p className="text-[var(--color-gray-500)] max-w-3xl mx-auto">
                            <T>
                                Witness the remarkable before-and-after journeys
                                of spaces transformed by our premium vinyl
                                fencing solutions.
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

            {/* ============ JOURNEY TIMELINE ============ */}
            <section className="py-16 border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-4">
                            <T>Our Journey</T>
                        </h2>
                        <p className="text-[var(--color-gray-500)] max-w-3xl mx-auto">
                            <T>
                                Over 15 years of dedication to quality vinyl
                                fencing across Los Angeles and surrounding
                                counties.
                            </T>
                        </p>
                    </div>

                    <div className="relative">
                        {/* Desktop center line */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[var(--color-accent)]" />
                        {/* Mobile left line */}
                        <div className="md:hidden absolute left-4 top-0 h-full w-1 bg-[var(--color-accent)]" />

                        <div className="space-y-10 md:space-y-20">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className={`relative flex items-center md:${
                                        index % 2 === 0
                                            ? "flex-row"
                                            : "flex-row-reverse"
                                    } flex-row`}
                                >
                                    {/* Mobile layout */}
                                    <div className="md:hidden pl-12 w-full">
                                        <div className="p-5 rounded-xl bg-[var(--color-card-bg)] shadow border border-[var(--color-border)]">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="font-serif text-3xl font-semibold text-[var(--color-primary)]">
                                                    {milestone.year}
                                                </div>
                                                <milestone.icon className="w-6 h-6 text-[var(--color-accent)]" />
                                            </div>
                                            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-2">
                                                <T>{milestone.title}</T>
                                            </h3>
                                            <p className="text-sm text-[var(--color-text)]/80">
                                                <T>{milestone.description}</T>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Desktop layout */}
                                    <div
                                        className={`hidden md:block w-1/2 ${
                                            index % 2 === 0
                                                ? "pr-12 text-right"
                                                : "pl-12"
                                        }`}
                                    >
                                        <div className="inline-block p-8 rounded-xl bg-[var(--color-card-bg)] shadow border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                {index % 2 === 0 ? (
                                                    <>
                                                        <div className="font-serif text-4xl font-semibold text-[var(--color-primary)]">
                                                            {milestone.year}
                                                        </div>
                                                        <milestone.icon className="w-8 h-8 text-[var(--color-accent)]" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <milestone.icon className="w-8 h-8 text-[var(--color-accent)]" />
                                                        <div className="font-serif text-4xl font-semibold text-[var(--color-primary)]">
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

                                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[var(--color-accent)] border-4 border-[var(--color-background)] shadow-xl z-10" />
                                    <div className="md:hidden absolute left-4 transform -translate-x-1/2 w-5 h-5 rounded-full bg-[var(--color-accent)] border-4 border-[var(--color-background)] shadow-xl z-10" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CORE VALUES ============ */}
            <section className="py-16 border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-4">
                            <T>Our Core Values</T>
                        </h2>
                        <p className="text-[var(--color-gray-500)] max-w-3xl mx-auto">
                            <T>
                                The principles that guide every decision and
                                every fence we install.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group relative p-8 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div
                                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${value.color} bg-[var(--color-gray-100)] mb-6 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <value.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-xl font-semibold text-[var(--color-primary)] mb-3">
                                    <T>{value.title}</T>
                                </h3>
                                <p className="text-[var(--color-gray-500)] leading-relaxed text-sm">
                                    <T>{value.description}</T>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ TESTIMONIALS ============ */}
            <section className="py-16 border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-4">
                            <T>Our Reviews</T>
                        </h2>
                        <p className="text-[var(--color-gray-500)] max-w-3xl mx-auto mb-4">
                            <T>
                                Rated 4.9/5 from over 100+ reviews on Google and
                                Yelp.
                            </T>
                        </p>
                        <div className="flex items-center justify-center gap-1 mb-8">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className="w-6 h-6 text-[var(--color-accent)]"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="relative p-8 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <FaQuoteLeft className="w-8 h-8 text-[var(--color-accent)]/30 mb-4" />
                                <p className="text-[var(--color-text)]/80 leading-relaxed text-sm mb-6">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className="w-4 h-4 text-[var(--color-accent)]"
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-[var(--color-primary)] text-sm">
                                        {testimonial.author}
                                    </span>
                                    <span className="text-xs text-[var(--color-gray-500)]">
                                        {testimonial.source}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ WHY WE STAND OUT ============ */}
            <section className="py-16 border-t border-[var(--color-border)] bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
                            <T>Why We Stand Out</T>
                        </h2>
                        <p className="text-white/80 max-w-3xl mx-auto">
                            <T>
                                Numbers and facts that reflect our commitment to
                                excellence and customer satisfaction.
                            </T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <FaShieldAlt className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6" />
                            <h3 className="font-serif text-xl font-semibold text-white mb-4">
                                <T>American-Made Materials</T>
                            </h3>
                            <p className="text-white/80 leading-relaxed text-sm">
                                <T>
                                    We install durable, American-made vinyl
                                    fencing from trusted manufacturers like
                                    DuraMax.
                                </T>
                            </p>
                        </div>

                        <div className="text-center p-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <FaTools className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6" />
                            <h3 className="font-serif text-xl font-semibold text-white mb-4">
                                <T>Expert Installation</T>
                            </h3>
                            <p className="text-white/80 leading-relaxed text-sm">
                                <T>
                                    Our highly-trained technicians ensure quick,
                                    efficient and professional installation
                                    every time.
                                </T>
                            </p>
                        </div>

                        <div className="text-center p-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <FaHandshake className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6" />
                            <h3 className="font-serif text-xl font-semibold text-white mb-4">
                                <T>Free Estimates</T>
                            </h3>
                            <p className="text-white/80 leading-relaxed text-sm">
                                <T>
                                    We visit your property, take measurements
                                    and provide a free quote — no obligations.
                                </T>
                            </p>
                        </div>
                    </div>

                    {/* Service Areas */}
                    <div className="mt-16 text-center">
                        <h3 className="font-serif text-2xl font-semibold text-white mb-6">
                            <T>Areas We Serve</T>
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {serviceAreas.map((area, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
                                >
                                    <FaMapMarkerAlt className="w-4 h-4 text-[var(--color-accent)]" />
                                    <T>{area}</T>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="py-16 border-t border-[var(--color-border)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-[var(--color-primary)] rounded-2xl p-8 sm:p-12 shadow-xl">
                        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
                            <T>Ready to Transform Your Space?</T>
                        </h2>
                        <p className="text-white/90 mb-8 leading-relaxed">
                            <T>
                                Get your free on-site estimate today. Serving
                                the San Fernando Valley, Los Angeles Metro,
                                Orange County and Ventura County.
                            </T>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link
                                href="/client/dashboard/service"
                                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--color-primary)] hover:bg-white/90 font-semibold py-3 px-8 rounded-full transition-colors"
                            >
                                <T>Get Free Quote</T>
                                <FaChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/client/dashboard/products"
                                className="inline-flex items-center justify-center gap-2 border border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition-colors"
                            >
                                <T>Browse Catalog</T>
                                <FaChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/80 text-sm">
                            <a
                                href="tel:+18883362330"
                                className="inline-flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <FaPhoneAlt className="w-4 h-4" />
                                (888) 336-2330
                            </a>
                            <a
                                href="mailto:info@fencegeneral.com"
                                className="inline-flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <FaEnvelope className="w-4 h-4" />
                                info@fencegeneral.com
                            </a>
                            <span className="inline-flex items-center gap-2">
                                <FaMapMarkerAlt className="w-4 h-4" />
                                8058 Troost Ave, North Hollywood, CA 91605
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
