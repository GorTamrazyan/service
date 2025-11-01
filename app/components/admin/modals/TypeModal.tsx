"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { T } from "../../T";
import { TypeOfProduct, createTypeOfProduct, getAllTypeOfProducts, deleteTypeOfProduct } from "../../../lib/firebase/products/";

interface TypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TypeModal({ isOpen, onClose, onSuccess }: TypeModalProps) {
    const [types, setTypes] = useState<TypeOfProduct[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadTypes();
        }
    }, [isOpen]);

    const loadTypes = async () => {
        try {
            const data = await getAllTypeOfProducts();
            setTypes(data);
        } catch (err) {
            console.error("Error loading types:", err);
            setError(err instanceof Error ? err.message : "Failed to load types");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await createTypeOfProduct({ name, description });
            setName("");
            setDescription("");
            await loadTypes();
            onSuccess();
        } catch (err) {
            console.error("Error adding type:", err);
            setError(err instanceof Error ? err.message : "Failed to add type");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (typeId: string, typeName: string) => {
        if (confirm(`Are you sure you want to delete "${typeName}"?`)) {
            try {
                await deleteTypeOfProduct(typeId);
                await loadTypes();
                onSuccess();
            } catch (err) {
                console.error("Error deleting type:", err);
                setError(err instanceof Error ? err.message : "Failed to delete type");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--color-primary)]">
                        <T>Manage Product Types</T>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Existing Types List */}
                {types.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                            <T>Existing Types</T>
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {types.map((type) => (
                                <div
                                    key={type.id}
                                    className="flex items-center justify-between p-3 bg-[var(--color-secondary)]/20 rounded-lg border border-[var(--color-text)]/10 hover:bg-[var(--color-secondary)]/30 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-[var(--color-primary)]">
                                            {type.name}
                                        </p>
                                        {type.description && (
                                            <p className="text-sm text-[var(--color-text)]/60 mt-1">
                                                {type.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(type.id!, type.name)}
                                        className="ml-3 p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                        title="Delete type"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Type Form */}
                <div className="border-t border-[var(--color-text)]/10 pt-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                        <T>Add New Type</T>
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <T>Type Name</T>
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
                                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                <T>{isLoading ? "Adding..." : "Add Type"}</T>
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
