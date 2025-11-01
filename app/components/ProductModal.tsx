"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { T } from "./T";
import type { Material, Color } from "../lib/firebase/products/types";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    categorId: string | null;
    materialId?: string;
    material?: Material;
    colorIds?: string[];
    colors?: Color[];
    tags?: string[];
    images?: string[]; // Массив URL изображений
}

interface ProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

export default function ProductModal({
    product,
    isOpen,
    onClose,
    onAddToCart,
}: ProductModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | null>(
        product.colors && product.colors.length > 0 && product.colors[0].id
            ? product.colors[0].id
            : null
    );

    // Используем данные материала и цветов напрямую из продукта
    const material = product.material;
    const colors = product.colors || [];

    // Массив изображений (основное изображение + дополнительные)
    const allImages = product.images && product.images.length > 0
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

    const handleAddToCart = () => {
        onAddToCart(product);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
            <div className="bg-[var(--color-background)] rounded-3xl w-full max-w-5xl my-auto max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-[var(--color-background)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
                    <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                        <T>Product Details</T>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
                                {allImages.length > 0 ? (
                                    <>
                                        <Image
                                            src={allImages[currentImageIndex]}
                                            alt={`${product.name} - Image ${
                                                currentImageIndex + 1
                                            }`}
                                            width={600}
                                            height={600}
                                            className="w-full h-full object-contain p-4"
                                        />
                                        {allImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <ChevronLeft className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <ChevronRight className="w-6 h-6" />
                                                </button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                )}

                                {/* Image Counter */}
                                {allImages.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                        {currentImageIndex + 1} /{" "}
                                        {allImages.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentImageIndex(index)
                                            }
                                            className={`relative w-full h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                currentImageIndex === index
                                                    ? "border-[var(--color-accent)] shadow-lg scale-105"
                                                    : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                                            }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
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

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-[var(--color-primary)]">
                                <T>{product.name}</T>
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-bold text-yellow-600">
                                    ${parseFloat(product.price).toFixed(2)}
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
                                    <T>Description</T>
                                </h3>
                                <p className="text-[var(--color-text)]/70 leading-relaxed">
                                    <T>
                                        {product.description ||
                                            "No description available."}
                                    </T>
                                </p>
                            </div>

                            {/* Material */}
                            {(material || product.materialId) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
                                        <T>Material</T>
                                    </h3>
                                    <p className="text-[var(--color-text)] font-medium">
                                        <T>{material?.name || product.materialId || "Unknown"}</T>
                                    </p>
                                    {material?.description && (
                                        <p className="text-sm text-[var(--color-text)]/60 mt-1">
                                            <T>{material.description}</T>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Colors */}
                            {colors.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">
                                        <T>Available Colors</T>
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {colors.map((color) => (
                                            <button
                                                key={color.id}
                                                onClick={() =>
                                                    setSelectedColor(color.id || null)
                                                }
                                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                                    selectedColor === color.id
                                                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-md"
                                                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
                                                }`}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm flex-shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            color.hexCode,
                                                    }}
                                                ></div>
                                                <div className="text-left flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-[var(--color-primary)] truncate">
                                                        <T>{color.name}</T>
                                                    </p>
                                                    <p className="text-xs text-[var(--color-text)]/60">
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
                                    <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">
                                        <T>Features</T>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 text-sm font-semibold text-red-700 border-2 border-red-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <T>{tag}</T>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className="py-2 px-4 rounded-full text-[var(--color-success)] font-semibold text-sm border border-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center text-center"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                <T>"Add to Cart"</T>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
