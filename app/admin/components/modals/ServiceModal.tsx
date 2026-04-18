"use client";

import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { T } from "../../../client/components/T";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const initialFormData = {
    icon: "",
    title: "",
    description: "",
    price: "",
    features: [""],
};

export default function ServiceModal({
    isOpen,
    onClose,
    onSuccess,
}: ServiceModalProps) {
    const [formData, setFormData] = useState(initialFormData);
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFeatureChange = (index: number, value: string) => {
        const updated = [...formData.features];
        updated[index] = value;
        setFormData({ ...formData, features: updated });
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ""] });
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const features = formData.features
                .map((f) => f.trim())
                .filter((f) => f.length > 0);

            const payload = {
                icon: formData.icon,
                title: formData.title,
                description: formData.description,
                features,
                price: formData.price,
            };

            const response = await fetch("/api/service", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(result.message || "Service successfully added!");
                setFormData(initialFormData);
                setTimeout(onSuccess, 1500);
            } else {
                setStatus("error");
                setMessage(result.message || "Error: Failed to add service.");
            }
        } catch (error) {
            console.error("Client side error:", error);
            setStatus("error");
            setMessage("A critical network error occurred.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--color-primary)]">
                        <T>Add New Service</T>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-lg"
                        disabled={status === "loading"}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            <T>Title</T>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            disabled={status === "loading"}
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            <T>Price (e.g., "2 000 $")</T>
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            disabled={status === "loading"}
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            <T>Description</T>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            disabled={status === "loading"}
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            <T>Icon (e.g., FaHammer)</T>
                        </label>
                        <input
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={handleChange}
                            required
                            disabled={status === "loading"}
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-[var(--color-text)]">
                                <T>Features</T>
                                <span className="ml-2 text-xs text-[var(--color-text)]/50">
                                    ({formData.features.length})
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={addFeature}
                                disabled={status === "loading"}
                                className="flex items-center gap-1 text-xs px-3 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-lg hover:bg-[var(--color-accent)]/20 transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                                <T>Add</T>
                            </button>
                        </div>

                        <div className="space-y-2">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        disabled={status === "loading"}
                                        placeholder={`Feature ${index + 1}`}
                                        className="flex-1 px-3 py-2 border border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    />
                                    {formData.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            disabled={status === "loading"}
                                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {message && (
                        <div
                            className={`px-4 py-3 rounded-xl text-sm border ${
                                status === "error"
                                    ? "bg-red-50 border-red-200 text-red-600"
                                    : "bg-green-50 border-green-200 text-green-600"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            <T>{status === "loading" ? "Saving..." : "Add Service"}</T>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={status === "loading"}
                            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            <T>Close</T>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
