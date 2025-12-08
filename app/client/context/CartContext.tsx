// app/client/context/CartContext.tsx
"use client";

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import { useAuthState } from "../../hooks/useAuthState";
import type { Color } from "../../lib/firebase/products/types";



// Интерфейс для продукта в корзине
interface CartItem {
    id: string;
    name: string;
    price: string;
    imageUrl: string | null;
    quantity: number;
    color: Color | null;
    height: number;
    length:number;
}

// Интерфейс для значений контекста корзины
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: {
        id: string;
        name: string;
        price: string;
        imageUrl: string | null;
        color: Color | null;
        height: number;
        length: number; 
    }) => void;
    removeFromCart: (id: string, colorId?:string) => void;
    updateQuantity: (id: string, newQuantity: number,colorId?:string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    isAuthenticated: boolean;
    requiresAuth: (action: string) => boolean;
}

// Создаем контекст с значениями по умолчанию
const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    // Инициализируем состояние корзины как пустой массив на сервере.
    // Фактические данные из localStorage будут загружены только на клиенте.
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isClient, setIsClient] = useState(false); // <--- Добавляем состояние для проверки клиента
    const [user, loading] = useAuthState();

    // Этот useEffect выполняется только на клиенте после монтирования
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart);
                    // Преобразуем даты обратно в объекты Date при загрузке
                    const cartWithDates = parsedCart.map((item: any) => ({
                        ...item,
                        color: item.color ? {
                            ...item.color,
                            createdAt: item.color.createdAt ? new Date(item.color.createdAt) : undefined,
                            updatedAt: item.color.updatedAt ? new Date(item.color.updatedAt) : undefined
                        } : null
                    }));
                    setCartItems(cartWithDates);
                } catch (error) {
                    console.error('Error parsing cart from localStorage:', error);
                    setCartItems([]);
                }
            }
            setIsClient(true); // <--- Устанавливаем isClient в true
        }
    }, []); // Пустой массив зависимостей, выполняется один раз при монтировании

    // Эффект для сохранения корзины в localStorage при каждом изменении
    // Он должен запускаться только после того, как isClient станет true
    useEffect(() => {
        if (isClient) {
            // <--- Сохраняем только после гидрации
            try {
                localStorage.setItem("cart", JSON.stringify(cartItems));
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
        }
    }, [cartItems, isClient]); // Зависит от cartItems и isClient

    // Проверка авторизации
    const isAuthenticated = !loading && !!user;

    // Функция для определения, требует ли действие авторизации
    const requiresAuth = (action: string) => {
        const actionsRequiringAuth = ['addToCart', 'removeFromCart', 'updateQuantity', 'clearCart'];
        return actionsRequiringAuth.includes(action);
    };

    // Функция для показа предупреждения о необходимости авторизации
    const showAuthRequired = () => {
        alert('Для добавления товаров в корзину необходимо войти в аккаунт или зарегистрироваться');
        // Перенаправляем на страницу входа
        window.location.href = '/client/sign-in';
    };

    // Добавление продукта в корзину
    const addToCart = useCallback(
        (product: {
            id: string;
            name: string;
            price: string;
            imageUrl: string | null;
            color: Color | null;
            height: number;
            length: number;
        }) => {
            if (!isAuthenticated) {
                showAuthRequired();
                return;
            }

            setCartItems((prevItems) => {
                // Создаем уникальный ключ для товара с учетом цвета
                const itemKey = product.color
                    ? `${product.id}-${product.color.id}`
                    : product.id;

                const existingItemIndex = prevItems.findIndex((item) => {
                    const existingItemKey = item.color
                        ? `${item.id}-${item.color.id}`
                        : item.id;
                    return existingItemKey === itemKey;
                });

                if (existingItemIndex !== -1) {
                    // Если товар с таким цветом уже есть, увеличиваем количество
                    return prevItems.map((item, index) =>
                        index === existingItemIndex
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    // Добавляем новый товар
                    return [...prevItems, { ...product, quantity: 1 }];
                }
            });
        },
        [isAuthenticated]
    );

    const removeFromCart = useCallback(
        (id: string, colorId?: string) => {
            if (!isAuthenticated) {
                showAuthRequired();
                return;
            }

            setCartItems((prevItems) =>
                prevItems.filter(
                    (item) => item.id !== id || item.color?.id !== colorId
                )
            );
        },
        [isAuthenticated, showAuthRequired]
    );

    const updateQuantity = useCallback(
        (id: string, newQuantity: number,colorId?: string) => {
            if (!isAuthenticated) {
                showAuthRequired();
                return;
            }

            setCartItems((prevItems) => {
                if (newQuantity <= 0) {
                    return prevItems.filter(
                        (item) => item.id !== id || item.color?.id !== colorId
                    );
                }

                return prevItems.map((item) =>
                    item.id === id && item.color?.id === colorId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            });
        },
        [isAuthenticated, showAuthRequired]
    );

    // Очистка всей корзины
    const clearCart = useCallback(() => {
        if (!isAuthenticated) {
            showAuthRequired();
            return;
        }

        setCartItems([]);
    }, [isAuthenticated]);

    // Получение количества уникальных типов товаров (не общее количество)
    const getTotalItems = useCallback(() => {
        // Возвращаем 0, если мы еще не на клиенте (до гидрации)
        // чтобы сервер и клиент рендерили одно и то же значение по умолчанию
        return isClient ? cartItems.length : 0;
    }, [cartItems, isClient]);

    // Получение общей стоимости
    const getTotalPrice = useCallback(() => {
        // Возвращаем 0, если мы еще не на клиенте (до гидрации)
        return isClient
            ? cartItems.reduce(
                  (total, item) =>
                      total + parseFloat(item.price) * item.quantity,
                  0
              )
            : 0;
    }, [cartItems, isClient]);

    // Значения, которые будут доступны через контекст
    const contextValue = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isAuthenticated,
        requiresAuth,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

// Хук для удобного использования контекста корзины
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};