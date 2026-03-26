"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
    autoTranslate: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationCache: Record<string, Record<string, string>> = {
    es: {},
    ru: {},
    hy: {},
    en: {}
};

export function LanguageProvider({ children, storageKey = 'preferred-language' }: { children: React.ReactNode; storageKey?: string }) {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const savedLanguage = localStorage.getItem(storageKey);
        if (savedLanguage && ['en','es', 'ru', 'hy'].includes(savedLanguage)) {
            setLanguage(savedLanguage);
        }
    }, [storageKey]);

    useEffect(() => {
        localStorage.setItem(storageKey, language);
    }, [language, storageKey]);

    useEffect(() => {
        (window as any).setLanguage = (lang: string) => {
            if (['en','es', 'ru', 'hy'].includes(lang)) {
                setLanguage(lang);
                console.log(`🌍 Language switched to: ${lang}`);
            } else {
                console.warn('Supported languages: en,es, ru, hy');
            }
        };
    }, []);

    const t = (key: string): string => {
        return key;
    };

    const autoTranslate = async (text: string): Promise<string> => {
        
        if (language === 'en') {
            return text;
        }

        if (translationCache[language][text]) {
            return translationCache[language][text];
        }

        try {
            let targetLanguage = language;
            if (language === 'hy') {
                targetLanguage = 'hy';
            } else if (language === 'ru') {
                targetLanguage = 'ru';
            } else if (language === 'es'){
                targetLanguage = 'es';
            }

            const response = await fetch(`/api/translate?tl=${targetLanguage}&q=${encodeURIComponent(text)}`);

            if (!response.ok) {
                throw new Error('Translation API request failed');
            }

            const data = await response.json();

            let translatedText = text;
            if (data?.translated) {
                translatedText = data.translated;
            }

            translationCache[language][text] = translatedText;
            
            return translatedText;
        } catch (error) {
            console.warn('Auto-translation failed:', error);
            
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