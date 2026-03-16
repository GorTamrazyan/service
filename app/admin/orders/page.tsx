"use client";

import React, { useState, useEffect } from "react";
import {
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    Order,
} from "../../lib/firebase/orders";
import { Product } from "../../lib/firebase/orders";
import { Eye, Trash2 } from "lucide-react";
import AdminProtection from "../components/AdminProtection";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const fetchedOrders = await getAllOrders();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (
        orderId: string,
        newStatus: Order["status"],
    ) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            await loadOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await deleteOrder(orderId);
                await loadOrders();
            } catch (error) {
                console.error("Error deleting order:", error);
            }
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
            case "scheduled":
                return "bg-indigo-500";
            case "completed":
                return "bg-teal-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <AdminProtection>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
                    Orders Management
                </h1>

                {loading ? (
                    <div className="text-center py-8">Loading orders...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-[var(--color-background)] rounded-lg overflow-hidden">
                            <thead className="bg-[var(--color-secondary)]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text)] uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text)] uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text)] uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text)] uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text)] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text)] uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-text)]/10">
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                                            #{order.id?.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                                            {order.customerInfo.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text)]">
                                            ${order.totalPrice}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                                            {order.createdAt.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        order.id!,
                                                        e.target
                                                            .value as Order["status"],
                                                    )
                                                }
                                                className={`px-3 py-1 rounded-full text-xs font-medium text-white border-none ${getStatusColor(
                                                    order.status,
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

                                {selectedOrder.products &&
                                    selectedOrder.products.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-[var(--color-text)] mb-3">
                                                Products
                                            </h3>
                                            <div className="space-y-2">
                                                {selectedOrder.products.map(
                                                    (
                                                        product: Product,
                                                        index: number,
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center bg-[var(--color-gray-50)] rounded p-3"
                                                        >
                                                            <div>
                                                                <span className="font-medium">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </span>
                                                                <span className="text-[var(--color-gray-500)] ml-2">
                                                                    ×{" "}
                                                                    {
                                                                        product.quantity
                                                                    }
                                                                </span>
                                                            </div>
                                                            <span className="font-medium">
                                                                $
                                                                {(
                                                                    parseFloat(
                                                                        product.price,
                                                                    ) *
                                                                    product.quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {selectedOrder.services &&
                                    selectedOrder.services.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-[var(--color-text)] mb-3">
                                                Services
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedOrder.services.map(
                                                    (service, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-green-50 border border-green-200 rounded-lg p-4"
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="font-semibold text-green-900">
                                                                        {
                                                                            service.serviceName
                                                                        }
                                                                    </h4>
                                                                    <span className="inline-block mt-1 px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
                                                                        {
                                                                            service.serviceType
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <span className="font-bold text-green-900">
                                                                    $
                                                                    {service.price.toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {service.description && (
                                                                <p className="text-sm text-green-700 mt-2">
                                                                    {
                                                                        service.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Total:</span>
                                        <span className="text-[var(--color-primary)]">
                                            ${selectedOrder.totalPrice}
                                        </span>
                                    </div>
                                </div>

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
                                                    selectedOrder.status,
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
        </AdminProtection>
    );
}
