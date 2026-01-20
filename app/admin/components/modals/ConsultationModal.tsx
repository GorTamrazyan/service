// app/components/admin/modals/ConsultationModal.tsx
import React, { useState } from "react";
import { Consultation } from "../../../lib/firebase/products/types";
import { FaTimes } from "react-icons/fa";
import { format } from "path";

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
            // Converting the features string into an array
            const featuresArray = formData.featuresInput
                .split(",")
                .map((f) => f.trim())
                .filter((f) => f.length > 0);

            const payload = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                duration: formData.duration,
                features: featuresArray, // Sending the array
            };

            // Sending a POST request to the Route Handler
            const response = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(result.message || "Tariff successfully added!"); // Тариф успешно добавлен!
                setFormData(initialFormData); // Clear form
                setTimeout(onSuccess, 1500); // Close after 1.5 sec
            } else {
                setStatus("error");
                setMessage(
                    result.message || "Error: Failed to add tariff." // Ошибка: Не удалось добавить тариф.
                );
            }
        } catch (error) {
            console.error("Client side error:", error);
            setStatus("error");
            setMessage("A critical network error occurred."); // Произошла критическая ошибка сети.
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 relative">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    Add New Consultation Tariff
                </h3>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    disabled={status === "loading"}
                >
                    <FaTimes size={20} />
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Tariff Name
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Price (e.g., "2 000 $")
                        </label>
                        <input
                            type="text"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="duration"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Duration(minute)
                        </label>
                        <input
                            type="text"
                            name="duration"
                            id="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="featuresInput"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Features (comma-separated)
                        </label>
                        <textarea
                            name="featuresInput"
                            id="featuresInput"
                            value={formData.featuresInput}
                            onChange={handleChange}
                            required
                            rows={2}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white"
                            placeholder="Specialist visit, 3D visualization, Full calculation"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-300 ${
                            status === "loading"
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {status === "loading"
                            ? "Saving..." 
                            : "Add Tariff"}{" "}
                    </button>
                </form>

                {/* Status Messages */}
                {message && (
                    <p
                        className={`mt-4 text-center text-sm ${
                            status === "error"
                                ? "text-red-500"
                                : "text-green-500"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
