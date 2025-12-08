import React, { useState, useEffect } from "react";
import { ShoppingBag, Calendar, Package, Truck, Eye } from "lucide-react";
import { T } from "../../T";
import Link from "next/link";
import { getUserOrders } from "../../../../lib/firebase/orders";
import { useAuthState } from "../../../../hooks/useAuthState";
import { Order } from "../../../../lib/firebase/orders";

export default function OrdersPanel() {
    const [user] = useAuthState();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            console.log("OrdersPanel: user =", user);
            if (user) {
                try {
                    console.log(
                        "OrdersPanel: fetching orders for user",
                        user.uid
                    );
                    const userOrders = await getUserOrders(user.uid);
                    console.log("OrdersPanel: received orders =", userOrders);
                    setOrders(userOrders);
                } catch (error) {
                    console.error("Ошибка при загрузке заказов:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("OrdersPanel: no user, setting loading to false");
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getOrderStats = () => {
        const total = orders.length;
        const delivered = orders.filter(
            (order) => order.status === "delivered"
        ).length;
        const inTransit = orders.filter(
            (order) => order.status === "shipped"
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
            default:
                return status;
        }
    };

    const stats = getOrderStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-[var(--color-primary)]">
                    <T>Your Orders</T>
                </h1>
                <p className="text-[var(--color-text)]/70">
                    <T>Manage and track your orders</T>
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[var(--color-secondary)]/30 to-[var(--color-secondary)]/50 rounded-2xl p-6 border border-[var(--color-text)]/10">
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

                <div className="bg-gradient-to-br from-[var(--color-secondary)]/30 to-[var(--color-secondary)]/50 rounded-2xl p-6 border border-[var(--color-text)]/10">
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

                <div className="bg-gradient-to-br from-[var(--color-secondary)]/30 to-[var(--color-secondary)]/50 rounded-2xl p-6 border border-[var(--color-text)]/10">
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

            {/* Orders List */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/80 px-8 py-6 border-b border-[var(--color-text)]/10">
                    <h3 className="text-xl font-semibold text-[var(--color-primary)]">
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
                        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                            <T>No orders yet</T>
                        </h3>
                        <p className="text-[var(--color-text)]/70 mb-8 max-w-md mx-auto">
                            <T>
                                You haven't placed any orders yet. Start
                                shopping to see your orders here!
                            </T>
                        </p>
                        <Link href="/client/dashboard/products">
                            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg">
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
                                            <ShoppingBag className="w-5 h-5 text-[var(--color-accent)]" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[var(--color-primary)]">
                                                <T>Order</T> #
                                                {order.id?.slice(-8)}
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
                                                        {product.quantity}
                                                    </span>
                                                    <span className="text-[var(--color-accent)] font-medium">
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
                                </div>

                                <div className="mt-4 bg-[var(--color-secondary)]/20 rounded-lg p-4">
                                    <h5 className="font-medium text-[var(--color-primary)] mb-2">
                                        <T>Delivery Information</T>
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
                                    <p className="text-sm text-[var(--color-text)]/70">
                                        <strong>
                                            <T>Address:</T>
                                        </strong>{" "}
                                        {order.customerInfo.address}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
