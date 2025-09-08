const fs = require('fs');
const path = require('path');

// Умный переводчик - сохраняет существующие переводы
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

// Извлекает переводы из существующего файла
function extractExistingTranslations(content) {
    const translations = { en: {}, ru: {}, hy: {} };
    
    // Извлекаем каждый язык отдельно
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

// Умный перевод - переводит только отсутствующие ключи
async function smartTranslate() {
    const contextPath = path.join(__dirname, '../app/contexts/LanguageContext.tsx');
    const content = fs.readFileSync(contextPath, 'utf8');
    
    console.log('🧠 Анализирую существующие переводы...');
    const existingTranslations = extractExistingTranslations(content);
    
    // Находим все английские ключи
    const allEnglishKeys = Object.keys(existingTranslations.en);
    console.log(`📝 Найдено ${allEnglishKeys.length} английских ключей`);
    
    const languages = {
        ru: 'ru',
        hy: 'hy'
    };
    
    let translated = false;
    
    // Переводим только отсутствующие ключи
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
                
                // Задержка чтобы не перегрузить API
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`  ❌ Ошибка перевода: ${error.message}`);
                existingTranslations[langCode][key] = englishText; // fallback
            }
        }
    }
    
    if (!translated) {
        console.log('\n🎉 Все переводы актуальны! Новых переводов не требуется.');
        return;
    }
    
    // Создаем резервную копию
    fs.copyFileSync(contextPath, contextPath + '.backup');
    console.log('\n💾 Создана резервная копия: LanguageContext.tsx.backup');
    
    // Генерируем обновленный файл
    const newContent = generateUpdatedLanguageContext(content, existingTranslations);
    fs.writeFileSync(contextPath, newContent, 'utf8');
    
    console.log('✅ Файл обновлен с новыми переводами!');
    console.log('🔧 Существующие переводы сохранены без изменений');
}

// Генерирует обновленный контент, сохраняя структуру файла
function generateUpdatedLanguageContext(originalContent, translations) {
    const formatTranslations = (obj) => {
        return Object.entries(obj)
            .sort(([a], [b]) => a.localeCompare(b)) // сортируем ключи
            .map(([key, value]) => `        "${key}": "${value.replace(/"/g, '\\"')}"`)
            .join(',\n');
    };
    
    // Заменяем только секции переводов, оставляя остальной код без изменений
    let updatedContent = originalContent;
    
    ['en', 'ru', 'hy'].forEach(lang => {
        const regex = new RegExp(`(${lang}:\\s*{)([\\s\\S]*?)(}(?=,\\s*(?:en|ru|hy):|\\s*}\\s*;))`, 'm');
        const replacement = `$1\n${formatTranslations(translations[lang])}\n    $3`;
        updatedContent = updatedContent.replace(regex, replacement);
    });
    
    return updatedContent;
}

// Функция для добавления новых ключей (для использования в разработке)
function addNewKey(key, englishText) {
    const contextPath = path.join(__dirname, '../app/contexts/LanguageContext.tsx');
    const content = fs.readFileSync(contextPath, 'utf8');
    
    const existingTranslations = extractExistingTranslations(content);
    
    // Добавляем новый ключ
    existingTranslations.en[key] = englishText;
    
    console.log(`➕ Добавлен новый ключ: ${key} = "${englishText}"`);
    console.log('🚀 Запустите npm run translate для автоперевода');
    
    // Обновляем файл
    const newContent = generateUpdatedLanguageContext(content, existingTranslations);
    fs.writeFileSync(contextPath, newContent, 'utf8');
}

// Экспортируем функции
module.exports = { smartTranslate, addNewKey, translateText };

// Запускаем если файл вызван напрямую
if (require.main === module) {
    // Проверяем аргументы командной строки
    const args = process.argv.slice(2);
    
    if (args[0] === 'add' && args[1] && args[2]) {
        addNewKey(args[1], args[2]);
    } else {
        smartTranslate().catch(console.error);
    }
}