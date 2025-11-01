"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { T } from "../../T";
import { Color, createColor, getAllColors, deleteColor } from "../../../lib/firebase/products/";

interface ColorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ColorModal({ isOpen, onClose, onSuccess }: ColorModalProps) {
    const [colors, setColors] = useState<Color[]>([]);
    const [name, setName] = useState("");
    const [hexCode, setHexCode] = useState("#000000");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadColors();
        }
    }, [isOpen]);

    const loadColors = async () => {
        try {
            const data = await getAllColors();
            setColors(data);
        } catch (err) {
            console.error("Error loading colors:", err);
            setError(err instanceof Error ? err.message : "Failed to load colors");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await createColor({ name, hexCode });
            setName("");
            setHexCode("#000000");
            await loadColors();
            onSuccess();
        } catch (err) {
            console.error("Error adding color:", err);
            setError(err instanceof Error ? err.message : "Failed to add color");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (colorId: string, colorName: string) => {
        if (confirm(`Are you sure you want to delete "${colorName}"?`)) {
            try {
                await deleteColor(colorId);
                await loadColors();
                onSuccess();
            } catch (err) {
                console.error("Error deleting color:", err);
                setError(err instanceof Error ? err.message : "Failed to delete color");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--color-primary)]">
                        <T>Manage Colors</T>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Existing Colors List */}
                {colors.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                            <T>Existing Colors</T>
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {colors.map((color) => (
                                <div
                                    key={color.id}
                                    className="flex items-center justify-between p-3 bg-[var(--color-secondary)]/20 rounded-lg border border-[var(--color-text)]/10 hover:bg-[var(--color-secondary)]/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div
                                            className="w-8 h-8 rounded-lg border-2 border-[var(--color-text)]/20"
                                            style={{ backgroundColor: color.hexCode }}
                                            title={color.hexCode}
                                        />
                                        <div>
                                            <p className="font-medium text-[var(--color-primary)]">
                                                {color.name}
                                            </p>
                                            <p className="text-sm text-[var(--color-text)]/60">
                                                {color.hexCode}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(color.id!, color.name)}
                                        className="ml-3 p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                        title="Delete color"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Color Form */}
                <div className="border-t border-[var(--color-text)]/10 pt-4">
                    <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                        <T>Add New Color</T>
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <T>Color Name</T>
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
                                <T>Hex Code</T>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={hexCode}
                                    onChange={(e) => setHexCode(e.target.value)}
                                    className="w-16 h-10 border border-[var(--color-text)]/30 rounded-xl cursor-pointer"
                                    disabled={isLoading}
                                />
                                <input
                                    type="text"
                                    value={hexCode}
                                    onChange={(e) => setHexCode(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    placeholder="#000000"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
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
                                className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                <T>{isLoading ? "Adding..." : "Add Color"}</T>
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
