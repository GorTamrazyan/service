// app/client/components/ProductFilters.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ProductFiltersProps {
    // Пропсы, которые ProductFilters будет передавать родительскому компоненту
    onApplyFilters: (
        category: string,
        minPrice: string,
        maxPrice: string
    ) => void;
    onResetFilters: () => void;
    // Пропсы для инициализации фильтров и отображения состояния
    initialCategory: string;
    initialMinPrice: string;
    initialMaxPrice: string;
    availableCategories: string[]; // Все доступные категории
}

export default function ProductFilters({
    onApplyFilters,
    onResetFilters,
    initialCategory,
    initialMinPrice,
    initialMaxPrice,
    availableCategories,
}: ProductFiltersProps) {
    // Состояния для значений в инпутах (что пользователь вводит)
    const [tempSelectedCategory, setTempSelectedCategory] =
        useState<string>(initialCategory);
    const [tempMinPrice, setTempMinPrice] = useState<string>(initialMinPrice);
    const [tempMaxPrice, setTempMaxPrice] = useState<string>(initialMaxPrice);

    // Эффект для синхронизации temp-состояний с initial-пропсами
    // Это важно, когда родитель (ProductPage) сбрасывает или инициализирует фильтры
    useEffect(() => {
        setTempSelectedCategory(initialCategory);
        setTempMinPrice(initialMinPrice);
        setTempMaxPrice(initialMaxPrice);
    }, [initialCategory, initialMinPrice, initialMaxPrice]);

    // Функция для применения фильтров, вызывающая колбэк
    const handleApply = useCallback(() => {
        onApplyFilters(tempSelectedCategory, tempMinPrice, tempMaxPrice);
    }, [onApplyFilters, tempSelectedCategory, tempMinPrice, tempMaxPrice]);

    // Обработчик нажатия Enter
    const handlePriceKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                handleApply();
            }
        },
        [handleApply]
    );

    // Проверяем, есть ли изменения, требующие применения
    const hasPendingChanges =
        tempSelectedCategory !== initialCategory ||
        tempMinPrice !== initialMinPrice ||
        tempMaxPrice !== initialMaxPrice;

    // Проверяем, применены ли какие-либо фильтры (для кнопки сброса)
    const areAnyFiltersApplied =
        initialCategory !== "all" ||
        initialMinPrice !== "" ||
        initialMaxPrice !== "";

    return (
        <section className="mb-10 p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="relative flex flex-col w-full md:w-auto">
                <label
                    htmlFor="category-filter"
                    className="text-sm font-medium text-gray-700 mb-1"
                >
                    Категория:
                </label>
                <select
                    id="category-filter"
                    className="
            block w-full
            appearance-none focus:outline-none focus:ring-0 focus:border-0 // Отключаем дефолтный внешний вид
            pl-4 pr-10 py-2 // Отступы, чтобы было место для стрелки
            text-base font-semibold // Более жирный текст
            bg-white // Фон белый
            border border-gray-300 rounded-lg // Аккуратная рамка и скругление
            shadow-sm // Небольшая тень
            cursor-pointer // Курсор-указатель
            hover:border-[var(--color-accent)] // При наведении меняем цвет рамки
            transition-all duration-200 ease-in-out // Плавный переход
        "
                    value={tempSelectedCategory}
                    onChange={(e) => setTempSelectedCategory(e.target.value)}
                >
                    {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat === "all"
                                ? "Все категории"
                                : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 bottom-0 top-[calc(1.5rem+8px)]">
                    {" "}
                    {/* Позиционирование стрелки */}
                    <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            <div className="flex flex-col w-full md:w-auto">
                <label
                    htmlFor="min-price"
                    className="text-sm font-medium text-gray-700 mb-1"
                >
                    Мин. цена:
                </label>
                <input
                    type="number"
                    id="min-price"
                    className="
                        mt-1 block w-full
                        px-4 py-2 // Увеличенные отступы
                        text-base font-semibold text-[var(--color-text)] // Цвет текста и жирность
                        bg-white // Фон белый
                        border border-gray-300 rounded-lg // Аккуратная рамка и скругление
                        shadow-sm // Небольшая тень
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent // Фокус с кольцом
                        placeholder-gray-400 // Стиль для плейсхолдера
                        transition-all duration-200 ease-in-out // Плавный переход
                    "
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                    onKeyDown={handlePriceKeyDown}
                    placeholder="От"
                    min="0"
                />
            </div>

            <div className="flex flex-col w-full md:w-auto">
                <label
                    htmlFor="max-price"
                    className="text-sm font-medium text-gray-700 mb-1"
                >
                    Макс. цена:
                </label>
                <input
                    type="number"
                    id="max-price"
                    className="
                        mt-1 block w-full
                        px-4 py-2 // Увеличенные отступы
                        text-base font-semibold text-[var(--color-text)] // Цвет текста и жирность
                        bg-white // Фон белый
                        border border-gray-300 rounded-lg // Аккуратная рамка и скругление
                        shadow-sm // Небольшая тень
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent // Фокус с кольцом
                        placeholder-gray-400 // Стиль для плейсхолдера
                        transition-all duration-200 ease-in-out // Плавный переход
                    "
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    onKeyDown={handlePriceKeyDown}
                    placeholder="До"
                    min="0"
                />
            </div>

            {/* Кнопка "Применить фильтры" */}
            {hasPendingChanges && (
                <button
                    onClick={handleApply}
                    className="mt-4 md:mt-0 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 text-sm"
                >
                    Применить фильтры
                </button>
            )}

            {/* Кнопка сброса фильтров */}
            {areAnyFiltersApplied && (
                <button
                    onClick={onResetFilters} // Вызываем колбэк для сброса
                    className="mt-4 md:mt-0 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm"
                >
                    Сбросить фильтры
                </button>
            )}
        </section>
    );
}
