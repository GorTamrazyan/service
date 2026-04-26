"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { T } from "../../components/T";
import {
    FaShoppingCart,
    FaTrashAlt,
    FaCreditCard,
    FaChevronRight,
    FaPlus,
    FaMinus,
    FaShippingFast,
    FaShieldAlt,
    FaCheckCircle,
    FaArrowLeft,
    FaTag,
} from "react-icons/fa";
import CheckoutModal from "../../components/CheckoutModal";

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
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-success)]/10 border-2 border-[var(--color-success)] flex items-center justify-center">
                            <FaCheckCircle className="w-12 h-12 text-[var(--color-success)]" />
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-4">
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
                            className="inline-flex items-center justify-center gap-2 w-full bg-[var(--color-primary)] text-white font-semibold py-3.5 px-6 rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4" />
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
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-[var(--color-border)] flex items-center justify-center">
                            <FaShoppingCart className="w-10 h-10 text-[var(--color-gray-500)]" />
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-4">
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
                        className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-semibold py-3 px-8 rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                    >
                        <T>Browse Products</T>
                        <FaChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8 md:mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)]">
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

                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div
                                key={`${item.id}-${
                                    item.color?.id || "default"
                                }`}
                                className="group bg-[var(--color-card-bg)] rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden border border-[var(--color-border)]"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-6">

                                        <div className="relative">
                                            {item.type === "service" ? (
                                                <div className="w-24 h-24 rounded-xl bg-[var(--color-gray-100)] flex items-center justify-center">
                                                    <div className="w-10 h-10 text-[var(--color-gray-500)]">
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
                                                    </div>
                                            ) : (
                                                <div className="w-24 h-24 rounded-xl bg-[var(--color-gray-100)] flex items-center justify-center">
                                                    <div className="w-10 h-10 text-[var(--color-gray-500)]">
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

                                            <div
                                                className="absolute -top-2 -left-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-accent)] text-[var(--color-primary)] shadow"
                                            >
                                                {item.type === "service" ? (
                                                    <T>SERVICE</T>
                                                ) : (
                                                    <T>PRODUCT</T>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-serif text-lg font-semibold text-[var(--color-text)]">
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

                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">

                            <div className="bg-[var(--color-card-bg)] rounded-xl p-6 border border-[var(--color-border)]">
                                <h2 className="font-serif text-2xl font-semibold text-[var(--color-primary)] mb-6">
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
                                        className="w-full bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold py-3.5 px-6 rounded-full hover:bg-[var(--color-accent)]/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaCreditCard className="w-5 h-5" />
                                        <T>Proceed to Checkout</T>
                                        <FaChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={clearCart}
                                        className="w-full border border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)]/5 font-semibold py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <FaTrashAlt className="w-4 h-4" />
                                        <T>Clear Cart</T>
                                    </button>

                                    <Link
                                        href="/client/dashboard/products"
                                        className="w-full border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        <T>Continue Shopping</T>
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
                                <h3 className="font-serif text-lg font-semibold text-[var(--color-primary)] mb-4">
                                    <T>Order Benefits</T>
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                                            <FaShippingFast className="w-4 h-4 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-[var(--color-text)]">
                                                <T>Free Shipping</T>
                                            </div>
                                            <div className="text-xs text-[var(--color-gray-500)]">
                                                <T>On orders over $500</T>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                                            <FaShieldAlt className="w-4 h-4 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-[var(--color-text)]">
                                                <T>Warranty Included</T>
                                            </div>
                                            <div className="text-xs text-[var(--color-gray-500)]">
                                                <T>15-year warranty on all products</T>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                                            <FaTag className="w-4 h-4 text-[var(--color-primary)]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-[var(--color-text)]">
                                                <T>Price Match</T>
                                            </div>
                                            <div className="text-xs text-[var(--color-gray-500)]">
                                                <T>Find it cheaper? We'll match it</T>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={closeCheckoutModal}
                customerInfo={customerInfo}
                updateCustomerInfo={updateCustomerInfo}
                cartItems={cartItems}
                getTotalPrice={getTotalPrice}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitOrder}
            />
        </div>
    );
}
