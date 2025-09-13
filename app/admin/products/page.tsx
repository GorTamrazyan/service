// admin/products/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, Package } from "lucide-react";
import { T } from "../../components/T";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    status: 'active' | 'inactive';
    image?: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading products
        setTimeout(() => {
            setProducts([
                {
                    id: "1",
                    name: "Premium Vinyl Fence Panel",
                    price: 299.99,
                    category: "vinyl",
                    stock: 25,
                    status: "active"
                },
                {
                    id: "2", 
                    name: "Wood Privacy Fence",
                    price: 199.99,
                    category: "wood",
                    stock: 0,
                    status: "inactive"
                },
                {
                    id: "3",
                    name: "Metal Security Fence",
                    price: 449.99,
                    category: "metal",
                    stock: 12,
                    status: "active"
                }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary)]">
                        <T>Products Management</T>
                    </h1>
                    <p className="text-[var(--color-text)]/70 mt-1">
                        <T>Manage your product inventory</T>
                    </p>
                </div>
                
                <button className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-primary)] px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                    <Plus className="w-5 h-5" />
                    <T>Add Product</T>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text)]/50" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-secondary)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text)]/50" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none pl-10 pr-8 py-3 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-secondary)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] cursor-pointer min-w-[180px]"
                        >
                            <option value="all">All Categories</option>
                            <option value="vinyl">Vinyl Fences</option>
                            <option value="wood">Wood Fences</option>
                            <option value="metal">Metal Fences</option>
                            <option value="plastic">Plastic Fences</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--color-secondary)]">
                            <tr>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Product</T>
                                </th>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Category</T>
                                </th>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Price</T>
                                </th>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Stock</T>
                                </th>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Status</T>
                                </th>
                                <th className="text-center p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Actions</T>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr 
                                    key={product.id}
                                    className={`border-t border-[var(--color-text)]/10 hover:bg-[var(--color-secondary)]/20 transition-colors ${
                                        index % 2 === 0 ? 'bg-[var(--color-background)]' : 'bg-[var(--color-secondary)]/10'
                                    }`}
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[var(--color-secondary)] rounded-lg p-2">
                                                <Package className="w-5 h-5 text-[var(--color-accent)]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--color-primary)]">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-[var(--color-text)]/60">
                                                    ID: {product.id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="capitalize text-[var(--color-text)]">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className="font-semibold text-[var(--color-primary)]">
                                            ${product.price}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`font-medium ${
                                            product.stock === 0 
                                                ? 'text-red-500' 
                                                : product.stock < 10 
                                                    ? 'text-yellow-500' 
                                                    : 'text-green-500'
                                        }`}>
                                            {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            product.status === 'active'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            <T>{product.status}</T>
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-[var(--color-text)]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[var(--color-text)]/70 mb-2">
                        <T>No products found</T>
                    </h3>
                    <p className="text-[var(--color-text)]/50">
                        <T>Try adjusting your search or filters</T>
                    </p>
                </div>
            )}
        </div>
    );
}