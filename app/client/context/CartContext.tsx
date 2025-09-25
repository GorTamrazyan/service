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

// Интерфейс для продукта в корзине
interface CartItem {
    id: string;
    name: string;
    price: string;
    imageUrl: string | null;
    quantity: number;
}

// Интерфейс для значений контекста корзины
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: {
        id: string;
        name: string;
        price: string;
        imageUrl: string | null;
    }) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, newQuantity: number) => void;
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
                setCartItems(JSON.parse(savedCart));
            }
            setIsClient(true); // <--- Устанавливаем isClient в true
        }
    }, []); // Пустой массив зависимостей, выполняется один раз при монтировании

    // Эффект для сохранения корзины в localStorage при каждом изменении
    // Он должен запускаться только после того, как isClient станет true
    useEffect(() => {
        if (isClient) {
            // <--- Сохраняем только после гидрации
            localStorage.setItem("cart", JSON.stringify(cartItems));
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
        }) => {
            if (!isAuthenticated) {
                showAuthRequired();
                return;
            }

            setCartItems((prevItems) => {
                const existingItem = prevItems.find(
                    (item) => item.id === product.id
                );
                if (existingItem) {
                    return prevItems.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevItems, { ...product, quantity: 1 }];
                }
            });
        },
        [isAuthenticated]
    );

    // Удаление продукта из корзины (полностью)
    const removeFromCart = useCallback((id: string) => {
        if (!isAuthenticated) {
            showAuthRequired();
            return;
        }

        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }, [isAuthenticated]);

    // Обновление количества продукта
    const updateQuantity = useCallback((id: string, newQuantity: number) => {
        if (!isAuthenticated) {
            showAuthRequired();
            return;
        }

        setCartItems((prevItems) => {
            if (newQuantity <= 0) {
                return prevItems.filter((item) => item.id !== id); // Удаляем, если количество <= 0
            }
            return prevItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            );
        });
    }, [isAuthenticated]);

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
