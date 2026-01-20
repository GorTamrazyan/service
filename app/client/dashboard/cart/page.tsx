// app/client/dashboard/cart/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { T } from "../../components/T";
import {
    FaShoppingCart,
    FaTrashAlt,
    FaChevronRight,
    FaPlus,
    FaMinus,
    FaShippingFast,
    FaShieldAlt,
    FaCreditCard,
    FaTimes,
    FaCheckCircle,
    FaArrowLeft,
    FaTag,
} from "react-icons/fa";

export default function CartPage() {
    const {
        cartItems,
        removeFromCart,
        getTotalPrice,
        clearCart,
        incrementQuantity,
        decrementQuantity,
        showCheckoutModal,
        customerInfo,
        isSubmitting,
        orderSuccess,
        openCheckoutModal,
        closeCheckoutModal,
        updateCustomerInfo,
        handleSubmitOrder,
        resetOrderSuccess,
    } = useCart();

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center animate-pulse">
                            <FaCheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-primary)] mb-4">
                            <T>Order Confirmed!</T>
                        </h1>
                        <p className="text-lg text-[var(--color-text)]/80 mb-8">
                            <T>
                                Your order has been successfully placed and is
                                being processed.
                            </T>
                        </p>
                    </div>
                    <div className="space-y-4">
                        <Link
                            href="/client/dashboard/products"
                            className="group inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <FaArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <T>Continue Shopping</T>
                        </Link>
                        <Link
                            href="/client/dashboard/profile?section=orders"
                            className="group inline-flex items-center justify-center gap-3 w-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white"
                        >
                            <T>View Order Status</T>
                            <FaChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-primary)]/10 flex items-center justify-center">
                            <FaShoppingCart className="w-16 h-16 text-[var(--color-accent)]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[var(--color-primary)] mb-4">
                            <T>Your Cart is Empty</T>
                        </h1>
                        <p className="text-lg text-[var(--color-text)]/80 mb-8">
                            <T>
                                Discover our premium fencing solutions and add
                                items to get started!
                            </T>
                        </p>
                    </div>
                    <Link
                        href="/client/dashboard/products"
                        className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/90 text-[var(--color-primary)] font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-xl"
                    >
                        <T>Browse Products</T>
                        <FaChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl md:text-5xl font-black text-[var(--color-primary)]">
                            <T>Shopping Cart</T>
                        </h1>
                        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)]/10 rounded-full">
                            <FaShoppingCart className="w-5 h-5 text-[var(--color-accent)]" />
                            <span className="text-sm font-bold text-[var(--color-primary)]">
                                {cartItems.length}{" "}
                                {cartItems.length === 1 ? (
                                    <T>item</T>
                                ) : (
                                    <T>items</T>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-text)]/60">
                        <Link
                            href="/client/dashboard"
                            className="hover:text-[var(--color-primary)] transition-colors"
                        >
                            <T>Home</T>
                        </Link>
                        <FaChevronRight className="w-3 h-3" />
                        <Link
                            href="/client/dashboard/products"
                            className="hover:text-[var(--color-primary)] transition-colors"
                        >
                            <T>Products</T>
                        </Link>
                        <FaChevronRight className="w-3 h-3" />
                        <span className="text-[var(--color-primary)] font-semibold">
                            <T>Cart</T>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div
                                key={`${item.id}-${
                                    item.color?.id || "default"
                                }`}
                                className="group bg-[var(--color-card)] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[var(--color-border)]"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Image/Icon */}
                                        <div className="relative">
                                            {item.type === "service" ? (
                                                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                                    <div className="w-12 h-12 text-white">
                                                        <svg
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : item.imageUrl ? (
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-lg">
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                                    <div className="w-12 h-12 text-white">
                                                        <svg
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Badge */}
                                            <div
                                                className={`absolute -top-2 -left-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                                                    item.type === "service"
                                                        ? "bg-green-600 text-white"
                                                        : "bg-blue-600 text-white"
                                                }`}
                                            >
                                                {item.type === "service" ? (
                                                    <T>SERVICE</T>
                                                ) : (
                                                    <T>PRODUCT</T>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3
                                                    className={`text-xl font-bold ${
                                                        item.type === "service"
                                                            ? "text-green-700"
                                                            : "text-blue-700"
                                                    }`}
                                                >
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.id,
                                                            item.color?.id
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                >
                                                    <FaTrashAlt className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {item.type === "service" &&
                                                item.description && (
                                                    <p className="text-[var(--color-text)]/70 text-sm mb-4">
                                                        {item.description}
                                                    </p>
                                                )}

                                            {/* Product Details */}
                                            {item.type === "product" && (
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex flex-wrap gap-4">
                                                        {item.height && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <span className="text-[var(--color-text)]/60">
                                                                    <T>
                                                                        Height
                                                                    </T>
                                                                    :
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {
                                                                        item.height
                                                                    }
                                                                    m
                                                                </span>
                                                            </div>
                                                        )}
                                                        {item.length && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <span className="text-[var(--color-text)]/60">
                                                                    <T>
                                                                        Length
                                                                    </T>
                                                                    :
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {
                                                                        item.length
                                                                    }
                                                                    m
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {item.color && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                                                                    style={{
                                                                        backgroundColor:
                                                                            item
                                                                                .color
                                                                                .hexCode,
                                                                    }}
                                                                />
                                                                <span className="text-sm text-[var(--color-text)]/70">
                                                                    {
                                                                        item
                                                                            .color
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 bg-[var(--color-background)] rounded-lg p-2">
                                                        <button
                                                            onClick={() =>
                                                                decrementQuantity(
                                                                    item.id,
                                                                    item.quantity,
                                                                    item.color
                                                                        ?.id
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-card)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <FaMinus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-10 text-center font-bold text-lg">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                incrementQuantity(
                                                                    item.id,
                                                                    item.quantity,
                                                                    item.color
                                                                        ?.id
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity >=
                                                                100
                                                            }
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-card)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <FaPlus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="text-sm text-[var(--color-text)]/60">
                                                        $
                                                        {parseFloat(
                                                            item.price
                                                        ).toFixed(2)}{" "}
                                                        <T>each</T>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-[var(--color-accent)]">
                                                        $
                                                        {(
                                                            parseFloat(
                                                                item.price
                                                            ) * item.quantity
                                                        ).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Summary Card */}
                            <div className="bg-[var(--color-card)] rounded-2xl shadow-xl p-6 border border-[var(--color-border)]">
                                <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                                    <T>Order Summary</T>
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">
                                            <T>Subtotal</T>
                                        </span>
                                        <span className="font-semibold">
                                            ${getTotalPrice().toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">
                                            <T>Shipping</T>
                                        </span>
                                        <span className="font-semibold text-green-600">
                                            <T>Calculated at checkout</T>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">
                                            <T>Tax</T>
                                        </span>
                                        <span className="font-semibold">
                                            $
                                            {(getTotalPrice() * 0.08).toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="py-4 border-t border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-[var(--color-primary)]">
                                            <T>Total</T>
                                        </span>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-[var(--color-accent)]">
                                                $
                                                {(
                                                    getTotalPrice() * 1.08
                                                ).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <T>Including taxes and fees</T>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <button
                                        onClick={openCheckoutModal}
                                        className="group w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/90 text-[var(--color-primary)] font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                                    >
                                        <FaCreditCard className="w-5 h-5" />
                                        <T>Proceed to Checkout</T>
                                        <FaChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={clearCart}
                                        className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <FaTrashAlt className="w-4 h-4" />
                                        <T>Clear Cart</T>
                                    </button>

                                    <Link
                                        href="/client/dashboard/products"
                                        className="group w-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        <T>Continue Shopping</T>
                                    </Link>
                                </div>
                            </div>

                            {/* Benefits Card */}
                            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 rounded-2xl p-6 text-white">
                                <h3 className="text-xl font-bold mb-4">
                                    <T>Order Benefits</T>
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <FaShippingFast className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">
                                                <T>Free Shipping</T>
                                            </div>
                                            <div className="text-sm text-white/80">
                                                <T>On orders over $500</T>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <FaShieldAlt className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">
                                                <T>Warranty Included</T>
                                            </div>
                                            <div className="text-sm text-white/80">
                                                <T>
                                                    15-year warranty on all
                                                    products
                                                </T>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <FaTag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">
                                                <T>Price Match</T>
                                            </div>
                                            <div className="text-sm text-white/80">
                                                <T>
                                                    Find it cheaper? We'll match
                                                    it
                                                </T>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-[var(--color-card)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                        <div className="p-6 md:p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-black text-[var(--color-primary)]">
                                        <T>Checkout</T>
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        <T>
                                            Complete your order with secure
                                            payment
                                        </T>
                                    </p>
                                </div>
                                <button
                                    onClick={closeCheckoutModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                                >
                                    <FaTimes className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Progress Steps */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] font-bold flex items-center justify-center">
                                        1
                                    </div>
                                    <span className="font-semibold">
                                        <T>Cart</T>
                                    </span>
                                </div>
                                <div className="h-1 flex-grow mx-4 bg-gray-200">
                                    <div className="h-full bg-[var(--color-accent)] w-1/2"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] font-bold flex items-center justify-center">
                                        2
                                    </div>
                                    <span className="font-semibold">
                                        <T>Details</T>
                                    </span>
                                </div>
                                <div className="h-1 flex-grow mx-4 bg-gray-200">
                                    <div className="h-full bg-gray-200 w-0"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 font-bold flex items-center justify-center">
                                        3
                                    </div>
                                    <span className="text-gray-400">
                                        <T>Payment</T>
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitOrder}>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <T>Full Name</T> *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.name}
                                                onChange={(e) =>
                                                    updateCustomerInfo({
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-3 border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <T>Email</T> *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={customerInfo.email}
                                                onChange={(e) =>
                                                    updateCustomerInfo({
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-3 border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <T>Phone Number</T>
                                            </label>
                                            <input
                                                type="tel"
                                                value={customerInfo.phone}
                                                onChange={(e) =>
                                                    updateCustomerInfo({
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-3 border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <T>Delivery Address</T> *
                                            </label>
                                            <textarea
                                                required
                                                value={customerInfo.address}
                                                onChange={(e) =>
                                                    updateCustomerInfo({
                                                        address: e.target.value,
                                                    })
                                                }
                                                rows={3}
                                                className="w-full px-4 py-3 border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all resize-none"
                                                placeholder="Street, City, State, ZIP Code"
                                            />
                                        </div>
                                    </div>

                                    {/* Order Summary in Modal */}
                                    <div className="bg-[var(--color-background)] rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">
                                            <T>Order Summary</T>
                                        </h3>
                                        <div className="space-y-3">
                                            {cartItems.map((item) => (
                                                <div
                                                    key={`${item.id}-${item.color?.id}`}
                                                    className="flex justify-between items-center py-2"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            ×{item.quantity}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold">
                                                        $
                                                        {(
                                                            parseFloat(
                                                                item.price
                                                            ) * item.quantity
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="border-t pt-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold">
                                                        <T>Total</T>
                                                    </span>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black text-[var(--color-accent)]">
                                                            $
                                                            {(
                                                                getTotalPrice() *
                                                                1.08
                                                            ).toFixed(2)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            <T>
                                                                Including tax
                                                                and shipping
                                                            </T>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                                        <button
                                            type="button"
                                            onClick={closeCheckoutModal}
                                            className="flex-1 px-6 py-4 border-2 border-[var(--color-border)] text-[var(--color-text)] font-bold rounded-xl hover:bg-[var(--color-background)] transition-colors"
                                        >
                                            <T>Cancel</T>
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-6 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/90 text-[var(--color-primary)] font-bold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg
                                                        className="animate-spin h-5 w-5 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    <T>Processing...</T>
                                                </>
                                            ) : (
                                                <>
                                                    <FaCreditCard className="w-5 h-5" />
                                                    <T>Place Secure Order</T>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
