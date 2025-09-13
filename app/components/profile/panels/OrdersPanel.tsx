import React from "react";
import { ShoppingBag, Calendar, Package, Truck } from "lucide-react";
import { T } from "../../T";
import Link from "next/link";

export default function OrdersPanel() {
    
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
                                0
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
                                0
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
                                0
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/80 px-8 py-6 border-b border-[var(--color-text)]/10">
                    <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                        <T>Recent Orders</T>
                    </h3>
                    <p className="text-[var(--color-text)]/70 mt-1">
                        <T>Your latest order history</T>
                    </p>
                </div>

                <div className="p-16 text-center">
                    <div className="bg-[var(--color-secondary)]/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-[var(--color-text)]/60" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                        <T>No orders yet</T>
                    </h3>
                    <p className="text-[var(--color-text)]/70 mb-8 max-w-md mx-auto">
                        <T>
                            You haven't placed any orders yet. Start shopping to
                            see your orders here!
                        </T>
                    </p>
                    <Link href="/client/dashboard/products">
                        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg">
                            <ShoppingBag className="w-4 h-4" />
                            <T>Start Shopping</T>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}