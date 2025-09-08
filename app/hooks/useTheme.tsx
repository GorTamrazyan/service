"use client";

import { useState, useEffect } from 'react';

export function useTheme() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Проверяем localStorage при загрузке
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        setIsDark(shouldBeDark);
        
        // Применяем класс к документу
        document.documentElement.classList.toggle('dark', shouldBeDark);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        
        // Сохраняем в localStorage
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
        
        // Применяем класс к документу
        document.documentElement.classList.toggle('dark', newIsDark);
    };

    return { isDark, toggleTheme };
}