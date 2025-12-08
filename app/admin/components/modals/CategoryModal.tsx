"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { T } from "../../../client/components/T";
import {
    Category,
    createCategory,
    getAllCategories,
    deleteCategory,
} from "../../../lib/firebase/products";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CategoryModal({
    isOpen,
    onClose,
    onSuccess,
}: CategoryModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error("Error loading categories:", err);
            setError(
                err instanceof Error ? err.message : "Failed to load categories"
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await createCategory({ name, description });
            setName("");
            setDescription("");
            await loadCategories();
            onSuccess();
        } catch (err) {
            console.error("Error adding category:", err);
            setError(
                err instanceof Error ? err.message : "Failed to add category"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (categoryId: string, categoryName: string) => {
        if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
            try {
                await deleteCategory(categoryId);
                await loadCategories();
                onSuccess();
            } catch (err) {
                console.error("Error deleting category:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to delete category"
                );
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--color-primary)]">
                        <T>Manage Categories</T>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Existing Categories List */}
                {categories.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                            <T>Existing Categories</T>
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-3 bg-[var(--color-secondary)]/20 rounded-lg border border-[var(--color-text)]/10 hover:bg-[var(--color-secondary)]/30 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-[var(--color-primary)]">
                                            {category.name}
                                        </p>
                                        {category.description && (
                                            <p className="text-sm text-[var(--color-text)]/60 mt-1">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                category.id!,
                                                category.name
                                            )
                                        }
                                        className="ml-3 p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                        title="Delete category"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Category Form */}
                <div className="border-t border-[var(--color-text)]/10 pt-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                        <T>Add New Category</T>
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <T>Category Name</T>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <T>Description</T>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] h-20"
                                rows={3}
                                disabled={isLoading}
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
                                disabled={isLoading}
                                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                <T>
                                    {isLoading ? "Adding..." : "Add Category"}
                                </T>
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                <T>Close</T>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
