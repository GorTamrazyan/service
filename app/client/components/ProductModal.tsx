// app/client/components/ProductModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    X,
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
    Check,
} from "lucide-react";
import { T } from "./T";
import type { Material, Color } from "../../lib/firebase/products/types";
import { useCart } from "../context/CartContext";

interface Product {
    id: string;
    name: string;
    description: string | null;
    colorPrices?: Record<string, number>;
    imageUrl: string | null;
    categorId: string | null;
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

export default function ProductModal({
    product,
    isOpen,
    onClose,
}: ProductModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [height, setHeight] = useState<number>(1);
    const [length, setLength] = useState<number>(1);
    const { addToCart } = useCart();
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [addedProductName, setAddedProductName] = useState<string>("");

    const getBasePrice = (): number => {
        const cp = product.colorPrices || {};
        if (selectedColor?.id && cp[selectedColor.id] !== undefined) {
            return cp[selectedColor.id];
        }
        const prices = Object.values(cp).filter((v) => !isNaN(v));
        return prices.length > 0 ? prices[0] : 0;
    };

    const basePrice = getBasePrice();
    const totalPrice = height * length * basePrice;

    useEffect(() => {
        if (isOpen) {
            setHeight(1);
            setLength(1);
        } else {
            setShowNotification(false);
        }
    }, [isOpen]);

    const material = product.material;
    const colors = product.colors || [];

    const handleAddToCart = () => {
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            alert(
                `Please select a color for ${product.name} before adding it to the cart.`
            );
            return;
        }

        const cartProduct = {
            id: product.id,
            name: product.name,
            price: String(totalPrice),
            imageUrl: product.imageUrl,
            color: selectedColor,
            height: height,
            length: length,
        };

        addToCart(cartProduct);
        setAddedProductName(product.name);
        setShowNotification(true);

        setTimeout(() => {
            onClose();
        }, 500);

        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    const allImages =
        product.images && product.images.length > 0
            ? product.images
            : product.imageUrl
            ? [product.imageUrl]
            : [];

    const nextImage = () => {
        if (allImages.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        }
    };

    const prevImage = () => {
        if (allImages.length > 0) {
            setCurrentImageIndex(
                (prev) => (prev - 1 + allImages.length) % allImages.length
            );
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setHeight(Math.max(1, value));
    };

    const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setLength(Math.max(1, value));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Notification */}
            {showNotification && (
                <div className="fixed top-6 right-6 z-[60] animate-slideIn">
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md border border-white/20 backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-lg">
                                <T>Added to Cart!</T>
                            </p>
                            <p className="text-sm text-white/90">
                                "{addedProductName}"{" "}
                                <T>has been added to your cart</T>
                            </p>
                        </div>
                        <button
                            onClick={() => setShowNotification(false)}
                            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-[var(--color-card-bg)] rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--color-border)]">
                    {/* Header */}
                    <div className="sticky top-0 bg-[var(--color-card-bg)] border-b border-[var(--color-border)] px-8 py-5 flex items-center justify-between z-10 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-8 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
                            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                                <T>Product Details</T>
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[var(--color-gray-100)] rounded-full transition-all duration-200"
                        >
                            <X className="w-6 h-6 text-[var(--color-text)]" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Images */}
                            <div className="space-y-6">
                                {/* Main Image */}
                                <div className="relative w-full h-96 bg-gradient-to-br from-[var(--color-gray-100)] to-[var(--color-gray-200)] rounded-xl overflow-hidden group">
                                    {allImages.length > 0 ? (
                                        <>
                                            <Image
                                                src={
                                                    allImages[currentImageIndex]
                                                }
                                                alt={`${product.name} - Image ${
                                                    currentImageIndex + 1
                                                }`}
                                                width={600}
                                                height={600}
                                                className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {allImages.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={prevImage}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                                                    >
                                                        <ChevronLeft className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={nextImage}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                                                    >
                                                        <ChevronRight className="w-6 h-6" />
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-48 h-48 bg-[var(--color-gray-300)] rounded-2xl"></div>
                                        </div>
                                    )}

                                    {/* Image Counter */}
                                    {allImages.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                                            {currentImageIndex + 1} /{" "}
                                            {allImages.length}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {allImages.length > 1 && (
                                    <div className="grid grid-cols-4 gap-3">
                                        {allImages.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setCurrentImageIndex(index)
                                                }
                                                className={`relative w-full h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                    currentImageIndex === index
                                                        ? "border-[var(--color-accent)] shadow-md"
                                                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                                                }`}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`Thumbnail ${
                                                        index + 1
                                                    }`}
                                                    width={100}
                                                    height={100}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Details */}
                            <div className="space-y-6">
                                {/* Title and Price */}
                                <div className="pb-6 border-b border-[var(--color-border)]">
                                    <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-3">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-baseline gap-4">
                                        <div className="text-4xl font-bold text-[var(--color-primary)]">
                                            ${basePrice.toFixed(2)}
                                        </div>
                                        <span className="text-sm text-[var(--color-text)]/60">
                                            <T>per meter</T>
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div className="bg-[var(--color-gray-50)] p-5 rounded-xl">
                                        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">
                                            <T>Description</T>
                                        </h3>
                                        <p className="text-[var(--color-text)]/80 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                )}

                                {/* Dimensions */}
                                <div className="space-y-5">
                                    <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                                        <T>Fence Dimensions</T>
                                    </h3>

                                    {/* Height Input */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-[var(--color-text)]">
                                            <T>Height</T>{" "}
                                            <span className="text-sm text-[var(--color-text)]/60">
                                                (meters)
                                            </span>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={height}
                                                onChange={handleHeightChange}
                                                className="w-24 px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-[var(--color-card-bg)]"
                                            />
                                            <span className="text-lg font-medium text-[var(--color-text)]/60">
                                                m
                                            </span>
                                            <div className="flex-1">
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    value={height}
                                                    onChange={
                                                        handleHeightChange
                                                    }
                                                    className="w-full h-2 bg-[var(--color-border)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Length Input */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-[var(--color-text)]">
                                            <T>Length</T>{" "}
                                            <span className="text-sm text-[var(--color-text)]/60">
                                                (meters)
                                            </span>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={length}
                                                onChange={handleLengthChange}
                                                className="w-24 px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] bg-[var(--color-card-bg)]"
                                            />
                                            <span className="text-lg font-medium text-[var(--color-text)]/60">
                                                m
                                            </span>
                                            <div className="flex-1">
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="100"
                                                    value={length}
                                                    onChange={
                                                        handleLengthChange
                                                    }
                                                    className="w-full h-2 bg-[var(--color-border)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Price */}
                                    <div className="p-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 rounded-xl border border-[var(--color-accent)]/30">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-[var(--color-text)]">
                                                <T>Total price:</T>
                                            </span>
                                            <span className="text-2xl font-bold text-[var(--color-accent)]">
                                                $ {totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--color-text)]/60 mt-1">
                                            {`${height}m × ${length}m × $${basePrice.toFixed(2)}/m`}
                                        </p>
                                    </div>
                                </div>

                                {/* Material */}
                                {material && (
                                    <div className="p-4 border border-[var(--color-border)] rounded-xl">
                                        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
                                            <T>Material</T>
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                                                <svg
                                                    className="w-4 h-4 text-[var(--color-primary)]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--color-text)]">
                                                    {material.name}
                                                </p>
                                                {material.description && (
                                                    <p className="text-sm text-[var(--color-text)]/60">
                                                        {material.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Colors */}
                                {colors.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">
                                            <T>Available Colors</T>
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {colors.map((color) => (
                                                <button
                                                    key={color.id}
                                                    onClick={() =>
                                                        setSelectedColor(color)
                                                    }
                                                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                                                        selectedColor?.id ===
                                                        color.id
                                                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                                            : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                                                    }`}
                                                >
                                                    <div
                                                        className="w-8 h-8 rounded-full border border-gray-300"
                                                        style={{
                                                            backgroundColor:
                                                                color.hexCode,
                                                        }}
                                                    ></div>
                                                    <div className="text-left flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-[var(--color-primary)] truncate">
                                                            {color.name}
                                                        </p>
                                                        <p className="text-xs text-[var(--color-text)]/60 truncate">
                                                            {color.hexCode}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
                                            <T>Features</T>
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-lg"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={
                                        colors.length > 0 && !selectedColor
                                    }
                                    className={`w-full py-4 px-6 rounded-xl text-white font-bold transition-all duration-200 flex items-center justify-center gap-3 ${
                                        colors.length > 0 && !selectedColor
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                                    }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <T>Add to Cart</T>
                                    <span className="ml-auto bg-white/20 px-3 py-1 rounded text-sm font-bold">
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS animations */}
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
