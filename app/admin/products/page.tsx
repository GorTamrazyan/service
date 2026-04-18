"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Package,
    X,
    Upload,
    Image as ImageIcon,
} from "lucide-react";
import { T } from "../../client/components/T";
import {
    CategoryModal,
    MaterialModal,
    ColorModal,
    TypeModal,
} from "../components/modals";
import {
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    Product,
    getAllCategories,
    Category,
    getAllMaterials,
    Material,
    getAllColors,
    Color,
    getAllTypeOfProducts,
    TypeOfProduct,
    uploadProductImages,
    createImage,
    getImagesByProductId,
    deleteImage,
    deleteProductImage,
    Image as ProductImage,
} from "../../lib/firebase/products/";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [typeOfProducts, setTypeOfProducts] = useState<TypeOfProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [error, setError] = useState("");

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        colorPrices: {} as Record<string, number>,
        categoryId: "",
        typeOfProductId: "",
        materialId: "",
        colorIds: [] as string[],
        featured: false,
        discount: 0,
    });
    const [newProductImages, setNewProductImages] = useState<File[]>([]);
    const [editProductImages, setEditProductImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
    const [editProduct, setEditProduct] = useState({
        name: "",
        description: "",
        colorPrices: {} as Record<string, number>,
        categoryId: "",
        typeOfProductId: "",
        materialId: "",
        colorIds: [] as string[],
        featured: false,
        discount: 0,
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
        loadMaterials();
        loadColors();
        loadTypeOfProducts();
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

    const loadMaterials = async () => {
        try {
            const materialsData = await getAllMaterials();
            setMaterials(materialsData);
        } catch (error) {
            console.error("Error loading materials:", error);
        }
    };

    const loadColors = async () => {
        try {
            const colorsData = await getAllColors();
            setColors(colorsData);
        } catch (error) {
            console.error("Error loading colors:", error);
        }
    };

    const loadTypeOfProducts = async () => {
        try {
            const typeOfProductsData = await getAllTypeOfProducts();
            setTypeOfProducts(typeOfProductsData);
        } catch (error) {
            console.error("Error loading type of products:", error);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            
            const productId = await createProduct({
                name: newProduct.name,
                description: newProduct.description,
                colorPrices: newProduct.colorPrices,
                categoryId: newProduct.categoryId,
                typeOfProductId: newProduct.typeOfProductId,
                materialId: newProduct.materialId,
                colorIds: newProduct.colorIds,
                featured: newProduct.featured,
                discount: newProduct.discount,
            });

            if (newProductImages.length > 0) {
                const imageUrls = await uploadProductImages(
                    newProductImages,
                    productId
                );

                for (let i = 0; i < imageUrls.length; i++) {
                    await createImage({
                        url: imageUrls[i],
                        productId: productId,
                        isPrimary: i === 0, 
                        order: i,
                        alt: `${newProduct.name} - Image ${i + 1}`,
                    });
                }
            }

            setNewProduct({
                name: "",
                description: "",
                colorPrices: {},
                categoryId: "",
                typeOfProductId: "",
                materialId: "",
                colorIds: [],
                featured: false,
                discount: 0,
            });
            setNewProductImages([]);
            setShowAddForm(false);
            loadProducts();
        } catch (error) {
            console.error("Error adding product:", error);
            setError(
                error instanceof Error ? error.message : "Failed to add product"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (
        productId: string,
        productName: string
    ) => {
        if (confirm(`Are you sure you want to delete "${productName}"?`)) {
            try {
                
                const images = await getImagesByProductId(productId);
                for (const image of images) {
                    await deleteProductImage(image.url);
                    if (image.id) {
                        await deleteImage(image.id);
                    }
                }
                await deleteProduct(productId);
                loadProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete product"
                );
            }
        }
    };

    const handleToggleFeatured = async (product: Product) => {
        try {
            await updateProduct(product.id!, { featured: !product.featured });
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === product.id ? { ...p, featured: !p.featured } : p
                )
            );
        } catch (error) {
            console.error("Error toggling featured:", error);
        }
    };

    const handleEditProduct = async (product: Product) => {
        setEditingProduct(product);
        setEditProduct({
            name: product.name,
            description: product.description || "",
            colorPrices: product.colorPrices || {},
            categoryId: product.categoryId || "",
            typeOfProductId: product.typeOfProductId || "",
            materialId: product.materialId || "",
            colorIds: product.colorIds || [],
            featured: product.featured || false,
            discount: product.discount || 0,
        });

        if (product.id) {
            try {
                const images = await getImagesByProductId(product.id);
                setExistingImages(images);
            } catch (error) {
                console.error("Error loading product images:", error);
                setExistingImages([]);
            }
        }

        setShowEditForm(true);
        setError("");
    };

    const handleDeleteImage = async (image: ProductImage) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            
            await deleteProductImage(image.url);
            
            if (image.id) {
                await deleteImage(image.id);
            }
            
            setExistingImages(prev => prev.filter(img => img.id !== image.id));
        } catch (error) {
            console.error("Error deleting image:", error);
            setError("Failed to delete image");
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct?.id) return;

        setError("");
        setIsLoading(true);

        try {
            
            await updateProduct(editingProduct.id, {
                name: editProduct.name,
                description: editProduct.description,
                colorPrices: editProduct.colorPrices,
                categoryId: editProduct.categoryId,
                typeOfProductId: editProduct.typeOfProductId,
                materialId: editProduct.materialId,
                colorIds: editProduct.colorIds,
                featured: editProduct.featured,
                discount: editProduct.discount,
            });

            if (editProductImages.length > 0) {
                const imageUrls = await uploadProductImages(
                    editProductImages,
                    editingProduct.id
                );

                for (let i = 0; i < imageUrls.length; i++) {
                    await createImage({
                        url: imageUrls[i],
                        productId: editingProduct.id,
                        isPrimary: false, 
                        order: 999 + i, 
                        alt: `${editProduct.name} - Image ${i + 1}`,
                    });
                }
            }

            setShowEditForm(false);
            setEditingProduct(null);
            setEditProductImages([]);
            loadProducts();
        } catch (error) {
            console.error("Error updating product:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update product"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" ||
            product.categoryId === selectedCategory;
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

            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 p-6">
                <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
                    <T>Manage Product Attributes</T>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => setShowCategoryModal(true)}
                        className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        <T>Category</T>
                    </button>
                    <button
                        onClick={() => setShowMaterialModal(true)}
                        className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        <T>Material</T>
                    </button>
                    <button
                        onClick={() => setShowColorModal(true)}
                        className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        <T>Color</T>
                    </button>
                    <button
                        onClick={() => setShowTypeModal(true)}
                        className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        <T>Type</T>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 p-6">
                <div className="flex flex-col lg:flex-row gap-4">

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

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text)]/50" />
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="appearance-none pl-10 pr-8 py-3 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-secondary)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] cursor-pointer min-w-[180px]"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {categories.map((categorie) => (
                <div
                    key={categorie.id}
                    className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--color-secondary)]">
                                <tr>
                                    <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                        <T>{categorie.name}</T>
                                    </th>
                                    <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                        <T>Material</T>
                                    </th>
                                    <th className="text-left p-6 text-[var(--color-primary)] font-semibold">
                                        <T>Price</T>
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
                                {filteredProducts
                                    .filter(
                                        (products) =>
                                            products.categoryId === categorie.id
                                    )
                                    .map((product, index) => (
                                        <tr
                                            key={product.id}
                                            className={`border-t border-[var(--color-text)]/10 hover:bg-[var(--color-secondary)]/20 transition-colors ${
                                                index % 2 === 0
                                                    ? "bg-[var(--color-background)]"
                                                    : "bg-[var(--color-secondary)]/10"
                                            }`}
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[var(--color-secondary)] rounded-lg p-2">
                                                        <Package className="w-5 h-5 text-[var(--color-accent)]" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-[var(--color-primary)]">
                                                                {product.name}
                                                            </p>
                                                            {product.featured && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                                                                    <T>Home</T>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-[var(--color-text)]/60">
                                                            ID: {product.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-6">
                                                <span className="capitalize text-[var(--color-text)]">
                                                    {
                                                        materials.find(
                                                            (material) =>
                                                                material.id ===
                                                                product.materialId
                                                        )?.name
                                                    }
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className="font-semibold text-[var(--color-primary)]">
                                                    {(() => {
                                                        const cp = product.colorPrices;
                                                        if (!cp || typeof cp !== "object") return "-";
                                                        const prices = Object.values(cp).map(Number).filter((v) => !isNaN(v));
                                                        if (prices.length === 0) return "-";
                                                        const min = Math.min(...prices);
                                                        const max = Math.max(...prices);
                                                        return min === max ? `$${min}` : `$${min} - $${max}`;
                                                    })()}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className="text-sm text-[var(--color-text)]/60">
                                                    {new Date(
                                                        product.createdAt
                                                    ).toLocaleDateString(
                                                        "ru-RU"
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleFeatured(product)}
                                                        title={product.featured ? "Hide from home page" : "Show on home page"}
                                                        className={`p-2 rounded-lg transition-colors ${product.featured ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/25" : "hover:bg-blue-100 text-[var(--color-text)]/40 hover:text-blue-600"}`}
                                                    >
                                                        {product.featured ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEditProduct(
                                                                product
                                                            )
                                                        }
                                                        className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product.id!,
                                                                product.name
                                                            )
                                                        }
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
            ))}

            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto">
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
                                    onChange={(e) =>
                                        setNewProduct((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
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
                                    onChange={(e) =>
                                        setNewProduct((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] h-20"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Category</T>
                                </label>
                                <select
                                    value={newProduct.categoryId}
                                    onChange={(e) =>
                                        setNewProduct((prev) => ({
                                            ...prev,
                                            categoryId: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Type of Product</T>
                                </label>
                                <select
                                    value={newProduct.typeOfProductId}
                                    onChange={(e) =>
                                        setNewProduct((prev) => ({
                                            ...prev,
                                            typeOfProductId: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                >
                                    <option value="">Select Type</option>
                                    {typeOfProducts.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Material</T>
                                </label>
                                <select
                                    value={newProduct.materialId}
                                    onChange={(e) =>
                                        setNewProduct((prev) => ({
                                            ...prev,
                                            materialId: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                >
                                    <option value="">Select Material</option>
                                    {materials.map((material) => (
                                        <option
                                            key={material.id}
                                            value={material.id}
                                        >
                                            {material.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Colors & Prices</T>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {colors.map((color) => {
                                        const colorId = color.id!;
                                        const isSelected = newProduct.colorIds.includes(colorId);
                                        return (
                                            <div key={colorId} className={`p-2 border rounded-lg transition-all ${
                                                isSelected
                                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                                    : "border-[var(--color-text)]/30 hover:border-[var(--color-accent)]/50"
                                            }`}>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            setNewProduct((prev) => {
                                                                const newColorPrices = { ...prev.colorPrices };
                                                                if (e.target.checked) {
                                                                    newColorPrices[colorId] = 0;
                                                                    return { ...prev, colorIds: [...prev.colorIds, colorId], colorPrices: newColorPrices };
                                                                } else {
                                                                    delete newColorPrices[colorId];
                                                                    return { ...prev, colorIds: prev.colorIds.filter((id) => id !== colorId), colorPrices: newColorPrices };
                                                                }
                                                            });
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className="w-6 h-6 rounded border-2 border-[var(--color-text)]/20 flex-shrink-0"
                                                        style={{ backgroundColor: color.hexCode }}
                                                    />
                                                    <span className="text-sm text-[var(--color-text)] truncate">{color.name}</span>
                                                </label>
                                                {isSelected && (
                                                    <input
                                                        type="number"
                                                        placeholder="Price"
                                                        value={newProduct.colorPrices[colorId] || ""}
                                                        onChange={(e) => setNewProduct((prev) => ({
                                                            ...prev,
                                                            colorPrices: { ...prev.colorPrices, [colorId]: parseFloat(e.target.value) || 0 },
                                                        }))}
                                                        min={0}
                                                        className="mt-2 w-full px-3 py-1 text-sm border border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)]"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Images</T>
                                </label>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--color-text)]/30 border-dashed rounded-xl cursor-pointer bg-[var(--color-secondary)]/20 hover:bg-[var(--color-secondary)]/30 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-[var(--color-text)]/50" />
                                                <p className="mb-2 text-sm text-[var(--color-text)]/70">
                                                    <span className="font-semibold">
                                                        <T>Click to upload</T>
                                                    </span>{" "}
                                                    <T>or drag and drop</T>
                                                </p>
                                                <p className="text-xs text-[var(--color-text)]/50">
                                                    PNG, JPG, WEBP (MAX. 5MB)
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    const files = Array.from(
                                                        e.target.files || []
                                                    );
                                                    setNewProductImages(
                                                        (prev) => [
                                                            ...prev,
                                                            ...files,
                                                        ]
                                                    );
                                                }}
                                            />
                                        </label>
                                    </div>
                                    {newProductImages.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {newProductImages.map(
                                                (file, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative group aspect-square rounded-lg overflow-hidden border border-[var(--color-text)]/20"
                                                    >
                                                        <img
                                                            src={URL.createObjectURL(
                                                                file
                                                            )}
                                                            alt={`Preview ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setNewProductImages(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) =>
                                                                                i !==
                                                                                index
                                                                        )
                                                                )
                                                            }
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        {index === 0 && (
                                                            <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-[var(--color-accent)] text-white text-xs rounded">
                                                                <T>Primary</T>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer p-3 border border-[var(--color-text)]/30 rounded-xl hover:border-[var(--color-accent)]/50 transition-colors">
                                    <div className="relative flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={newProduct.featured}
                                            onChange={(e) =>
                                                setNewProduct((prev) => ({
                                                    ...prev,
                                                    featured: e.target.checked,
                                                }))
                                            }
                                            className="sr-only"
                                        />
                                        <div className={`w-10 h-6 rounded-full transition-colors ${newProduct.featured ? "bg-[var(--color-accent)]" : "bg-[var(--color-text)]/20"}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-1 ${newProduct.featured ? "translate-x-5" : "translate-x-1"}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[var(--color-text)]"><T>Show on Home Page</T></p>
                                        <p className="text-xs text-[var(--color-text)]/50"><T>Featured products appear in the homepage section</T></p>
                                    </div>
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
                                    disabled={isLoading}
                                    className="flex-1 bg-[var(--color-accent)] text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <T>
                                        {isLoading
                                            ? "Adding..."
                                            : "Add Product"}
                                    </T>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewProductImages([]);
                                    }}
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <T>Cancel</T>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditForm && editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[var(--color-primary)]">
                                <T>Edit Product</T>
                            </h2>
                            <button
                                onClick={() => {
                                    setShowEditForm(false);
                                    setEditingProduct(null);
                                    setEditProductImages([]);
                                    setExistingImages([]);
                                    setError("");
                                }}
                                className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdateProduct}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Product Name</T>
                                </label>
                                <input
                                    type="text"
                                    value={editProduct.name}
                                    onChange={(e) =>
                                        setEditProduct((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
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
                                    onChange={(e) =>
                                        setEditProduct((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] h-20"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Category</T>
                                </label>
                                <select
                                    value={editProduct.categoryId}
                                    onChange={(e) =>
                                        setEditProduct((prev) => ({
                                            ...prev,
                                            categoryId: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Type of Product</T>
                                </label>
                                <select
                                    value={editProduct.typeOfProductId}
                                    onChange={(e) =>
                                        setEditProduct((prev) => ({
                                            ...prev,
                                            typeOfProductId: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                >
                                    <option value="">Select Type</option>
                                    {typeOfProducts.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Material</T>
                                </label>
                                <select
                                    value={editProduct.materialId}
                                    onChange={(e) =>
                                        setEditProduct((prev) => ({
                                            ...prev,
                                            materialId: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                >
                                    <option value="">Select Material</option>
                                    {materials.map((material) => (
                                        <option
                                            key={material.id}
                                            value={material.id}
                                        >
                                            {material.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Colors & Prices</T>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {colors.map((color) => {
                                        const colorId = color.id!;
                                        const isSelected = editProduct.colorIds.includes(colorId);
                                        return (
                                            <div key={colorId} className={`p-2 border rounded-lg transition-all ${
                                                isSelected
                                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                                    : "border-[var(--color-text)]/30 hover:border-[var(--color-accent)]/50"
                                            }`}>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            setEditProduct((prev) => {
                                                                const newColorPrices = { ...prev.colorPrices };
                                                                if (e.target.checked) {
                                                                    newColorPrices[colorId] = 0;
                                                                    return { ...prev, colorIds: [...prev.colorIds, colorId], colorPrices: newColorPrices };
                                                                } else {
                                                                    delete newColorPrices[colorId];
                                                                    return { ...prev, colorIds: prev.colorIds.filter((id) => id !== colorId), colorPrices: newColorPrices };
                                                                }
                                                            });
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className="w-6 h-6 rounded border-2 border-[var(--color-text)]/20 flex-shrink-0"
                                                        style={{ backgroundColor: color.hexCode }}
                                                    />
                                                    <span className="text-sm text-[var(--color-text)] truncate">{color.name}</span>
                                                </label>
                                                {isSelected && (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Price"
                                                        value={editProduct.colorPrices[colorId] || ""}
                                                        onChange={(e) => setEditProduct((prev) => ({
                                                            ...prev,
                                                            colorPrices: { ...prev.colorPrices, [colorId]: parseFloat(e.target.value) || 0 },
                                                        }))}
                                                        min={0}
                                                        className="mt-2 w-full px-3 py-1 text-sm border border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)]"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <T>Images</T>
                                </label>
                                <div className="space-y-4">

                                    {existingImages.length > 0 && (
                                        <div>
                                            <p className="text-xs text-[var(--color-text)]/60 mb-2">
                                                <T>Current images</T> ({existingImages.length})
                                            </p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {existingImages.map((image) => (
                                                    <div
                                                        key={image.id}
                                                        className="relative group aspect-square rounded-lg overflow-hidden border border-[var(--color-text)]/20"
                                                    >
                                                        <img
                                                            src={image.url}
                                                            alt={image.alt || "Product image"}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteImage(image)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                        {image.isPrimary && (
                                                            <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-[var(--color-accent)] text-white text-xs rounded">
                                                                <T>Primary</T>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-xs text-[var(--color-text)]/60 mb-2">
                                            <T>Add new images</T>
                                        </p>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--color-text)]/30 border-dashed rounded-xl cursor-pointer bg-[var(--color-secondary)]/20 hover:bg-[var(--color-secondary)]/30 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-[var(--color-text)]/50" />
                                                    <p className="mb-2 text-sm text-[var(--color-text)]/70">
                                                        <span className="font-semibold">
                                                            <T>Click to upload</T>
                                                        </span>{" "}
                                                        <T>or drag and drop</T>
                                                    </p>
                                                    <p className="text-xs text-[var(--color-text)]/50">
                                                        PNG, JPG, WEBP (MAX. 5MB)
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => {
                                                        const files = Array.from(
                                                            e.target.files || []
                                                        );
                                                        setEditProductImages(
                                                            (prev) => [
                                                                ...prev,
                                                                ...files,
                                                            ]
                                                        );
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    {editProductImages.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {editProductImages.map(
                                                (file, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative group aspect-square rounded-lg overflow-hidden border border-[var(--color-text)]/20"
                                                    >
                                                        <img
                                                            src={URL.createObjectURL(
                                                                file
                                                            )}
                                                            alt={`Preview ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEditProductImages(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) =>
                                                                                i !==
                                                                                index
                                                                        )
                                                                )
                                                            }
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        {index === 0 && (
                                                            <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-[var(--color-accent)] text-white text-xs rounded">
                                                                <T>Primary</T>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer p-3 border border-[var(--color-text)]/30 rounded-xl hover:border-[var(--color-accent)]/50 transition-colors">
                                    <div className="relative flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={editProduct.featured}
                                            onChange={(e) =>
                                                setEditProduct((prev) => ({
                                                    ...prev,
                                                    featured: e.target.checked,
                                                }))
                                            }
                                            className="sr-only"
                                        />
                                        <div className={`w-10 h-6 rounded-full transition-colors ${editProduct.featured ? "bg-[var(--color-accent)]" : "bg-[var(--color-text)]/20"}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-1 ${editProduct.featured ? "translate-x-5" : "translate-x-1"}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[var(--color-text)]"><T>Show on Home Page</T></p>
                                        <p className="text-xs text-[var(--color-text)]/50"><T>Featured products appear in the homepage section</T></p>
                                    </div>
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
                                    disabled={isLoading}
                                    className="flex-1 bg-[var(--color-accent)] text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <T>
                                        {isLoading
                                            ? "Updating..."
                                            : "Update Product"}
                                    </T>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditForm(false);
                                        setEditingProduct(null);
                                        setEditProductImages([]);
                                        setExistingImages([]);
                                        setError("");
                                    }}
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <T>Cancel</T>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <CategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onSuccess={loadCategories}
            />
            <MaterialModal
                isOpen={showMaterialModal}
                onClose={() => setShowMaterialModal(false)}
                onSuccess={loadMaterials}
            />
            <ColorModal
                isOpen={showColorModal}
                onClose={() => setShowColorModal(false)}
                onSuccess={loadColors}
            />
            <TypeModal
                isOpen={showTypeModal}
                onClose={() => setShowTypeModal(false)}
                onSuccess={loadTypeOfProducts}
            />

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
