// app/client/dashboard/cart/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { T } from "../../components/T";
import { createOrder } from "../../../lib/firebase/orders";
import { useAuthState } from "../../../hooks/useAuthState";
import { useProfile } from "../../../hooks/useProfile";
import { Color } from "@/app/lib/firebase/products";

export default function CartPage() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        clearCart,
    } = useCart();

    const [user] = useAuthState();
    const { profile } = useProfile();
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Функция для открытия модального окна с предзаполненными данными
    const openCheckoutModal = () => {
        if (profile) {
            const fullAddress = `${profile.address.city}, ${
                profile.address.street
            } ${profile.address.houseNumber}${
                profile.address.apartmentNumber
                    ? `, apt. ${profile.address.apartmentNumber}`
                    : ""
            }, ${profile.address.zipCode}`.trim();

            setCustomerInfo({
                name: `${profile.firstName} ${profile.lastName}`.trim() || "",
                email: profile.email || user?.email || "",
                phone: profile.phone || "",
                address: fullAddress || "",
            });
        } else {
            setCustomerInfo({
                name: "",
                email: user?.email || "",
                phone: "",
                address: "",
            });
        }
        setShowCheckoutModal(true);
    };

    // Обработка отправки заказа
    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            const orderData = {
                userId: user.uid,
                products: cartItems.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    color: item.color?.hexCode,
                })),
                totalPrice: getTotalPrice().toFixed(2),
                status: "pending" as const,
                customerInfo,
            };

            await createOrder(orderData);
            clearCart();
            setShowCheckoutModal(false);
            alert("Your order has been successfully placed!");
        } catch (error) {
            console.error("Error creating order:", error);
            alert("There was an error placing your order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Функции для изменения количества
    const incrementQuantity = (id: string, currentQuantity: number,colorId?:string) => {
        if (currentQuantity < 100) {
            // Ограничиваем максимальное количество
            updateQuantity(id, currentQuantity + 1, colorId);
        }
    };

    const decrementQuantity = (id: string, currentQuantity: number,colorId?:string) => {
        if (currentQuantity > 1) {
            // Минимальное количество 1
            updateQuantity(id, currentQuantity - 1, colorId);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-[var(--color-background)] text-[var(--color-text)] py-20 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
                    <T>Your cart is empty</T>
                </h1>
                <p className="text-lg text-[var(--color-gray-600)] mb-6">
                    <T>Add something to start placing your order!</T>
                </p>
                <Link
                    href="/client/dashboard/products"
                    className="inline-block bg-[var(--color-accent)] text-[var(--color-primary)] font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors duration-200"
                >
                    <T>Go to products</T>
                </Link>
            </div>
        );
    } else {
        cartItems.map((item) => color(item.color));
    }

    function color(color: Color | null) {
        console.log("Color data:", color);
    }

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                    <T>Your Shopping Cart</T>
                </h1>

                <div className="bg-[var(--color-card-bg)] rounded-lg shadow-xl p-6 md:p-8">
                    {cartItems.map((item) => (
                        <div
                            key={`${item.id}-${item.color?.id || "default"}`}
                            className="flex flex-col sm:flex-row sm:items-center border-b border-[var(--color-border)] py-4 last:border-b-0 gap-4"
                        >
                            <div className="flex items-start sm:items-center gap-4 flex-1">
                                {item.imageUrl && (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        width={96}
                                        height={96}
                                        className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-md flex-shrink-0"
                                    />
                                )}
                                <div className="flex-grow min-w-0">
                                    <h2 className="text-base sm:text-lg font-semibold text-[var(--color-primary)] truncate">
                                        {item.name}
                                    </h2>
                                    <p className="text-sm sm:text-base text-[var(--color-gray-600)]">
                                        <T>Price</T>: $
                                        {parseFloat(item.price).toFixed(2)}
                                    </p>
                                    <div className="flex flex-row gap-2">
                                        <p className="text-sm sm:text-base text-[var(--color-gray-600)]">
                                            <T>Height</T>: {item.height}m
                                        </p>
                                        <p className="text-sm sm:text-base text-[var(--color-gray-600)]">
                                            <T>Length</T>: {item.length}m
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{
                                                backgroundColor:
                                                    item.color?.hexCode,
                                            }}
                                        ></div>
                                        <span className="text-xs text-[var(--color-gray-600)]">
                                            {item.color?.name}
                                        </span>
                                    </div>
                                    <div className="sm:hidden mt-2">
                                        <p className="text-base font-bold text-[var(--color-accent)]">
                                            $
                                            {(
                                                parseFloat(item.price) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs sm:text-sm text-[var(--color-gray-600)] whitespace-nowrap">
                                        <T>Quantity:</T>
                                    </span>
                                    <button
                                        onClick={() =>
                                            decrementQuantity(
                                                item.id,
                                                item.quantity,
                                                item.color?.id
                                            )
                                        }
                                        disabled={item.quantity <= 1}
                                        className={`
                                            flex items-center justify-center
                                            w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2
                                            font-bold text-lg sm:text-xl
                                            transition-all duration-200 ease-in-out
                                            shadow-sm hover:shadow-md flex-shrink-0
                                            ${
                                                item.quantity <= 1
                                                    ? "border-[var(--color-gray-300)] text-[var(--color-gray-300)] cursor-not-allowed bg-[var(--color-gray-50)]"
                                                    : "border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white cursor-pointer bg-[var(--color-card-bg)] hover:scale-105 active:scale-95"
                                            }
                                        `}
                                    >
                                        −
                                    </button>

                                    <div className="mx-2 sm:mx-4 px-2 sm:px-3 py-1 bg-[var(--color-gray-50)] rounded-lg flex-shrink-0">
                                        <span className="text-sm sm:text-lg font-bold text-[var(--color-text)]">
                                            {item.quantity}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() =>
                                            incrementQuantity(
                                                item.id,
                                                item.quantity,
                                                item.color?.id
                                            )
                                        }
                                        disabled={item.quantity >= 100}
                                        className={`
                                            flex items-center justify-center
                                            w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2
                                            font-bold text-lg sm:text-xl
                                            transition-all duration-200 ease-in-out
                                            shadow-sm hover:shadow-md flex-shrink-0
                                            ${
                                                item.quantity >= 100
                                                    ? "border-[var(--color-gray-300)] text-[var(--color-gray-300)] cursor-not-allowed bg-[var(--color-gray-50)]"
                                                    : "border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white cursor-pointer bg-[var(--color-card-bg)] hover:scale-105 active:scale-95"
                                            }
                                        `}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() =>
                                            removeFromCart(
                                                item.id,
                                                item.color?.id
                                            )
                                        }
                                        className="text-[var(--color-error)] hover:opacity-80 text-xs sm:text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
                                    >
                                        <T>Remove</T>
                                    </button>

                                    <div className="hidden sm:block">
                                        <p className="text-lg font-bold text-[var(--color-accent)] whitespace-nowrap">
                                            $
                                            {(
                                                parseFloat(item.price) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-[var(--color-gray-300)]">
                        <h2 className="text-xl font-bold text-[var(--color-primary)]">
                            <T>Total:</T>
                        </h2>
                        <p className="text-2xl font-bold text-[var(--color-accent)]">
                            ${getTotalPrice().toFixed(2)}
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={clearCart}
                            className="px-6 py-3 bg-[var(--color-gray-200)] text-[var(--color-gray-800)] rounded-md font-semibold hover:bg-[var(--color-gray-300)] transition-colors duration-200"
                        >
                            <T>Clear cart</T>
                        </button>
                        <button
                            onClick={openCheckoutModal}
                            className="px-6 py-3 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200"
                        >
                            <T>Proceed to checkout</T>
                        </button>
                    </div>
                </div>

                {/* Модальное окно оформления заказа */}
                {showCheckoutModal && (
                    <div className="fixed inset-0 bg-[var(--color-modal-overlay)] flex items-center justify-center z-50 p-4">
                        <div className="bg-[var(--color-card-bg)] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                                        <T>Checkout</T>
                                    </h2>
                                    <button
                                        onClick={() =>
                                            setShowCheckoutModal(false)
                                        }
                                        className="text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <form onSubmit={handleSubmitOrder}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                                                <T>Full Name</T> *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.name}
                                                onChange={(e) =>
                                                    setCustomerInfo({
                                                        ...customerInfo,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                                                <T>Email</T> *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={customerInfo.email}
                                                onChange={(e) =>
                                                    setCustomerInfo({
                                                        ...customerInfo,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                                                <T>Phone</T>
                                            </label>
                                            <input
                                                type="tel"
                                                value={customerInfo.phone}
                                                onChange={(e) =>
                                                    setCustomerInfo({
                                                        ...customerInfo,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">
                                                <T>Address</T> *
                                            </label>
                                            <textarea
                                                required
                                                value={customerInfo.address}
                                                onChange={(e) =>
                                                    setCustomerInfo({
                                                        ...customerInfo,
                                                        address: e.target.value,
                                                    })
                                                }
                                                rows={3}
                                                className="w-full px-3 py-2 border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                            />
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-lg font-semibold">
                                                    <T>Total:</T>
                                                </span>
                                                <span className="text-xl font-bold text-[var(--color-accent)]">
                                                    $
                                                    {getTotalPrice().toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCheckoutModal(false)
                                            }
                                            className="flex-1 px-4 py-2 bg-[var(--color-gray-200)] text-[var(--color-gray-800)] rounded-md font-semibold hover:bg-[var(--color-gray-300)] transition-colors"
                                        >
                                            <T>Cancel</T>
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-2 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-md font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <T>Processing...</T>
                                            ) : (
                                                <T>Place Order</T>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
