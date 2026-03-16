const fs = require('fs');
const path = require('path');

async function translateText(text, targetLang) {
    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const result = await response.json();
        return result[0][0][0];
    } catch (error) {
        console.error(`Ошибка перевода для "${text}":`, error);
        return text; 
    }
}

async function autoTranslate() {
    const contextPath = path.join(__dirname, '../app/contexts/LanguageContext.tsx');
    const content = fs.readFileSync(contextPath, 'utf8');
    
    const enMatch = content.match(/en:\s*{([\s\S]*?)},\s*ru:/);
    if (!enMatch) {
        console.error('Не удалось найти английские переводы');
        return;
    }
    
    const enSection = enMatch[1];
    const keyValuePairs = enSection.match(/"[^"]*":\s*"[^"]*"/g);
    
    if (!keyValuePairs) {
        console.error('Не удалось извлечь ключи и значения');
        return;
    }
    
    console.log('🚀 Начинаю автоматический перевод...');
    
    const languages = {
        ru: 'ru',
        hy: 'hy'
    };
    
    const translations = {};
    
    Object.keys(languages).forEach(lang => {
        translations[lang] = {};
    });
    
    for (const pair of keyValuePairs) {
        const [key, value] = pair.match(/"([^"]*)"/g);
        const cleanKey = key.replace(/"/g, '');
        const cleanValue = value.replace(/"/g, '');
        
        console.log(`📝 Переводим: ${cleanKey}`);
        
        for (const [langCode, googleLangCode] of Object.entries(languages)) {
            try {
                const translatedValue = await translateText(cleanValue, googleLangCode);
                translations[langCode][cleanKey] = translatedValue;
                
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Ошибка перевода ${cleanKey} на ${langCode}:`, error);
                translations[langCode][cleanKey] = cleanValue; 
            }
        }
    }
    
    const newTranslations = {
        en: {},
        ...translations
    };
    
    keyValuePairs.forEach(pair => {
        const [key, value] = pair.match(/"([^"]*)"/g);
        const cleanKey = key.replace(/"/g, '');
        const cleanValue = value.replace(/"/g, '');
        newTranslations.en[cleanKey] = cleanValue;
    });
    
    const newContent = generateLanguageContextCode(newTranslations);
    
    fs.copyFileSync(contextPath, contextPath + '.backup');
    
    fs.writeFileSync(contextPath, newContent, 'utf8');
    
    console.log('✅ Автоматический перевод завершен!');
    console.log('📁 Резервная копия сохранена как LanguageContext.tsx.backup');
    console.log('🔧 Проверьте переводы и отредактируйте при необходимости');
}

function generateLanguageContextCode(translations) {
    const formatTranslations = (obj) => {
        return Object.entries(obj)
            .map(([key, value]) => `        "${key}": "${value.replace(/"/g, '\\"')}"`)
            .join(',\n');
    };
    
    return `"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
    autoTranslate: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
    en: {
${formatTranslations(translations.en)}
    },
    
    ru: {
${formatTranslations(translations.ru)}
    },
    
    hy: {
${formatTranslations(translations.hy)}
    }
};

// Функция для автоматического перевода новых текстов
async function translateText(text: string, targetLang: string): Promise<string> {
    try {
        const response = await fetch(\`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=\${targetLang}&dt=t&q=\${encodeURIComponent(text)}\`);
        const result = await response.json();
        return result[0][0][0];
    } catch (error) {
        console.warn('Auto-translation failed:', error);
        return text;
    }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState('en');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguageState(savedLanguage);
    }, []);

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): string => {
        const langTranslations = translations[language as keyof typeof translations];
        return (langTranslations as any)?.[key] || key;
    };
    
    // Автоматический перевод для новых текстов
    const autoTranslate = async (text: string): Promise<string> => {
        if (language === 'en') return text;
        
        const langMap: { [key: string]: string } = {
            ru: 'ru',
            hy: 'hy'
        };
        
        const targetLang = langMap[language];
        if (!targetLang) return text;
        
        return await translateText(text, targetLang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, autoTranslate }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Хук для автоматического перевода
export const useAutoTranslate = () => {
    const { autoTranslate, language } = useLanguage();
    
    const translate = async (text: string) => {
        if (language === 'en') return text;
        return await autoTranslate(text);
    };
    
    return translate;
};
`;
}

if (require.main === module) {
    autoTranslate().catch(console.error);
}

module.exports = { autoTranslate, translateText };