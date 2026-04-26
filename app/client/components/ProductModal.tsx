"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ShoppingCart, Check } from "lucide-react";
import { T } from "./T";
import type { Material, Color } from "../../lib/firebase/products/types";
import { useCart } from "../context/CartContext";

interface Product {
    id: string;
    name: string;
    description: string | null;
    colorPrices?: Record<string, number>;
    imageUrl: string | null;
    categorId?: string | null;
    materialId?: string;
    material?: Material;
    colorIds?: string[];
    colors?: Color[];
    tags?: string[];
    images?: string[];
}

interface ProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [height, setHeight] = useState<number>(1);
    const [length, setLength] = useState<number>(1);
    const { addToCart } = useCart();
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [addedProductName, setAddedProductName] = useState<string>("");

    const getBasePrice = (): number => {
        const cp = product.colorPrices || {};
        if (selectedColor?.id && cp[selectedColor.id] !== undefined) return cp[selectedColor.id];
        const prices = Object.values(cp).filter((v) => !isNaN(v));
        return prices.length > 0 ? prices[0] : 0;
    };

    const basePrice = getBasePrice();
    const totalPrice = height * length * basePrice;

    useEffect(() => {
        if (isOpen) { setHeight(1); setLength(1); }
        else { setShowNotification(false); }
    }, [isOpen]);

    const colors = product.colors || [];

    const handleAddToCart = () => {
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            alert(`Please select a color for ${product.name} before adding it to the cart.`);
            return;
        }
        addToCart({ id: product.id, name: product.name, price: String(totalPrice), imageUrl: product.imageUrl, color: selectedColor, height, length });
        setAddedProductName(product.name);
        setShowNotification(true);
        setTimeout(() => onClose(), 500);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const allImages = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl ? [product.imageUrl] : [];

    const nextImage = () => allImages.length > 0 && setCurrentImageIndex((p) => (p + 1) % allImages.length);
    const prevImage = () => allImages.length > 0 && setCurrentImageIndex((p) => (p - 1 + allImages.length) % allImages.length);

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => setHeight(Math.max(1, parseInt(e.target.value) || 0));
    const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => setLength(Math.max(1, parseInt(e.target.value) || 0));

    if (!isOpen) return null;

    return (
        <>
            {/* Notification */}
            {showNotification && (
                <div className="fixed top-6 right-6 z-[60]">
                    <div className="bg-[var(--color-primary)] text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm"><T>Added to Cart!</T></p>
                            <p className="text-xs text-white/80 truncate">"{addedProductName}"</p>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-white/70 hover:text-white transition-colors shrink-0">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-[var(--color-card-bg)] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--color-border)]">

                    {/* Header */}
                    <div className="sticky top-0 bg-[var(--color-card-bg)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
                        <h2 className="font-serif text-xl font-semibold text-[var(--color-primary)]">
                            <T>Product Details</T>
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-full text-[var(--color-gray-500)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-text)] transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Left — images */}
                            <div className="space-y-3">
                                <div className="relative w-full aspect-square bg-[var(--color-gray-100)] rounded-xl overflow-hidden group">
                                    {allImages.length > 0 ? (
                                        <>
                                            <Image
                                                src={allImages[currentImageIndex]}
                                                alt={`${product.name} ${currentImageIndex + 1}`}
                                                width={600}
                                                height={600}
                                                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {allImages.length > 1 && (
                                                <>
                                                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:shadow-lg border border-[var(--color-border)] transition-all">
                                                        <ChevronLeft className="w-4 h-4 text-[var(--color-text)]" />
                                                    </button>
                                                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:shadow-lg border border-[var(--color-border)] transition-all">
                                                        <ChevronRight className="w-4 h-4 text-[var(--color-text)]" />
                                                    </button>
                                                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                                                        {currentImageIndex + 1} / {allImages.length}
                                                    </span>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-[var(--color-gray-200)]" />
                                    )}
                                </div>

                                {allImages.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {allImages.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentImageIndex(i)}
                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                    currentImageIndex === i
                                                        ? "border-[var(--color-accent)]"
                                                        : "border-[var(--color-border)] hover:border-[var(--color-primary)]/40"
                                                }`}
                                            >
                                                <Image src={img} alt={`Thumbnail ${i + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right — details */}
                            <div className="space-y-6">

                                {/* Name + price */}
                                <div className="pb-5 border-b border-[var(--color-border)]">
                                    <h1 className="font-serif text-2xl font-semibold text-[var(--color-primary)] mb-3">
                                        <T>{product.name}</T>
                                    </h1>
                                    <div className="flex items-baseline gap-3">
                                        <span className="font-serif text-3xl font-semibold text-[var(--color-accent)]">
                                            ${basePrice.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-[var(--color-gray-500)]"><T>per meter</T></span>
                                    </div>
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div className="rounded-xl border border-[var(--color-border)] p-4">
                                        <h3 className="font-serif text-base font-semibold text-[var(--color-primary)] mb-2">
                                            <T>Description</T>
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[var(--color-gray-500)]">
                                            <T>{product.description}</T>
                                        </p>
                                    </div>
                                )}

                                {/* Dimensions */}
                                <div className="space-y-4">
                                    <h3 className="font-serif text-base font-semibold text-[var(--color-primary)]">
                                        <T>Fence Dimensions</T>
                                    </h3>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--color-text)]">
                                            <T>Height</T> <span className="text-[var(--color-gray-500)] font-normal">(meters)</span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number" min="1" max="10" value={height}
                                                onChange={handleHeightChange}
                                                className="w-20 px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-card-bg)]"
                                            />
                                            <span className="text-sm text-[var(--color-gray-500)]">m</span>
                                            <input
                                                type="range" min="1" max="10" value={height}
                                                onChange={handleHeightChange}
                                                className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[var(--color-text)]">
                                            <T>Length</T> <span className="text-[var(--color-gray-500)] font-normal">(meters)</span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number" min="1" max="100" value={length}
                                                onChange={handleLengthChange}
                                                className="w-20 px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-card-bg)]"
                                            />
                                            <span className="text-sm text-[var(--color-gray-500)]">m</span>
                                            <input
                                                type="range" min="1" max="100" value={length}
                                                onChange={handleLengthChange}
                                                className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-gray-100)] p-4 flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium text-[var(--color-text)]"><T>Total price</T></span>
                                            <p className="text-xs text-[var(--color-gray-500)] mt-0.5">{height}m × {length}m × ${basePrice.toFixed(2)}/m</p>
                                        </div>
                                        <span className="font-serif text-2xl font-semibold text-[var(--color-accent)]">
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Material */}
                                {product.material && (
                                    <div className="rounded-xl border border-[var(--color-border)] p-4">
                                        <h3 className="font-serif text-base font-semibold text-[var(--color-primary)] mb-2">
                                            <T>Material</T>
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-text)]">
                                                    <T>{product.material.name}</T>
                                                </p>
                                                {product.material.description && (
                                                    <p className="text-xs text-[var(--color-gray-500)]">
                                                        <T>{product.material.description}</T>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Colors */}
                                {colors.length > 0 && (
                                    <div>
                                        <h3 className="font-serif text-base font-semibold text-[var(--color-primary)] mb-3">
                                            <T>Available Colors</T>
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {colors.map((color) => (
                                                <button
                                                    key={color.id}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                                                        selectedColor?.id === color.id
                                                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                                            : "border-[var(--color-border)] hover:border-[var(--color-primary)]/40"
                                                    }`}
                                                >
                                                    <div
                                                        className="w-7 h-7 rounded-full border border-[var(--color-border)] shrink-0"
                                                        style={{ backgroundColor: color.hexCode }}
                                                    />
                                                    <div className="text-left min-w-0">
                                                        <p className="text-xs font-medium text-[var(--color-text)] truncate">
                                                            <T>{color.name}</T>
                                                        </p>
                                                        <p className="text-[10px] text-[var(--color-gray-500)] truncate">{color.hexCode}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div>
                                        <h3 className="font-serif text-base font-semibold text-[var(--color-primary)] mb-2">
                                            <T>Features</T>
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, i) => (
                                                <span key={i} className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-gray-500)]">
                                                    <T>{tag}</T>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add to cart */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={colors.length > 0 && !selectedColor}
                                    className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                                        colors.length > 0 && !selectedColor
                                            ? "bg-[var(--color-gray-300)] text-[var(--color-gray-500)] cursor-not-allowed"
                                            : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                                    }`}
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <T>Add to Cart</T>
                                    <span className="ml-auto font-semibold">${totalPrice.toFixed(2)}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
