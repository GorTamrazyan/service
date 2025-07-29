// app/client/dashboard/cart/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext"; // Импортируем useCart

export default function CartPage() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        clearCart,
    } = useCart();

    // Функция для изменения количества
    const handleQuantityChange = (
        id: string,
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newQuantity = parseInt(event.target.value);
        updateQuantity(id, newQuantity);
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-[var(--color-background)] text-[var(--color-text)] py-20 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
                    Ваша корзина пуста
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    Добавьте что-нибудь, чтобы начать оформление заказа!
                </p>
                <Link
                    href="/client/dashboard/products"
                    className="inline-block bg-[var(--color-accent)] text-[var(--color-primary)] font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors duration-200"
                >
                    Перейти к продуктам
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-background)] text-[var(--color-text)] py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-8 text-center">
                    Ваша Корзина Покупок
                </h1>

                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center border-b border-gray-200 py-4 last:border-b-0"
                        >
                            {item.imageUrl && (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    width={96} // w-24 (96px)
                                    height={96} // h-24 (96px)
                                    className="w-24 h-24 object-cover rounded-md mr-4"
                                />
                            )}
                            <div className="flex-grow">
                                <h2 className="text-lg font-semibold text-[var(--color-primary)]">
                                    {item.name}
                                </h2>
                                <p className="text-gray-600">
                                    Цена: ${parseFloat(item.price).toFixed(2)}
                                </p>
                                <div className="flex items-center mt-2">
                                    <label
                                        htmlFor={`quantity-${item.id}`}
                                        className="sr-only"
                                    >
                                        Количество
                                    </label>
                                    <select
                                        id={`quantity-${item.id}`}
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                item.id,
                                                e as React.ChangeEvent<HTMLSelectElement>
                                            )
                                        }
                                        className="w-20 p-2 border border-gray-300 rounded-md text-sm mr-4 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    >
                                        {[...Array(10)].map(
                                            (
                                                _,
                                                i // Ограничиваем до 10 для примера
                                            ) => (
                                                <option
                                                    key={i + 1}
                                                    value={i + 1}
                                                >
                                                    {i + 1}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors duration-200"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                            <p className="text-lg font-bold text-[var(--color-accent)]">
                                $
                                {(
                                    parseFloat(item.price) * item.quantity
                                ).toFixed(2)}
                            </p>
                        </div>
                    ))}

                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-300">
                        <h2 className="text-xl font-bold text-[var(--color-primary)]">
                            Итого:
                        </h2>
                        <p className="text-2xl font-bold text-[var(--color-accent)]">
                            ${getTotalPrice().toFixed(2)}
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={clearCart}
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200"
                        >
                            Очистить корзину
                        </button>
                        <Link
                            href="/client/dashboard/checkout" // Ссылка на страницу оформления заказа
                            className="px-6 py-3 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200 text-center"
                        >
                            Перейти к оформлению
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
