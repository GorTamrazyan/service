"use client";

import React, { useState, useEffect } from "react";
import {
    ShoppingBag,
    Calendar,
    Package,
    Truck,
    Eye,
    Video,
    RefreshCw,
    Wrench,
} from "lucide-react";
import { T } from "../../T";
import Link from "next/link";
import { getUserOrders } from "../../../../lib/firebase/orders";
import { useAuthState } from "../../../../hooks/useAuthState";
import { Order } from "../../../../lib/firebase/orders";

export default function OrdersPanel() {
    const [user] = useAuthState();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        console.log("OrdersPanel: user =", user);
        if (user) {
            try {
                console.log("OrdersPanel: fetching orders for user", user.uid);
                const userOrders = await getUserOrders(user.uid);
                console.log("OrdersPanel: received orders =", userOrders);
                setOrders(userOrders);
            } catch (error) {
                console.error("Ошибка при загрузке заказов:", error);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        } else {
            console.log("OrdersPanel: no user, setting loading to false");
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const getOrderStats = () => {
        const total = orders.length;
        const delivered = orders.filter(
            (order) =>
                order.status === "delivered" || order.status === "completed"
        ).length;
        const inTransit = orders.filter(
            (order) =>
                order.status === "shipped" || order.status === "scheduled"
        ).length;
        return { total, delivered, inTransit };
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
                return "bg-blue-600";
            case "completed":
                return "bg-green-600";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return <T>Pending</T>;
            case "confirmed":
                return <T>Confirmed</T>;
            case "shipped":
                return <T>Shipped</T>;
            case "delivered":
                return <T>Delivered</T>;
            case "cancelled":
                return <T>Cancelled</T>;
            case "scheduled":
                return <T>Scheduled</T>;
            case "completed":
                return <T>Completed</T>;
            default:
                return status;
        }
    };

    const stats = getOrderStats();

    return (
        <div className="space-y-8">

            <div className="space-y-1 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary)]">
                        <T>Your Orders</T>
                    </h1>
                    <p className="text-[var(--color-text)]/70">
                        <T>Manage and track your orders</T>
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/90 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw
                        className={`w-4 h-4 ${
                            refreshing ? "animate-spin" : ""
                        }`}
                    />
                    <T>Refresh</T>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-[var(--color-accent)] rounded-xl p-3">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text)]/70">
                                <T>Total Orders</T>
                            </p>
                            <p className="text-2xl font-bold text-[var(--color-primary)]">
                                {stats.total}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-600 rounded-xl p-3">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text)]/70">
                                <T>Delivered</T>
                            </p>
                            <p className="text-2xl font-bold text-[var(--color-primary)]">
                                {stats.delivered}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-[var(--color-primary)] rounded-xl p-3">
                            <Truck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text)]/70">
                                <T>In Transit</T>
                            </p>
                            <p className="text-2xl font-bold text-[var(--color-primary)]">
                                {stats.inTransit}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] overflow-hidden">
                <div className="px-8 py-6 border-b border-[var(--color-border)]">
                    <h3 className="font-serif text-xl font-semibold text-[var(--color-primary)]">
                        <T>Recent Orders</T>
                    </h3>
                    <p className="text-[var(--color-text)]/70 mt-1">
                        <T>Your latest order history</T>
                    </p>
                </div>

                {loading ? (
                    <div className="p-16 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto"></div>
                        <p className="text-[var(--color-text)]/70 mt-4">
                            <T>Loading orders...</T>
                        </p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="bg-[var(--color-secondary)]/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-[var(--color-text)]/60" />
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-[var(--color-primary)] mb-2">
                            <T>No orders yet</T>
                        </h3>
                        <p className="text-[var(--color-text)]/70 mb-8 max-w-md mx-auto">
                            <T>
                                You haven't placed any orders yet. Start
                                shopping to see your orders here!
                            </T>
                        </p>
                        <Link href="/client/dashboard/products">
                            <button className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-primary)]/90 transition-colors">
                                <ShoppingBag className="w-4 h-4" />
                                <T>Start Shopping</T>
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--color-text)]/10">
                        {orders.map((order) => (
                            <div key={order.id} className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-[var(--color-secondary)]/30 rounded-lg p-3">
                                            {order.type === "consultation" ? (
                                                <Video className="w-5 h-5 text-[var(--color-accent)]" />
                                            ) : order.type === "service" ? (
                                                <Wrench className="w-5 h-5 text-[var(--color-accent)]" />
                                            ) : (
                                                <ShoppingBag className="w-5 h-5 text-[var(--color-accent)]" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[var(--color-primary)]">
                                                {order.type ===
                                                "consultation" ? (
                                                    <T>Consultation</T>
                                                ) : order.type === "service" ? (
                                                    <T>Service</T>
                                                ) : (
                                                    <T>Order</T>
                                                )}{" "}
                                                #{order.id?.slice(-8)}
                                            </h4>
                                            <p className="text-sm text-[var(--color-text)]/70 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {order.createdAt.toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusText(order.status)}
                                        </span>
                                        <span className="font-bold text-[var(--color-accent)]">
                                            ${order.totalPrice}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-[var(--color-secondary)]/20 rounded-lg p-4">
                                    {order.type === "consultation" &&
                                    order.consultation ? (
                                        <>
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-medium text-[var(--color-primary)]">
                                                    <T>Consultation Details</T>
                                                </h5>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-[var(--color-text)]">
                                                        <T>Type:</T>
                                                    </span>
                                                    <span className="text-[var(--color-accent)] font-medium">
                                                        {
                                                            order.consultation
                                                                .consultationType
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-[var(--color-text)]">
                                                        <T>Duration:</T>
                                                    </span>
                                                    <span className="text-[var(--color-accent)] font-medium">
                                                        {
                                                            order.consultation
                                                                .duration
                                                        }{" "}
                                                        <T>minutes</T>
                                                    </span>
                                                </div>
                                                {order.consultation
                                                    .googleCalendarUrl && (
                                                    <div className="mt-3">
                                                        <a
                                                            href={
                                                                order
                                                                    .consultation
                                                                    .googleCalendarUrl
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <Calendar className="w-3 h-3" />
                                                            <T>
                                                                View in Google
                                                                Calendar
                                                            </T>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : order.type === "service" &&
                                      order.services ? (
                                        <>
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-medium text-[var(--color-primary)]">
                                                    <T>Service Details</T>
                                                </h5>
                                            </div>
                                            <div className="space-y-2">
                                                {order.services.map(
                                                    (service, index) => (
                                                        <div
                                                            key={index}
                                                            className="border-b border-[var(--color-border)] pb-2 last:border-0"
                                                        >
                                                            <div className="flex items-center justify-between text-sm mb-1">
                                                                <span className="text-[var(--color-text)] font-medium">
                                                                    {
                                                                        service.serviceName
                                                                    }
                                                                </span>
                                                                <span className="text-[var(--color-accent)] font-medium">
                                                                    $
                                                                    {
                                                                        service.price
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[var(--color-text)]/70">
                                                                {
                                                                    service.description
                                                                }
                                                            </p>
                                                            <p className="text-xs text-[var(--color-primary)] mt-1 capitalize">
                                                                <T>
                                                                    {
                                                                        service.serviceType
                                                                    }
                                                                </T>
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-medium text-[var(--color-primary)]">
                                                    <T>Order Items</T> (
                                                    {order.products.length})
                                                </h5>
                                            </div>
                                            <div className="space-y-2">
                                                {order.products.map(
                                                    (product, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between text-sm"
                                                        >
                                                            <span className="text-[var(--color-text)]">
                                                                {product.name} ×{" "}
                                                                {
                                                                    product.quantity
                                                                }
                                                            </span>
                                                            <span className="text-[var(--color-accent)] font-medium">
                                                                $
                                                                {(
                                                                    parseFloat(
                                                                        product.price
                                                                    ) *
                                                                    product.quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="mt-4 bg-[var(--color-secondary)]/20 rounded-lg p-4">
                                    <h5 className="font-medium text-[var(--color-primary)] mb-2">
                                        {order.type === "consultation" ||
                                        order.type === "service" ? (
                                            <T>Contact Information</T>
                                        ) : (
                                            <T>Delivery Information</T>
                                        )}
                                    </h5>
                                    <p className="text-sm text-[var(--color-text)]/70">
                                        <strong>
                                            <T>Name:</T>
                                        </strong>{" "}
                                        {order.customerInfo.name}
                                    </p>
                                    <p className="text-sm text-[var(--color-text)]/70">
                                        <strong>
                                            <T>Email:</T>
                                        </strong>{" "}
                                        {order.customerInfo.email}
                                    </p>
                                    {order.customerInfo.phone && (
                                        <p className="text-sm text-[var(--color-text)]/70">
                                            <strong>
                                                <T>Phone:</T>
                                            </strong>{" "}
                                            {order.customerInfo.phone}
                                        </p>
                                    )}
                                    {order.type !== "consultation" &&
                                        order.type !== "service" && (
                                            <p className="text-sm text-[var(--color-text)]/70">
                                                <strong>
                                                    <T>Address:</T>
                                                </strong>{" "}
                                                {order.customerInfo.address}
                                            </p>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
