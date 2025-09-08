"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
    autoTranslate: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Простой кэш для переводов
const translationCache: Record<string, Record<string, string>> = {
    ru: {},
    hy: {},
    en: {}
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState('en');

    // Загружаем язык из localStorage при монтировании
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferred-language');
        if (savedLanguage && ['en', 'ru', 'hy'].includes(savedLanguage)) {
            setLanguage(savedLanguage);
        }
    }, []);

    // Сохраняем язык в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('preferred-language', language);
    }, [language]);

    // Добавляем функцию setLanguage в глобальную область для DevTools
    useEffect(() => {
        (window as any).setLanguage = (lang: string) => {
            if (['en', 'ru', 'hy'].includes(lang)) {
                setLanguage(lang);
                console.log(`🌍 Language switched to: ${lang}`);
            } else {
                console.warn('Supported languages: en, ru, hy');
            }
        };
    }, []);

    // Функция t() теперь просто возвращает исходный ключ (для обратной совместимости)
    const t = (key: string): string => {
        return key;
    };

    // Функция автоматического перевода
    const autoTranslate = async (text: string): Promise<string> => {
        // Если язык английский, возвращаем оригинальный текст
        if (language === 'en') {
            return text;
        }

        // Проверяем кэш
        if (translationCache[language][text]) {
            return translationCache[language][text];
        }

        try {
            // Определяем целевой язык
            let targetLanguage = language;
            if (language === 'hy') {
                targetLanguage = 'hy'; // Армянский
            } else if (language === 'ru') {
                targetLanguage = 'ru'; // Русский  
            }

            // Делаем запрос к Google Translate API
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`);
            
            if (!response.ok) {
                throw new Error('Translation API request failed');
            }

            const data = await response.json();
            
            // Извлекаем переведённый текст
            let translatedText = text; // fallback
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                translatedText = data[0][0][0];
            }

            // Кэшируем результат
            translationCache[language][text] = translatedText;
            
            return translatedText;
        } catch (error) {
            console.warn('Auto-translation failed:', error);
            // В случае ошибки возвращаем оригинальный текст
            return text;
        }
    };

    const value = {
        language,
        setLanguage,
        t,
        autoTranslate
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}