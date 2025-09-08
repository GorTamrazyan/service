import React from "react";
import { ShoppingBag, Calendar, Package, Truck } from "lucide-react";
import { T } from "../../T";

export default function OrdersPanel() {
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-slate-900"><T>Your Orders</T></h1>
                <p className="text-slate-600">
                    <T>Manage and track your orders</T>
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 rounded-xl p-3">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-700"><T>Total Orders</T></p>
                            <p className="text-2xl font-bold text-blue-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 rounded-xl p-3">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-emerald-700"><T>Delivered</T></p>
                            <p className="text-2xl font-bold text-emerald-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-600 rounded-xl p-3">
                            <Truck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-amber-700"><T>In Transit</T></p>
                            <p className="text-2xl font-bold text-amber-900">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900"><T>Recent Orders</T></h3>
                    <p className="text-slate-600 mt-1"><T>Your latest order history</T></p>
                </div>
                
                <div className="p-16 text-center">
                    <div className="bg-slate-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        <T>No orders yet</T>
                    </h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        <T>You haven't placed any orders yet. Start shopping to see your orders here!</T>
                    </p>
                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                        <ShoppingBag className="w-4 h-4" />
                        <T>Start Shopping</T>
                    </button>
                </div>
            </div>
        </div>
    );
}