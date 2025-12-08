// app/client/components/ProductModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { T } from "./T";
import type { Material, Color } from "../../lib/firebase/products/types";
import { useCart } from "../context/CartContext";

// Интерфейс для продукта
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
    const [totalPrice, setTotalPrice] = useState(Number(product.price));

    useEffect(() => {
        if (isOpen) {
            setHeight(1);
            setLength(1);
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
       alert(`${product.name} added to cart!`);
   };

    const calculationTotalPrice = (
        length: number,
        quantity: number = 1
    ) => {
        const basePrice = length * Number(product.price);
        const totalPrice = basePrice * quantity;
        setTotalPrice(totalPrice);
        return totalPrice;
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
        calculationTotalPrice(value);
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
                                <span className="text-sm text-[var(--color-text)]/60">
                                    <T>per meter</T>
                                </span>
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

                            {/* Dimensions */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                                    <T>Fence Dimensions</T>
                                </h3>

                                {/* Height Input */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        <T>Height</T> (meters)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={height}
                                            onChange={handleHeightChange}
                                            className="w-24 px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                                        />
                                        <span className="text-sm text-[var(--color-text)]/60">
                                            m
                                        </span>
                                        <div className="flex-1">
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={height}
                                                onChange={handleHeightChange}
                                                className="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Length Input */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        <T>Length</T> (meters)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={length}
                                            onChange={handleLengthChange}
                                            className="w-24 px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                                        />
                                        <span className="text-sm text-[var(--color-text)]/60">
                                            m
                                        </span>
                                        <div className="flex-1">
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={length}
                                                onChange={handleLengthChange}
                                                className="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Total Calculation */}
                                <div className="p-4 bg-[var(--color-secondary)]/10 rounded-lg border border-[var(--color-border)]">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-[var(--color-text)]">
                                            <T>Total price:</T>
                                        </span>
                                        <span className="text-2xl font-bold text-yellow-600">
                                            $ {totalPrice}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--color-text)]/60 mt-1">
                                        <T>
                                            {`${length}m × $${parseFloat(
                                                product.price
                                            ).toFixed(2)}/m`}
                                        </T>
                                    </p>
                                </div>
                            </div>

                            {/* Material */}
                            {(material || product.materialId) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
                                        <T>Material</T>
                                    </h3>
                                    <p className="text-[var(--color-text)] font-medium">
                                        <T>
                                            {material?.name ||
                                                product.materialId ||
                                                "Unknown"}
                                        </T>
                                    </p>
                                    {material?.description && (
                                        <p className="text-sm text-[var(--color-text)]/60 mt-1">
                                            <T>{material.description}</T>
                                        </p>
                                    )}
                                </div>
                            )}

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
                                                    setSelectedColor(color)
                                                }
                                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                                    selectedColor?.id ===
                                                    color.id
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
                                disabled={colors.length > 0 && !selectedColor}
                                className="w-full py-4 px-6 rounded-xl bg-[var(--color-success)] text-white font-semibold text-lg hover:bg-[var(--color-success)]/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3 text-center shadow-lg"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                <T>Add to Cart</T>
                                <span className="ml-auto">
                                    $
                                    {(
                                        parseFloat(product.price) * length
                                    ).toFixed(2)}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
