"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface TProps {
    children: string;
    fallback?: string;
    className?: string;
    as?: keyof React.JSX.IntrinsicElements;
}

export function T({ children, fallback, className = "", as = "span" }: TProps) {
    const { t, language, autoTranslate } = useLanguage();
    const [translatedText, setTranslatedText] = useState<string>(children);

    useEffect(() => {
        async function handleTranslation() {
            if (!children) {
                setTranslatedText(fallback || "");
                return;
            }

            const keyTranslation = t(children);
            if (keyTranslation !== children) {
                setTranslatedText(keyTranslation);
                return;
            }

            if (language !== "en") {
                try {
                    const translated = await autoTranslate(children);
                    setTranslatedText(translated);
                } catch (error) {
                    console.warn("Auto-translation failed:", error);
                    setTranslatedText(fallback || children);
                }
            } else {
                setTranslatedText(children);
            }
        }

        handleTranslation();
    }, [children, language, t, autoTranslate, fallback]);

    const Component = as as keyof React.JSX.IntrinsicElements;

    return React.createElement(Component, { className }, translatedText);
}
