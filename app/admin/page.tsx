// admin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Activity,
    Calendar,
    BarChart3,
} from "lucide-react";
import { T } from "../components/T";

import { Product, getAllProducts } from "../lib/firebase/products";

import { getAllUsers, User } from "../lib/firebase/users";

import { getAllOrders, Order } from "../lib/firebase/orders";

interface StatsData {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUser] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const router = useRouter();
    const [stats, setStats] = useState<StatsData>({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load products from database
        const loadData = async () => {
            try {
                const productsData = await getAllProducts();
                setProducts(productsData);
                const ordersData = await getAllOrders();
                setOrders(ordersData);
                const usersData = await getAllUsers();
                setUser(usersData);

                // Вычисляем доход из доставленных заказов
                const revenue = ordersData
                    .filter((order) => order.status === "delivered")
                    .reduce(
                        (sum, order) => sum + parseFloat(order.totalPrice),
                        0
                    );

                setStats({
                    totalUsers: usersData.length,
                    totalProducts: productsData.length,
                    totalOrders: ordersData.length,
                    totalRevenue: revenue,
                });
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading data:", error);
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const statsCards = [
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: "from-blue-500 to-blue-600",
            textColor: "text-blue-600",
        },
        {
            title: "Products",
            value: stats.totalProducts.toLocaleString(),
            icon: Package,
            color: "from-green-500 to-green-600",
            textColor: "text-green-600",
        },
        {
            title: "Orders",
            value: stats.totalOrders.toLocaleString(),
            icon: ShoppingCart,
            color: "from-purple-500 to-purple-600",
            textColor: "text-purple-600",
        },
        {
            title: "Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "from-yellow-500 to-yellow-600",
            textColor: "text-yellow-600",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-[var(--color-primary)]">
                    <T>Admin Dashboard</T>
                </h1>
                <p className="text-[var(--color-text)]/70">
                    <T>
                        Welcome to the admin panel. Here's an overview of your
                        business.
                    </T>
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[var(--color-text)]/70 text-sm font-medium mb-2">
                                            <T>{card.title}</T>
                                        </p>
                                        <p className="text-3xl font-bold text-[var(--color-primary)]">
                                            {card.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`bg-gradient-to-r ${card.color} rounded-xl p-3`}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-4 text-sm">
                                    <TrendingUp
                                        className={`w-4 h-4 ${card.textColor} mr-1`}
                                    />
                                    <span
                                        className={`${card.textColor} font-medium`}
                                    >
                                        +12%
                                    </span>
                                    <span className="text-[var(--color-text)]/70 ml-2">
                                        <T>from last month</T>
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[var(--color-accent)] rounded-xl p-2">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                                <T>Revenue Overview</T>
                            </h3>
                            <p className="text-[var(--color-text)]/70 text-sm">
                                <T>Monthly revenue trends</T>
                            </p>
                        </div>
                    </div>
                    <div className="h-64 flex items-center justify-center text-[var(--color-text)]/50">
                        <div className="text-center">
                            <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                            <p>
                                <T>Chart will be implemented here</T>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[var(--color-primary)] rounded-xl p-2">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                                <T>Recent Activity</T>
                            </h3>
                            <p className="text-[var(--color-text)]/70 text-sm">
                                <T>Latest system activities</T>
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                action: "New user registered",
                                time: "2 minutes ago",
                                icon: Users,
                            },
                            {
                                action: "Order #1234 completed",
                                time: "15 minutes ago",
                                icon: ShoppingCart,
                            },
                            {
                                action: "Product updated",
                                time: "1 hour ago",
                                icon: Package,
                            },
                            {
                                action: "Payment received",
                                time: "2 hours ago",
                                icon: DollarSign,
                            },
                        ].map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-secondary)]/30 transition-colors"
                                >
                                    <div className="bg-[var(--color-accent)]/10 rounded-full p-2">
                                        <Icon className="w-4 h-4 text-[var(--color-accent)]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[var(--color-text)] font-medium">
                                            <T>{activity.action}</T>
                                        </p>
                                        <p className="text-[var(--color-text)]/60 text-sm">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 p-6">
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-6">
                    <T>Quick Actions</T>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            title: "Add Product",
                            icon: Package,
                            href: "/admin/products",
                        },
                        {
                            title: "View Orders",
                            icon: ShoppingCart,
                            href: "/admin/orders",
                        },
                        {
                            title: "Manage Users",
                            icon: Users,
                            href: "/admin/users",
                        },
                        {
                            title: "View Reports",
                            icon: BarChart3,
                            href: "/admin/reports",
                        },
                    ].map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => router.push(action.href)}
                                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-text)]/20 hover:bg-[var(--color-secondary)]/30 hover:border-[var(--color-accent)]/50 transition-all duration-200 group"
                            >
                                <Icon className="w-5 h-5 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                                <span className="text-[var(--color-text)] font-medium">
                                    <T>{action.title}</T>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
