"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { T } from "../../../client/components/T";
import { Consultation } from "../../../lib/firebase/products/types";

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const initialFormData: Omit<Consultation, "id" | "createdAt" | "updatedAt"> & {
    featuresInput: string;
} = {
    title: "",
    description: "",
    price: 0,
    duration: 0,
    features: [],
    featuresInput: "",
};

export default function ConsultationModal({
    isOpen,
    onClose,
    onSuccess,
}: ConsultationModalProps) {
    const [formData, setFormData] = useState(initialFormData);
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const featuresArray = formData.featuresInput
                .split(",")
                .map((f) => f.trim())
                .filter((f) => f.length > 0);

            const payload = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                duration: formData.duration,
                features: featuresArray,
            };

            const response = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(result.message || "Tariff successfully added!");
                setFormData(initialFormData);
                setTimeout(onSuccess, 1500);
            } else {
                setStatus("error");
                setMessage(result.message || "Error: Failed to add tariff.");
            }
        } catch (error) {
            console.error("Client side error:", error);
            setStatus("error");
            setMessage("A critical network error occurred.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--color-primary)]">
                        <T>Add New Consultation Tariff</T>
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
                            <T>Tariff Name</T>
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
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
                            id="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            disabled={status === "loading"}
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            <T>Duration (minutes)</T>
                        </label>
                        <input
                            type="text"
                            name="duration"
                            id="duration"
                            value={formData.duration}
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
                            id="description"
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
                            <T>Features (comma-separated)</T>
                        </label>
                        <textarea
                            name="featuresInput"
                            id="featuresInput"
                            value={formData.featuresInput}
                            onChange={handleChange}
                            required
                            rows={2}
                            disabled={status === "loading"}
                            placeholder="Specialist visit, 3D visualization, Full calculation"
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                        />
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
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            <T>{status === "loading" ? "Saving..." : "Add Tariff"}</T>
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
