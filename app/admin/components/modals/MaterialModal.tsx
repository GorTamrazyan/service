"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { T } from "../../../client/components/T";
import {
    Material,
    createMaterial,
    getAllMaterials,
    deleteMaterial,
} from "../../../lib/firebase/products";

interface MaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function MaterialModal({
    isOpen,
    onClose,
    onSuccess,
}: MaterialModalProps) {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadMaterials();
        }
    }, [isOpen]);

    const loadMaterials = async () => {
        try {
            const data = await getAllMaterials();
            setMaterials(data);
        } catch (err) {
            console.error("Error loading materials:", err);
            setError(
                err instanceof Error ? err.message : "Failed to load materials"
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await createMaterial({ name, description });
            setName("");
            setDescription("");
            await loadMaterials();
            onSuccess();
        } catch (err) {
            console.error("Error adding material:", err);
            setError(
                err instanceof Error ? err.message : "Failed to add material"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (materialId: string, materialName: string) => {
        if (confirm(`Are you sure you want to delete "${materialName}"?`)) {
            try {
                await deleteMaterial(materialId);
                await loadMaterials();
                onSuccess();
            } catch (err) {
                console.error("Error deleting material:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to delete material"
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
                        <T>Manage Materials</T>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Existing Materials List */}
                {materials.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                            <T>Existing Materials</T>
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {materials.map((material) => (
                                <div
                                    key={material.id}
                                    className="flex items-center justify-between p-3 bg-[var(--color-secondary)]/20 rounded-lg border border-[var(--color-text)]/10 hover:bg-[var(--color-secondary)]/30 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-[var(--color-primary)]">
                                            {material.name}
                                        </p>
                                        {material.description && (
                                            <p className="text-sm text-[var(--color-text)]/60 mt-1">
                                                {material.description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                material.id!,
                                                material.name
                                            )
                                        }
                                        className="ml-3 p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                        title="Delete material"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Material Form */}
                <div className="border-t border-[var(--color-text)]/10 pt-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                        <T>Add New Material</T>
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <T>Material Name</T>
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
                                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                <T>
                                    {isLoading ? "Adding..." : "Add Material"}
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
