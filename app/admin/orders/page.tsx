// app/admin/orders/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
    getAllOrders,
    updateOrderStatus,
    Order,
    Product,
} from "../../lib/firebase/orders";
// ... (Остальной код из вашего файла page.tsx, он корректен) ...
import { ShoppingBag, Package, Truck, Eye } from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
        checkUrlForOrder();
    }, []);

    // Функция для проверки URL параметров
    const checkUrlForOrder = () => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const orderIdToShow = urlParams.get("showOrder");

            if (orderIdToShow) {
                // Сохраняем ID заказа для открытия после загрузки данных
                sessionStorage.setItem("pendingOrderToShow", orderIdToShow);

                // Очищаем URL параметр
                const url = new URL(window.location.href);
                url.searchParams.delete("showOrder");
                window.history.replaceState({}, "", url.toString());
            }
        }
    };

    const fetchOrders = async () => {
        try {
            const allOrders = await getAllOrders();
            setOrders(allOrders);

            // После загрузки заказов проверяем, нужно ли открыть модальное окно
            if (typeof window !== "undefined") {
                const pendingOrderId =
                    sessionStorage.getItem("pendingOrderToShow");
                if (pendingOrderId) {
                    const order = allOrders.find(
                        (order) => order.id === pendingOrderId
                    );
                    if (order) {
                        setSelectedOrder(order);
                        setShowModal(true);
                    }
                    sessionStorage.removeItem("pendingOrderToShow");
                }
            }
        } catch (error) {
            console.error("Ошибка при загрузке заказов:", error);
        } finally {
            setLoading(false);
        }
    };
    // ... (Остальные функции handleStatusUpdate, getStatusColor, getOrderStats)
    const handleStatusUpdate = async (
        orderId: string,
        newStatus: Order["status"]
    ) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(
                orders.map((order) =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500";
            case "confirmed":
                return "bg-blue-500";
            case "shipped":
                return "bg-purple-500";
            case "delivered":
                return "bg-green-500";
            case "cancelled":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getOrderStats = () => {
        const total = orders.length;
        const pending = orders.filter(
            (order) => order.status === "pending"
        ).length;
        const delivered = orders.filter(
            (order) => order.status === "delivered"
        ).length;
        const revenue = orders
            .filter((order) => order.status === "delivered")
            .reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
        return { total, pending, delivered, revenue };
    };

    const stats = getOrderStats();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-info)]"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
                    Order Management
                </h1>
                <p className="text-[var(--color-gray-600)]">
                    Manage and track all customer orders
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-[var(--color-info)] rounded-lg p-3">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-[var(--color-gray-600)]">
                                Total Orders
                            </p>
                            <p className="text-2xl font-bold text-[var(--color-text)]">
                                {stats.total}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-[var(--color-warning)] rounded-lg p-3">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-[var(--color-gray-600)]">
                                Pending
                            </p>
                            <p className="text-2xl font-bold text-[var(--color-text)]">
                                {stats.pending}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-[var(--color-success)] rounded-lg p-3">
                            <Truck className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-[var(--color-gray-600)]">
                                Delivered
                            </p>
                            <p className="text-2xl font-bold text-[var(--color-text)]">
                                {stats.delivered}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-[var(--color-accent)] rounded-lg p-3">
                            <span className="text-white font-bold">$</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-[var(--color-gray-600)]">
                                Revenue
                            </p>
                            <p className="text-2xl font-bold text-[var(--color-text)]">
                                ${stats.revenue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[var(--color-card-bg)] rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)]">
                    <h3 className="text-lg font-medium text-[var(--color-text)]">
                        All Orders
                    </h3>
                </div>

                {orders.length === 0 ? (
                    <div className="p-16 text-center">
                        <ShoppingBag className="w-12 h-12 text-[var(--color-gray-500)] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">
                            No orders yet
                        </h3>
                        <p className="text-[var(--color-gray-500)]">
                            Orders will appear here once customers place them.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[var(--color-border)]">
                            <thead className="bg-[var(--color-gray-50)]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gray-500)] uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-[var(--color-card-bg)] divide-y divide-[var(--color-border)]">
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-[var(--color-gray-50)]"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text)]">
                                            #{order.id?.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                                            <div>
                                                <div className="font-medium">
                                                    {order.customerInfo.name}
                                                </div>
                                                <div className="text-[var(--color-gray-500)]">
                                                    {order.customerInfo.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                                            {order.createdAt.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text)]">
                                            ${order.totalPrice}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    order.id &&
                                                    handleStatusUpdate(
                                                        order.id,
                                                        e.target
                                                            .value as Order["status"]
                                                    )
                                                }
                                                className={`px-3 py-1 rounded-full text-xs font-medium text-white border-none ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                <option value="pending">
                                                    Pending
                                                </option>
                                                <option value="confirmed">
                                                    Confirmed
                                                </option>
                                                <option value="shipped">
                                                    Shipped
                                                </option>
                                                <option value="delivered">
                                                    Delivered
                                                </option>
                                                <option value="cancelled">
                                                    Cancelled
                                                </option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowModal(true);
                                                }}
                                                className="text-[var(--color-info)] hover:opacity-80 mr-3"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-[var(--color-modal-overlay)] flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-card-bg)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-[var(--color-text)]">
                                    Order Details #{selectedOrder.id?.slice(-8)}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="bg-[var(--color-gray-50)] rounded-lg p-4">
                                    <h3 className="font-semibold text-[var(--color-text)] mb-3">
                                        Customer Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">
                                                Name:
                                            </span>{" "}
                                            {selectedOrder.customerInfo.name}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Email:
                                            </span>{" "}
                                            {selectedOrder.customerInfo.email}
                                        </div>
                                        {selectedOrder.customerInfo.phone && (
                                            <div>
                                                <span className="font-medium">
                                                    Phone:
                                                </span>{" "}
                                                {
                                                    selectedOrder.customerInfo
                                                        .phone
                                                }
                                            </div>
                                        )}
                                        <div className="md:col-span-2">
                                            <span className="font-medium">
                                                Address:
                                            </span>{" "}
                                            {selectedOrder.customerInfo.address}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 className="font-semibold text-[var(--color-text)] mb-3">
                                        Order Items
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedOrder.products.map(
                                            (
                                                product: Product,
                                                index: number
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center bg-[var(--color-gray-50)] rounded p-3"
                                                >
                                                    <div>
                                                        <span className="font-medium">
                                                            {product.name}
                                                        </span>
                                                        <span className="text-[var(--color-gray-500)] ml-2">
                                                            × {product.quantity}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium">
                                                        $
                                                        {(
                                                            parseFloat(
                                                                product.price
                                                            ) * product.quantity
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="border-t pt-3 mt-3">
                                        <div className="flex justify-between items-center font-bold text-lg">
                                            <span>Total:</span>
                                            <span>
                                                ${selectedOrder.totalPrice}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div className="bg-[var(--color-gray-50)] rounded-lg p-4">
                                    <h3 className="font-semibold text-[var(--color-text)] mb-3">
                                        Order Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">
                                                Order Date:
                                            </span>{" "}
                                            {selectedOrder.createdAt.toLocaleDateString()}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Status:
                                            </span>
                                            <span
                                                className={`ml-2 px-2 py-1 rounded text-xs text-white ${getStatusColor(
                                                    selectedOrder.status
                                                )}`}
                                            >
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-[var(--color-gray-200)] text-[var(--color-gray-800)] rounded hover:bg-[var(--color-gray-300)]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
