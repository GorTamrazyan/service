import React from "react";
import { Consultation } from "../../../lib/firebase/products/types";

interface EditConsultationModalProps {
    isOpen: boolean;
    editingConsultation: Consultation | null;
    editConsultation: {
        title: string;
        description: string;
        features: string;
        price: string;
    };
    error: string | null;
    onUpdateConsultation: (e: React.FormEvent) => void;
    onClose: () => void;
    onEditConsultationChange: (field: string, value: string) => void;
}

const EditConsultationModal: React.FC<EditConsultationModalProps> = ({
    isOpen,
    editingConsultation,
    editConsultation,
    error,
    onUpdateConsultation,
    onClose,
    onEditConsultationChange,
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
        >
            <div
                className="bg-[var(--color-background)] p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto border border-[var(--color-border)]"
                role="dialog"
                aria-labelledby="edit-consultation-title"
                aria-modal="true"
            >
                <h2
                    id="edit-consultation-title"
                    className="text-xl font-bold mb-4 text-[var(--color-primary)]"
                >
                    Edit Consultation - {editingConsultation?.title}
                </h2>

                <form onSubmit={onUpdateConsultation} className="space-y-4">
                    <div>
                        <label
                            htmlFor="consultation-title"
                            className="block text-sm font-medium mb-1 text-[var(--color-text)]"
                        >
                            Title *
                        </label>
                        <input
                            id="consultation-title"
                            type="text"
                            value={editConsultation.title}
                            onChange={(e) =>
                                onEditConsultationChange(
                                    "title",
                                    e.target.value
                                )
                            }
                            className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-input-bg)] text-[var(--color-text)]"
                            placeholder="Consultation title"
                            required
                            aria-required="true"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="consultation-description"
                            className="block text-sm font-medium mb-1 text-[var(--color-text)]"
                        >
                            Description
                        </label>
                        <textarea
                            id="consultation-description"
                            value={editConsultation.description}
                            onChange={(e) =>
                                onEditConsultationChange(
                                    "description",
                                    e.target.value
                                )
                            }
                            className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-input-bg)] text-[var(--color-text)]"
                            placeholder="Consultation description"
                            rows={3}
                            aria-describedby="description-help"
                        />
                        <p
                            id="description-help"
                            className="text-xs text-gray-500 mt-1"
                        >
                            Optional detailed description
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="consultation-features"
                            className="block text-sm font-medium mb-1 text-[var(--color-text)]"
                        >
                            Features (comma separated) *
                        </label>
                        <textarea
                            id="consultation-features"
                            value={editConsultation.features}
                            onChange={(e) =>
                                onEditConsultationChange(
                                    "features",
                                    e.target.value
                                )
                            }
                            className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-input-bg)] text-[var(--color-text)]"
                            placeholder="Feature 1, Feature 2, Feature 3"
                            rows={3}
                            required
                            aria-required="true"
                            aria-describedby="features-help"
                        />
                        <p
                            id="features-help"
                            className="text-xs text-gray-500 mt-1"
                        >
                            Separate features with commas
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="consultation-price"
                            className="block text-sm font-medium mb-1 text-[var(--color-text)]"
                        >
                            Price *
                        </label>
                        <input
                            id="consultation-price"
                            type="text"
                            value={editConsultation.price}
                            onChange={(e) =>
                                onEditConsultationChange(
                                    "price",
                                    e.target.value
                                )
                            }
                            className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-input-bg)] text-[var(--color-text)]"
                            placeholder="e.g., $99, €85, £75"
                            required
                            aria-required="true"
                        />
                    </div>

                    {error && (
                        <div
                            className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"
                            role="alert"
                            aria-live="polite"
                        >
                            <strong className="font-medium">Error: </strong>
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--color-border)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-[var(--color-text)] bg-gray-300 hover:bg-gray-400 rounded-md transition duration-300 font-medium"
                            aria-label="Cancel editing consultation"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-[var(--color-success)] hover:bg-green-700 rounded-md transition duration-300 font-medium"
                            aria-label="Update consultation details"
                        >
                            Update Consultation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditConsultationModal;
