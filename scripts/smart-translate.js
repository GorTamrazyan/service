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

function extractExistingTranslations(content) {
    const translations = { en: {}, ru: {}, hy: {} };
    
    const languages = ['en', 'ru', 'hy'];
    
    languages.forEach(lang => {
        const regex = new RegExp(`${lang}:\\s*{([\\s\\S]*?)}(?=,\\s*(?:en|ru|hy):|\\s*}\\s*;)`, 'm');
        const match = content.match(regex);
        
        if (match) {
            const section = match[1];
            const keyValuePairs = section.match(/"[^"]*":\s*"[^"]*"/g);
            
            if (keyValuePairs) {
                keyValuePairs.forEach(pair => {
                    const [key, value] = pair.match(/"([^"]*)"/g);
                    const cleanKey = key.replace(/"/g, '');
                    const cleanValue = value.replace(/"/g, '');
                    translations[lang][cleanKey] = cleanValue;
                });
            }
        }
    });
    
    return translations;
}

async function smartTranslate() {
    const contextPath = path.join(__dirname, '../app/contexts/LanguageContext.tsx');
    const content = fs.readFileSync(contextPath, 'utf8');
    
    console.log('🧠 Анализирую существующие переводы...');
    const existingTranslations = extractExistingTranslations(content);
    
    const allEnglishKeys = Object.keys(existingTranslations.en);
    console.log(`📝 Найдено ${allEnglishKeys.length} английских ключей`);
    
    const languages = {
        ru: 'ru',
        hy: 'hy'
    };
    
    let translated = false;
    
    for (const [langCode, googleLangCode] of Object.entries(languages)) {
        console.log(`\n🔍 Проверяю переводы для ${langCode.toUpperCase()}:`);
        
        const existingKeys = Object.keys(existingTranslations[langCode]);
        const missingKeys = allEnglishKeys.filter(key => !existingKeys.includes(key));
        
        if (missingKeys.length === 0) {
            console.log(`✅ Все переводы для ${langCode.toUpperCase()} уже существуют`);
            continue;
        }
        
        console.log(`🆕 Нужно перевести ${missingKeys.length} новых ключей:`);
        
        for (const key of missingKeys) {
            const englishText = existingTranslations.en[key];
            console.log(`  📍 ${key}: "${englishText}"`);
            
            try {
                const translatedText = await translateText(englishText, googleLangCode);
                existingTranslations[langCode][key] = translatedText;
                console.log(`  ✅ -> "${translatedText}"`);
                translated = true;
                
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`  ❌ Ошибка перевода: ${error.message}`);
                existingTranslations[langCode][key] = englishText; 
            }
        }
    }
    
    if (!translated) {
        console.log('\n🎉 Все переводы актуальны! Новых переводов не требуется.');
        return;
    }
    
    fs.copyFileSync(contextPath, contextPath + '.backup');
    console.log('\n💾 Создана резервная копия: LanguageContext.tsx.backup');
    
    const newContent = generateUpdatedLanguageContext(content, existingTranslations);
    fs.writeFileSync(contextPath, newContent, 'utf8');
    
    console.log('✅ Файл обновлен с новыми переводами!');
    console.log('🔧 Существующие переводы сохранены без изменений');
}

function generateUpdatedLanguageContext(originalContent, translations) {
    const formatTranslations = (obj) => {
        return Object.entries(obj)
            .sort(([a], [b]) => a.localeCompare(b)) 
            .map(([key, value]) => `        "${key}": "${value.replace(/"/g, '\\"')}"`)
            .join(',\n');
    };
    
    let updatedContent = originalContent;
    
    ['en', 'ru', 'hy'].forEach(lang => {
        const regex = new RegExp(`(${lang}:\\s*{)([\\s\\S]*?)(}(?=,\\s*(?:en|ru|hy):|\\s*}\\s*;))`, 'm');
        const replacement = `$1\n${formatTranslations(translations[lang])}\n    $3`;
        updatedContent = updatedContent.replace(regex, replacement);
    });
    
    return updatedContent;
}

function addNewKey(key, englishText) {
    const contextPath = path.join(__dirname, '../app/contexts/LanguageContext.tsx');
    const content = fs.readFileSync(contextPath, 'utf8');
    
    const existingTranslations = extractExistingTranslations(content);
    
    existingTranslations.en[key] = englishText;
    
    console.log(`➕ Добавлен новый ключ: ${key} = "${englishText}"`);
    console.log('🚀 Запустите npm run translate для автоперевода');
    
    const newContent = generateUpdatedLanguageContext(content, existingTranslations);
    fs.writeFileSync(contextPath, newContent, 'utf8');
}

module.exports = { smartTranslate, addNewKey, translateText };

if (require.main === module) {
    
    const args = process.argv.slice(2);
    
    if (args[0] === 'add' && args[1] && args[2]) {
        addNewKey(args[1], args[2]);
    } else {
        smartTranslate().catch(console.error);
    }
}