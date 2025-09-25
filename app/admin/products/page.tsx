// admin/products/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, X } from "lucide-react";
import { T } from "../../components/T";
import { 
    getAllProducts, 
    createProduct, 
    deleteProduct, 
    updateProduct,
    Product,
    getAllCategories
} from "../../lib/firebase/firestore";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [error, setError] = useState("");
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: ""
    });
    const [editProduct, setEditProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
        inStock: true
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const productsData = await getAllProducts();
            setProducts(productsData);
        } catch (error) {
            console.error("Error loading products:", error);
            setError("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const categoriesData = await getAllCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        try {
            await createProduct({
                name: newProduct.name,
                description: newProduct.description,
                price: newProduct.price,
                category: newProduct.category,
                imageUrl: newProduct.imageUrl,
                inStock: true
            });
            
            setNewProduct({ name: "", description: "", price: "", category: "", imageUrl: "" });
            setShowAddForm(false);
            loadProducts();
        } catch (error: any) {
            console.error("Error adding product:", error);
            setError(error.message || "Failed to add product");
        }
    };

    const handleDeleteProduct = async (productId: string, productName: string) => {
        if (confirm(`Are you sure you want to delete "${productName}"?`)) {
            try {
                await deleteProduct(productId);
                loadProducts();
            } catch (error: any) {
                console.error("Error deleting product:", error);
                setError(error.message || "Failed to delete product");
            }
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setEditProduct({
            name: product.name,
            description: product.description || "",
            price: product.price,
            category: product.category || "",
            imageUrl: product.imageUrl || "",
            inStock: product.inStock
        });
        setShowEditForm(true);
        setError("");
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct?.id) return;
        
        setError("");
        
        try {
            await updateProduct(editingProduct.id, {
                name: editProduct.name,
                description: editProduct.description,
                price: editProduct.price,
                category: editProduct.category,
                imageUrl: editProduct.imageUrl,
                inStock: editProduct.inStock
            });
            
            setShowEditForm(false);
            setEditingProduct(null);
            loadProducts();
        } catch (error: any) {
            console.error("Error updating product:", error);
            setError(error.message || "Failed to update product");
        }
    };

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
                
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-[var(--color-accent)] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    <T>Add Product</T>
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

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
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
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
                                    <T>Status</T>
                                </th>
                                <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                    <T>Created</T>
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            product.inStock
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm text-[var(--color-text)]/60">
                                            {new Date(product.createdAt).toLocaleDateString('ru-RU')}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleEditProduct(product)}
                                                className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProduct(product.id!, product.name)}
                                                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                            >
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

            {/* Add Product Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[var(--color-primary)]">
                                <T>Add New Product</T>
                            </h2>
                            <button 
                                onClick={() => setShowAddForm(false)}
                                className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Product Name</T>
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct(prev => ({...prev, name: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Description</T>
                                </label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct(prev => ({...prev, description: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] h-20"
                                    rows={3}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Price</T>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct(prev => ({...prev, price: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Category</T>
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct(prev => ({...prev, category: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    placeholder="e.g. vinyl, wood, metal"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Image URL</T>
                                </label>
                                <input
                                    type="url"
                                    value={newProduct.imageUrl}
                                    onChange={(e) => setNewProduct(prev => ({...prev, imageUrl: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    placeholder="https://..."
                                />
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[var(--color-accent)] text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    <T>Add Product</T>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    <T>Cancel</T>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditForm && editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[var(--color-primary)]">
                                <T>Edit Product</T>
                            </h2>
                            <button 
                                onClick={() => {
                                    setShowEditForm(false);
                                    setEditingProduct(null);
                                    setError("");
                                }}
                                className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Product Name</T>
                                </label>
                                <input
                                    type="text"
                                    value={editProduct.name}
                                    onChange={(e) => setEditProduct(prev => ({...prev, name: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Description</T>
                                </label>
                                <textarea
                                    value={editProduct.description}
                                    onChange={(e) => setEditProduct(prev => ({...prev, description: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] h-20"
                                    rows={3}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Price</T>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editProduct.price}
                                    onChange={(e) => setEditProduct(prev => ({...prev, price: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Category</T>
                                </label>
                                <input
                                    type="text"
                                    value={editProduct.category}
                                    onChange={(e) => setEditProduct(prev => ({...prev, category: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    placeholder="e.g. vinyl, wood, metal"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Image URL</T>
                                </label>
                                <input
                                    type="url"
                                    value={editProduct.imageUrl}
                                    onChange={(e) => setEditProduct(prev => ({...prev, imageUrl: e.target.value}))}
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    placeholder="https://..."
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editProduct.inStock}
                                        onChange={(e) => setEditProduct(prev => ({...prev, inStock: e.target.checked}))}
                                        className="rounded border-[var(--color-text)]/30 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                                    />
                                    <span className="text-sm font-medium text-[var(--color-text)]">
                                        <T>In Stock</T>
                                    </span>
                                </label>
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[var(--color-accent)] text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    <T>Update Product</T>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditForm(false);
                                        setEditingProduct(null);
                                        setError("");
                                    }}
                                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    <T>Cancel</T>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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