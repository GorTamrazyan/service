"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    ShieldCheck,
    Award,
    Clock,
    Ruler,
    Hammer,
    Wrench,
    Sparkles,
    HeadphonesIcon,
    Truck,
    Check,
    CalendarCheck,
    Flag,
    FileText,
    MapPin,
    Phone,
} from "lucide-react";
import ProductModal from "../../components/ProductModal";
import { T } from "../../components/T";
import CallbackForm from "../../components/CallbackForm";

interface Color {
    id: string;
    name: string;
    hexCode: string;
}

interface Material {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    images?: string[];
    tags?: string[];
    inStock: boolean;
    colorPrices?: Record<string, number>;
    colors?: Color[];
    material?: Material;
    dimensions?: { height?: number; width?: number; length?: number; unit?: string };
    discount?: number | null;
    featured?: boolean;
    categorId?: string | null | undefined;
    typeOfProductId?: string;
    materialId?: string;
    colorIds?: string[];
}

const services = [
    {
        icon: Ruler,
        title: "Free On-Site Consultation",
        description: "Our specialist visits your property, takes exact measurements, and helps you choose the perfect style.",
    },
    {
        icon: Sparkles,
        title: "Custom Design",
        description: "Unique heights, colors, lattice tops, and decorative post caps — tailored to your home.",
    },
    {
        icon: Hammer,
        title: "Professional Installation",
        description: "Certified crews with steel-reinforced posts and concrete footings. Clean work, zero headaches.",
    },
    {
        icon: Wrench,
        title: "Repair & Replacement",
        description: "Storm damage? Aging panels? We repair any vinyl fence — even if we didn't install it.",
    },
    {
        icon: Truck,
        title: "Material Delivery",
        description: "DIY customer? We deliver premium vinyl panels and posts straight to your driveway.",
    },
    {
        icon: HeadphonesIcon,
        title: "Ongoing Support",
        description: "One call, real people. We stand behind every project with our 15-year warranty.",
    },
];

const gallery = [
    { title: "Modern Privacy Fence — Glendale", category: "Privacy Fence", image: "/images/product-privacy-fence.jpg", large: true },
    { title: "White Picket Estate — Pasadena",  category: "Picket Fence",  image: "/images/product-picket-fence.jpg",  large: false },
    { title: "Ranch Rail — Santa Clarita",      category: "Ranch Rail",    image: "/images/product-ranch-fence.jpg",   large: false },
    { title: "Automated Gate — Burbank",        category: "Driveway Gate", image: "/images/product-vinyl-gate.jpg",    large: false },
];

const highlights = [
    "Family-owned and operated since 2010",
    "Licensed, bonded, and fully insured",
    "100% premium vinyl materials, made in the USA",
    "15-year warranty",
    "Free on-site estimate with a price on the spot",
];

const reasons = [
    {
        icon: CalendarCheck,
        title: "In Business Since 2010",
        description: "Over 15 years of installing vinyl fences for homes and businesses across Southern California.",
    },
    {
        icon: Flag,
        title: "Made in USA Materials",
        description: "We install vinyl fencing produced in the USA by trusted American manufacturers.",
    },
    {
        icon: Ruler,
        title: "Free On-Site Estimate",
        description: "We come to your property, take measurements, and give you a price on the spot — free and with no obligation.",
    },
    {
        icon: ShieldCheck,
        title: "15-Year Warranty",
        description: "Every fence we install is backed by our 15-year warranty.",
    },
];

const steps = [
    {
        icon: Ruler,
        title: "Free Estimate",
        description: "We visit your property, measure the fence line, help you choose a style and color, and give you a price on the spot.",
    },
    {
        icon: FileText,
        title: "Contract",
        description: "You receive a written contract with the scope of work, materials, price, and installation date.",
    },
    {
        icon: Hammer,
        title: "Installation",
        description: "Our crew installs your fence, cleans up the site, and walks through the finished work with you.",
    },
];

const serviceAreas = [
    "San Fernando Valley",
    "Los Angeles",
    "Orange County",
    "Ventura County",
];

function ProductHomeCard({ product: p }: { product: Product }) {
    const [modalOpen, setModalOpen] = useState(false);

    const img = p.imageUrl ?? p.images?.[0] ?? null;
    const tag = p.featured ? "Featured" : (p.tags?.[0] ?? null);

    const prices = Object.values(p.colorPrices ?? {}).filter((v) => !isNaN(Number(v)));
    const minPrice = prices.length ? Math.min(...prices) : null;
    const maxPrice = prices.length ? Math.max(...prices) : null;
    const priceLabel = prices.length === 0
        ? null
        : minPrice === maxPrice
        ? `$${minPrice!.toFixed(0)}`
        : `$${minPrice!.toFixed(0)} – $${maxPrice!.toFixed(0)}`;

    const dims = p.dimensions;
    const dimsLabel = dims
        ? [dims.height && `${dims.height}`, dims.length && `${dims.length}`]
              .filter(Boolean)
              .join(" × ") + ` ${dims.unit ?? "ft"}`
        : null;

    return (
        <>
            <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-gray-100)]">
                    {img ? (
                        <Image
                            src={img}
                            alt={p.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="h-full w-full bg-[var(--color-background)]" />
                    )}
                    {tag && (
                        <span className="absolute left-3 top-3 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                            <T>{tag}</T>
                        </span>
                    )}
                    {p.discount && (
                        <span className="absolute right-3 top-3 rounded-full bg-[var(--color-error)] px-2.5 py-1 text-xs font-bold text-white">
                            -{p.discount}%
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col p-5 gap-3">
                    {p.material && (
                        <span className="w-fit rounded-md bg-[var(--color-gray-100)] px-2 py-0.5 text-xs font-medium text-[var(--color-gray-500)]">
                            <T>{p.material.name}</T>
                        </span>
                    )}

                    <h3 className="font-serif text-lg font-semibold leading-snug text-[var(--color-text)] line-clamp-2">
                        <T>{p.name}</T>
                    </h3>

                    {p.description && (
                        <p className="text-xs leading-relaxed text-[var(--color-gray-500)] line-clamp-2">
                            <T>{p.description}</T>
                        </p>
                    )}

                    {dimsLabel && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-500)]">
                            <Ruler className="h-3.5 w-3.5 shrink-0" />
                            {dimsLabel}
                        </div>
                    )}

                    {p.colors && p.colors.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                            {p.colors.slice(0, 6).map((c) => (
                                <span
                                    key={c.id}
                                    title={c.name}
                                    className="h-5 w-5 rounded-full border border-[var(--color-border)] shadow-sm"
                                    style={{ backgroundColor: c.hexCode }}
                                />
                            ))}
                            {p.colors.length > 6 && (
                                <span className="text-xs text-[var(--color-gray-500)]">+{p.colors.length - 6}</span>
                            )}
                        </div>
                    )}

                    {p.tags && p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {p.tags.slice(0, 3).map((t) => (
                                <span key={t} className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-gray-500)]">
                                    <T>{t}</T>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-auto border-t border-[var(--color-border)] pt-4 flex items-center justify-between gap-2">
                        {priceLabel ? (
                            <span className="font-serif text-xl font-semibold text-[var(--color-accent)]">
                                {priceLabel}
                            </span>
                        ) : (
                            <span className="text-sm text-[var(--color-gray-500)]"><T>Price on request</T></span>
                        )}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                        >
                            <T>Details</T> <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </article>

            <ProductModal product={p} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/products?featured=true")
            .then((r) => r.json())
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]))
            .finally(() => setProductsLoading(false));
    }, []);

    return (
        <div className="-mx-4 sm:-mx-10 -mt-20 sm:-mt-24 -mb-10 overflow-x-hidden">

            {/* ── HERO ── */}
            <section id="home" className="relative overflow-hidden print:overflow-visible">
                <div className="absolute inset-0">
                    {/* Screen: next/image with fill */}
                    <Image
                        src="/images/hero-vinyl-fence.jpg"
                        alt="Premium vinyl fence"
                        fill
                        priority
                        className="object-cover print:hidden"
                        sizes="100vw"
                    />
                    {/* Print fallback: regular img (Safari PDF doesn't render next/image fill) */}
                    <img
                        src="/images/hero-vinyl-fence.jpg"
                        alt=""
                        aria-hidden="true"
                        className="hidden print:block absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/80 via-[#111827]/55 to-[#111827]/20" />
                </div>

                <div className="relative mx-auto flex min-h-[88vh] print:min-h-[500px] max-w-7xl flex-col justify-center px-4 py-20 md:px-8 md:py-28">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm">
                            <T>Established 2010 · Family Owned</T>
                        </span>

                        <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] text-white md:text-7xl lg:text-8xl">
                            <T>Vinyl Fences</T>{" "}
                            <span className="italic text-[var(--color-accent)]"><T>Built to Last</T></span>
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
                            <T>Premium vinyl fences and gates crafted for beauty, privacy, and security. Low maintenance, a 15-year warranty, and professional installation across Southern California.</T>
                        </p>

                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/client/dashboard/service"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-8 text-base font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent)]/90"
                            >
                                <T>Get a Free Quote</T> <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/client/dashboard/products"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-transparent px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
                            >
                                <T>Browse Products</T>
                            </Link>
                        </div>

                        <dl className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-8 w-8 shrink-0 text-[var(--color-accent)]" strokeWidth={1.5} />
                                <div>
                                    <dt className="text-sm font-medium text-white/70"><T>Warranty</T></dt>
                                    <dd className="font-serif text-lg font-semibold text-white"><T>15 Years</T></dd>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="h-8 w-8 shrink-0 text-[var(--color-accent)]" strokeWidth={1.5} />
                                <div>
                                    <dt className="text-sm font-medium text-white/70"><T>Materials</T></dt>
                                    <dd className="font-serif text-lg font-semibold text-white"><T>Made in USA</T></dd>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-8 w-8 shrink-0 text-[var(--color-accent)]" strokeWidth={1.5} />
                                <div>
                                    <dt className="text-sm font-medium text-white/70"><T>Experience</T></dt>
                                    <dd className="font-serif text-lg font-semibold text-white"><T>15+ Years</T></dd>
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* ── WHY US ── */}
            <section id="why-us" className="bg-[var(--color-gray-100)] py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                            <T>Why Us</T>
                        </span>
                        <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--color-text)] md:text-5xl">
                            <T>Why Homeowners Choose Us</T>
                        </h2>
                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {reasons.map((r) => {
                            const Icon = r.icon;
                            return (
                                <div
                                    key={r.title}
                                    className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-7"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                                        <Icon className="h-6 w-6" strokeWidth={1.75} />
                                    </div>
                                    <h3 className="font-serif text-xl font-semibold text-[var(--color-text)]">
                                        <T>{r.title}</T>
                                    </h3>
                                    <p className="text-sm leading-relaxed text-[var(--color-gray-500)]">
                                        <T>{r.description}</T>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── PRODUCTS ── */}
            <section id="products" className="bg-[var(--color-background)] py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                        <div className="max-w-2xl">
                            <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                                <T>Our Products</T>
                            </span>
                            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--color-primary)] md:text-5xl">
                                <T>Fences &amp; Gates for Every Property</T>
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-[var(--color-gray-500)] md:text-lg">
                                <T>All our vinyl products are engineered with UV inhibitors, impact modifiers, and steel-reinforced posts — so they look new for decades.</T>
                            </p>
                        </div>
                        <Link
                            href="/client/dashboard/products"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-all hover:gap-2.5"
                        >
                            <T>View full catalog</T> <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {productsLoading && (
                        <div className="mt-12 flex justify-center py-16">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
                        </div>
                    )}

                    {!productsLoading && products.length === 0 && (
                        <div className="mt-12 py-16 text-center text-sm text-[var(--color-gray-500)]">
                            <T>No featured products available.</T>
                        </div>
                    )}

                    {!productsLoading && products.length > 0 && (
                        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map((p) => (
                                <ProductHomeCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── SERVICES ── */}
            <section id="services" className="bg-[var(--color-gray-100)] py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                            <T>What We Do</T>
                        </span>
                        <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--color-text)] md:text-5xl">
                            <T>Full-Service, End to End</T>
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-[var(--color-gray-500)] md:text-lg">
                            <T>From the first measurement to the final cap, we handle every detail so you get a fence that&apos;s perfect on day one — and for years to come.</T>
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((s) => {
                            const Icon = s.icon;
                            return (
                                <div
                                    key={s.title}
                                    className="group flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-7 transition-all hover:border-[var(--color-primary)]/40 hover:shadow-lg"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                                        <Icon className="h-6 w-6" strokeWidth={1.75} />
                                    </div>
                                    <h3 className="font-serif text-xl font-semibold text-[var(--color-text)]">
                                        <T>{s.title}</T>
                                    </h3>
                                    <p className="text-sm leading-relaxed text-[var(--color-gray-500)]">
                                        <T>{s.description}</T>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── HOW WE WORK ── */}
            <section id="how-we-work" className="border-b border-[var(--color-border)] bg-[var(--color-background)] py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                            <T>How We Work</T>
                        </span>
                        <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--color-primary)] md:text-5xl">
                            <T>Three Simple Steps</T>
                        </h2>
                    </div>

                    <ol className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <li
                                    key={step.title}
                                    className="relative flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-7"
                                >
                                    <span className="font-serif text-5xl font-semibold text-[var(--color-accent)]/40">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-6 w-6 text-[var(--color-primary)]" strokeWidth={1.75} />
                                        <h3 className="font-serif text-xl font-semibold text-[var(--color-text)]">
                                            <T>{step.title}</T>
                                        </h3>
                                    </div>
                                    <p className="text-sm leading-relaxed text-[var(--color-gray-500)]">
                                        <T>{step.description}</T>
                                    </p>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </section>

            {/* ── GALLERY ── */}
            <section id="gallery" className="bg-[var(--color-background)] py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
                                <T>Our Work</T>
                            </div>
                            <h2 className="font-serif text-4xl font-bold leading-tight text-[var(--color-text)] md:text-6xl">
                                <T>Projects we&apos;re</T>{" "}
                                <span className="text-[var(--color-primary)]"><T>proud of.</T></span>
                            </h2>
                        </div>
                        <p className="max-w-md text-lg leading-relaxed text-[var(--color-gray-500)]">
                            <T>Every installation is custom-fitted to the property. Here&apos;s a sample of our recent work.</T>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {gallery.map((item, i) => (
                            <article
                                key={item.title}
                                className={`group relative overflow-hidden rounded-2xl bg-[var(--color-card-bg)] ${
                                    i === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                                }`}
                            >
                                <div
                                    className={`relative overflow-hidden ${
                                        i === 0
                                            ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[480px]"
                                            : "aspect-[4/3]"
                                    }`}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <span className="mb-2 inline-block rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                                            <T>{item.category}</T>
                                        </span>
                                        <h3 className="font-serif text-lg font-semibold text-white md:text-xl">
                                            <T>{item.title}</T>
                                        </h3>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ABOUT ── */}
            <section id="about" className="bg-[var(--color-gray-100)] py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                        <div className="relative order-last lg:order-first">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                                <Image
                                    src="/images/about-installation.jpg"
                                    alt="ONIK'S VINYL installation team"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 hidden w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 shadow-xl md:block">
                                <div className="font-serif text-4xl font-semibold text-[var(--color-primary)]">2010</div>
                                <div className="mt-1 text-sm font-medium text-[var(--color-text)]">
                                    <T>Building fences since</T>
                                </div>
                                <div className="mt-1 text-xs text-[var(--color-gray-500)]">
                                    <T>Family owned and operated</T>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                                <T>About ONIK&apos;S VINYL</T>
                            </span>
                            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--color-text)] md:text-5xl">
                                <T>A Family Business Built on Handshakes and Hard Work</T>
                            </h2>
                            <p className="mt-5 text-base leading-relaxed text-[var(--color-gray-500)] md:text-lg">
                                <T>Onik started the company in 2010 with one truck and a promise: every fence we install will be the one we&apos;d put around our own home. That promise still drives every job.</T>
                            </p>

                            <ul className="mt-8 space-y-3">
                                {highlights.map((h) => (
                                    <li key={h} className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
                                            <Check className="h-3 w-3" strokeWidth={3} />
                                        </span>
                                        <span className="text-sm leading-relaxed text-[var(--color-text)]/90 md:text-base">
                                            <T>{h}</T>
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Link
                                    href="/client/dashboard/service"
                                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 text-base font-semibold text-white transition-colors hover:bg-[var(--color-primary)]/90"
                                >
                                    <T>Start Your Project</T> <ArrowRight className="h-4 w-4" />
                                </Link>
                                <a
                                    href="tel:+18883362330"
                                    className="inline-flex items-center gap-3 text-sm sm:ml-4"
                                >
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
                                        <Phone className="h-4 w-4" />
                                    </span>
                                    <span>
                                        <span className="block font-semibold text-[var(--color-text)]">(888) 336-2330</span>
                                        <span className="block text-xs text-[var(--color-gray-500)]"><T>Call for a free estimate</T></span>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SERVICE AREA ── */}
            <section id="service-area" className="bg-[var(--color-background)] py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
                        <div>
                            <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                                <T>Service Area</T>
                            </span>
                            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--color-primary)] md:text-5xl">
                                <T>Where We Work</T>
                            </h2>
                            <p className="mt-5 text-base leading-relaxed text-[var(--color-gray-500)] md:text-lg">
                                <T>We install vinyl fences throughout Southern California. Not sure if we cover your address? Give us a call and we will let you know.</T>
                            </p>
                            <a
                                href="tel:+18883362330"
                                className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 text-base font-semibold text-white transition-colors hover:bg-[var(--color-primary)]/90"
                            >
                                <Phone className="h-4 w-4" /> (888) 336-2330
                            </a>
                        </div>

                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {serviceAreas.map((area) => (
                                <li
                                    key={area}
                                    className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5"
                                >
                                    <MapPin className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />
                                    <span className="font-medium text-[var(--color-text)]">{area}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-12">
                        <CallbackForm />
                    </div>
                </div>
            </section>

        </div>
    );
}
