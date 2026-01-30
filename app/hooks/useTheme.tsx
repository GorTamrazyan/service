// app/hooks/useTheme.tsx
"use client";

import { useState, useEffect } from "react";

export function useTheme() {
    const [isDark, setIsDark] = useState<boolean | null>(null); // Начальное состояние null
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Проверяем localStorage при первой загрузке
        if (typeof window !== "undefined" && !isInitialized) {
            const savedTheme = localStorage.getItem("theme");

            let shouldBeDark = false;

            if (savedTheme) {
                // Если есть сохраненная тема, используем её
                shouldBeDark = savedTheme === "dark";
            } else {
                // Если нет сохраненной темы, используем системные настройки
                shouldBeDark = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches;
                // Сохраняем выбор в localStorage
                localStorage.setItem("theme", shouldBeDark ? "dark" : "light");
            }

            setIsDark(shouldBeDark);
            document.documentElement.classList.toggle("dark", shouldBeDark);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const toggleTheme = () => {
        if (isDark === null) return; // Не переключаем, пока не инициализировано

        const newIsDark = !isDark;
        setIsDark(newIsDark);

        // Сохраняем в localStorage
        localStorage.setItem("theme", newIsDark ? "dark" : "light");

        // Применяем класс к документу
        document.documentElement.classList.toggle("dark", newIsDark);
    };

    return {
        isDark: isDark ?? false, // Возвращаем false если еще не инициализировано
        toggleTheme,
        isInitialized,
    };
}
