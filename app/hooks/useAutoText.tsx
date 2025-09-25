"use client";

import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useEffect, useState } from "react";

// Хук для автоматического перевода текста
export function useAutoText(text: string, fallback?: string): string {
    const { t, language, autoTranslate } = useLanguage();
    const [translatedText, setTranslatedText] = useState<string>(text);

    useEffect(() => {
        async function handleTranslation() {
            if (!text) {
                setTranslatedText(fallback || '');
                return;
            }

            // Сначала пытаемся найти перевод по ключу
            const keyTranslation = t(text);
            if (keyTranslation !== text) {
                setTranslatedText(keyTranslation);
                return;
            }

            // Если ключ не найден и язык не английский - переводим автоматически
            if (language !== 'en') {
                try {
                    const translated = await autoTranslate(text);
                    setTranslatedText(translated);
                } catch (error) {
                    console.warn('Auto-translation failed:', error);
                    setTranslatedText(fallback || text);
                }
            } else {
                setTranslatedText(text);
            }
        }

        handleTranslation();
    }, [text, language, t, autoTranslate, fallback]);

    return translatedText;
}

// Компонент для автоматического перевода текста
interface AutoTextProps {
    children: string;
    fallback?: string;
    className?: string;
    as?: keyof React.JSX.IntrinsicElements;
}

export function AutoText({
    children,
    fallback,
    className = "",
    as: Component = "span"
}: AutoTextProps) {
    const translatedText = useAutoText(children, fallback);

    return React.createElement(Component as React.ElementType, { className }, translatedText);
}