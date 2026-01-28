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
import { useProfile } from "../../hooks/useProfile";
import { createOrder } from "../../lib/firebase/orders";
import type { Color } from "../../lib/firebase/products/types";
import { sendOrderEmail } from "../../lib/email/helpers";



// Интерфейс для продукта в корзине
export interface CartItem {
    id: string;
    name: string;
    price: string;
    imageUrl: string | null;
    quantity: number;
    type: 'product' | 'consultation' | 'service'; // Тип элемента
    // Поля для продуктов
    color?: Color | null;
    height?: number;
    length?: number;
    // Поля для консультаций
    duration?: number; // Продолжительность в минутах
    features?: string[]; // Что включено в консультацию
    // Поля для услуг
    description?: string; // Описание услуги
    serviceType?: 'delivery' | 'installation' | 'assembly' | 'other'; // Тип услуги
}

// Интерфейс для информации о клиенте
export interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
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
    addConsultationToCart: (consultation: {
        id: string;
        name: string;
        price: number;
        duration: number;
        features: string[];
    }) => void;
    addServiceToCart: (service: {
        id: string;
        name: string;
        price: number;
        description: string;
        serviceType?: 'delivery' | 'installation' | 'assembly' | 'other';
    }) => void;
    removeFromCart: (id: string, colorId?:string) => void;
    updateQuantity: (id: string, newQuantity: number,colorId?:string) => void;
    incrementQuantity: (id: string, currentQuantity: number, colorId?: string) => void;
    decrementQuantity: (id: string, currentQuantity: number, colorId?: string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    isAuthenticated: boolean;
    requiresAuth: (action: string) => boolean;
    // Checkout functionality
    showCheckoutModal: boolean;
    customerInfo: CustomerInfo;
    isSubmitting: boolean;
    orderSuccess: boolean;
    openCheckoutModal: () => void;
    closeCheckoutModal: () => void;
    updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
    handleSubmitOrder: (e: React.FormEvent) => Promise<void>;
    resetOrderSuccess: () => void;
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
    const { profile } = useProfile();

    // Checkout states
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

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
                    if (item.type !== 'product') return false;
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
                    return [...prevItems, { ...product, quantity: 1, type: 'product' }];
                }
            });
        },
        [isAuthenticated]
    );

    // Добавление консультации в корзину
    const addConsultationToCart = useCallback(
        (consultation: {
            id: string;
            name: string;
            price: number;
            duration: number;
            features: string[];
        }) => {
            if (!isAuthenticated) {
                showAuthRequired();
                return;
            }

            setCartItems((prevItems) => {
                // Проверяем, есть ли уже такая консультация в корзине
                const existingItemIndex = prevItems.findIndex(
                    (item) => item.type === 'consultation' && item.id === consultation.id
                );

                if (existingItemIndex !== -1) {
                    // Консультации не увеличиваются в количестве, просто уведомляем
                    alert('This consultation is already in your cart');
                    return prevItems;
                } else {
                    // Добавляем новую консультацию
                    return [
                        ...prevItems,
                        {
                            id: consultation.id,
                            name: consultation.name,
                            price: consultation.price.toString(),
                            imageUrl: null,
                            quantity: 1,
                            type: 'consultation',
                            duration: consultation.duration,
                            features: consultation.features,
                        },
                    ];
                }
            });
        },
        [isAuthenticated]
    );

    // Добавление услуги в корзину
    const addServiceToCart = useCallback(
        (service: {
            id: string;
            name: string;
            price: number;
            description: string;
            serviceType?: 'delivery' | 'installation' | 'assembly' | 'other';
        }) => {
            if (!isAuthenticated) {
                showAuthRequired();
                return;
            }

            setCartItems((prevItems) => {
                // Проверяем, есть ли уже такая услуга в корзине
                const existingItemIndex = prevItems.findIndex(
                    (item) => item.type === 'service' && item.id === service.id
                );

                if (existingItemIndex !== -1) {
                    // Увеличиваем количество услуги
                    return prevItems.map((item, index) =>
                        index === existingItemIndex
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    // Добавляем новую услугу
                    return [
                        ...prevItems,
                        {
                            id: service.id,
                            name: service.name,
                            price: service.price.toString(),
                            imageUrl: null,
                            quantity: 1,
                            type: 'service',
                            description: service.description,
                            serviceType: service.serviceType || 'other',
                        },
                    ];
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

    // Увеличение количества товара
    const incrementQuantity = useCallback(
        (id: string, currentQuantity: number, colorId?: string) => {
            if (currentQuantity < 100) {
                updateQuantity(id, currentQuantity + 1, colorId);
            }
        },
        [updateQuantity]
    );

    // Уменьшение количества товара
    const decrementQuantity = useCallback(
        (id: string, currentQuantity: number, colorId?: string) => {
            if (currentQuantity > 1) {
                updateQuantity(id, currentQuantity - 1, colorId);
            }
        },
        [updateQuantity]
    );

    // Открытие модального окна оформления заказа
    const openCheckoutModal = useCallback(() => {
        if (profile) {
            const fullAddress = `${profile.address.city}, ${
                profile.address.street
            } ${profile.address.houseNumber}${
                profile.address.apartmentNumber
                    ? `, apt. ${profile.address.apartmentNumber}`
                    : ""
            }, ${profile.address.zipCode}`.trim();

            setCustomerInfo({
                name: `${profile.firstName} ${profile.lastName}`.trim() || "",
                email: profile.email || user?.email || "",
                phone: profile.phone || "",
                address: fullAddress || "",
            });
        } else {
            setCustomerInfo({
                name: "",
                email: user?.email || "",
                phone: "",
                address: "",
            });
        }
        setShowCheckoutModal(true);
    }, [profile, user]);

    // Закрытие модального окна
    const closeCheckoutModal = useCallback(() => {
        setShowCheckoutModal(false);
    }, []);

    // Обновление информации о клиенте
    const updateCustomerInfo = useCallback((info: Partial<CustomerInfo>) => {
        setCustomerInfo((prev) => ({ ...prev, ...info }));
    }, []);

    // Сброс состояния успешного заказа
    const resetOrderSuccess = useCallback(() => {
        setOrderSuccess(false);
    }, []);

    // Обработка отправки заказа
    const handleSubmitOrder = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!user) return;

            setIsSubmitting(true);
            try {
                const hasProducts = cartItems.some(
                    (item) => item.type === "product"
                );
                const hasServices = cartItems.some(
                    (item) => item.type === "service"
                );

                const productItems = cartItems.filter(
                    (item) => item.type === "product"
                );
                const serviceItems = cartItems.filter(
                    (item) => item.type === "service"
                );

                const orderData = {
                    userId: user.uid,
                    type:
                        hasServices && !hasProducts
                            ? ("service" as const)
                            : ("product" as const),
                    products: productItems.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        color: item.color?.hexCode,
                    })),
                    services:
                        serviceItems.length > 0
                            ? serviceItems.map((item) => ({
                                  serviceType:
                                      item.serviceType || ("other" as const),
                                  serviceName: item.name,
                                  description: item.description || "",
                                  price: parseFloat(item.price),
                              }))
                            : undefined,
                    totalPrice: getTotalPrice().toFixed(2),
                    status: "pending" as const,
                    customerInfo,
                };

                const orderId = await createOrder(orderData);

                // Отправляем email подтверждение заказа
                try {
                    await sendOrderEmail({
                        orderId: orderId || 'unknown',
                        customerEmail: customerInfo.email,
                        customerName: customerInfo.name,
                        items: productItems.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price
                        })),
                        totalPrice: getTotalPrice().toFixed(2),
                        shippingAddress: customerInfo.address
                    });
                    console.log("✅ Order confirmation email sent");
                } catch (emailError) {
                    console.error("⚠️ Error sending order confirmation email:", emailError);
                    // Не прерываем процесс - заказ уже создан
                }

                clearCart();
                setShowCheckoutModal(false);
                setOrderSuccess(true);
            } catch (error) {
                console.error("Error creating order:", error);
                alert("There was an error placing your order. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        },
        [user, cartItems, getTotalPrice, customerInfo, clearCart]
    );

    // Значения, которые будут доступны через контекст
    const contextValue = {
        cartItems,
        addToCart,
        addConsultationToCart,
        addServiceToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isAuthenticated,
        requiresAuth,
        // Checkout
        showCheckoutModal,
        customerInfo,
        isSubmitting,
        orderSuccess,
        openCheckoutModal,
        closeCheckoutModal,
        updateCustomerInfo,
        handleSubmitOrder,
        resetOrderSuccess,
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