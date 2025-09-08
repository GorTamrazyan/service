# 🌍 Система Автоматического Перевода

## ✅ Что реализовано:

### 🎯 Полная система перевода:
- **Автоматический перевод** всех текстов в реальном времени
- **Поддержка 3 языков**: English 🇺🇸, Русский 🇷🇺, Հայերեն 🇦🇲  
- **Умное кэширование** переводов
- **Fallback к ключам** если перевод не найден

### 🚀 Компоненты для разработчиков:

#### 1. Компонент `<T>`
Самый простой способ сделать текст переводимым:

```tsx
import { T } from "../components/T";

// Автоматически переводится на текущий язык
<h1><T>Welcome to our website</T></h1>

// С дополнительными опциями
<T as="p" className="text-lg">Hello world!</T>
```

#### 2. Хук `useLanguage()`
Для программного управления:

```tsx
import { useLanguage } from "../contexts/LanguageContext";

function MyComponent() {
    const { t, language, setLanguage, autoTranslate } = useLanguage();
    
    // Перевод по ключу (из LanguageContext)
    const text = t('header.home');
    
    // Автоматический перевод любого текста
    const translated = await autoTranslate("Any english text");
    
    return <div>{text}</div>;
}
```

### 🔧 Управление языками:

#### Через DevTools Console:
```javascript
// Переключить язык (откройте DevTools)
setLanguage("ru")  // русский
setLanguage("hy")  // армянский  
setLanguage("en")  // английский
```

#### Программно:
```tsx
const { setLanguage } = useLanguage();
setLanguage("ru");
```

### 📝 Добавление новых переводов:

#### 1. Добавить новый ключ:
```bash
npm run translate:add "новый.ключ" "New English text"
```

#### 2. Автоматически перевести новые ключи:
```bash
npm run translate
```

#### 3. Или просто используйте компонент `<T>`:
```tsx
// Это автоматически переведется на текущий язык!
<T>Any new text in English</T>
```

## 🎉 Особенности:

### ✨ **Автоматическое определение**
- Сначала ищет перевод в `LanguageContext`
- Если не найдено - автоматически переводит через Google Translate API
- Кэширует результат для быстрой работы

### 🧠 **Умная система**
- **Сохраняет ручные переводы** - никогда не перезаписывает качественные переводы
- **Переводит только новые ключи** - не тратит время на уже переведенное
- **Fallback к английскому** - если перевод не удался

### 🔄 **В реальном времени**
- Язык меняется **мгновенно** по всему приложению
- Сохраняется в `localStorage` - запоминает выбор пользователя
- Работает на всех страницах автоматически

## 💡 Примеры использования:

### Простой текст:
```tsx
<T>Hello World</T>
// → "Привет, мир" (ru) | "Բարեւ աշխարհ" (hy)
```

### Заголовки:
```tsx
<T as="h1" className="text-4xl font-bold">Welcome to our store</T>
```

### Сложные компоненты:
```tsx
function ProductCard({ product }) {
    return (
        <div>
            <T as="h3">{product.name}</T>
            <T as="p">{product.description}</T>
            <button><T>Add to cart</T></button>
        </div>
    );
}
```

### Динамический перевод:
```tsx
function MyComponent() {
    const { autoTranslate } = useLanguage();
    const [translatedText, setTranslatedText] = useState("");
    
    useEffect(() => {
        autoTranslate("Some dynamic text").then(setTranslatedText);
    }, []);
    
    return <p>{translatedText}</p>;
}
```

## 🚀 Команды для управления:

```bash
# Перевести только новые ключи (сохраняет ручные переводы)
npm run translate

# Добавить новый ключ с переводом
npm run translate:add "settings.newFeature" "New Feature"

# Запустить приложение
npm run dev
```

## 📋 Список переведенных страниц:

✅ **Header** - навигация и поиск  
✅ **Home Page** - главная страница  
✅ **Products Page** - страница товаров  
✅ **About Page** - о нас  
✅ **Services Page** - услуги  
✅ **Profile Components** - компоненты профиля  

## 🎯 Результат:

**Любой новый текст, который вы добавите, будет автоматически переводиться!** Просто оберните его в компонент `<T>` и он будет работать на всех языках без дополнительных настроек.

---

**Готово! 🎉** Система полного автоматического перевода настроена и работает!