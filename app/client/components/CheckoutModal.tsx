"use client";

import React from "react";
import { FaTimes, FaCreditCard } from "react-icons/fa";
import { T } from "./T";
import type { CartItem, CustomerInfo } from "../context/CartContext";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerInfo: CustomerInfo;
    updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
    cartItems: CartItem[];
    getTotalPrice: () => number;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    customerInfo,
    updateCustomerInfo,
    cartItems,
    getTotalPrice,
    isSubmitting,
    onSubmit,
}: CheckoutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl">
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-[var(--color-primary)]">
                                <T>Checkout</T>
                            </h2>
                            <p className="text-gray-600 mt-1">
                                <T>Complete your order with secure payment</T>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={onSubmit}>
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
                                        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
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
                                        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
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
                                        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
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
                                        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all resize-none"
                                        placeholder="Street, City, State, ZIP Code"
                                    />
                                </div>
                            </div>

                            {/* Order Summary in Modal */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    <T>Order Summary</T>
                                </h3>
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div
                                            key={`${item.id}-${item.color?.id}`}
                                            className="flex justify-between items-center py-2"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-gray-900">
                                                    {item.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-gray-900">
                                                $
                                                {(
                                                    parseFloat(item.price) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-t border-gray-300 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">
                                                <T>Total</T>
                                            </span>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-[var(--color-accent)]">
                                                    $
                                                    {(
                                                        getTotalPrice() * 1.08
                                                    ).toFixed(2)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <T>
                                                        Including tax and
                                                        shipping
                                                    </T>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
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
    );
}
