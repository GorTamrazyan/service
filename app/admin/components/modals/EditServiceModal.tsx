import React from "react";
import { Service } from "../../../lib/firebase/products/types";

interface EditServiceModalProps {
    isOpen: boolean;
    editingService: Service | null;
    editService: {
        icon: string;
        title: string;
        description: string;
        features: string;
        price: string;
    };
    error: string | null;
    onUpdateService: (e: React.FormEvent) => void;
    onClose: () => void;
    onEditServiceChange: (field: string, value: string) => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
    isOpen,
    editingService,
    editService,
    error,
    onUpdateService,
    onClose,
    onEditServiceChange,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-background)] p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-[var(--color-primary)]">
                    Edit Service
                </h2>

                <form onSubmit={onUpdateService} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                            Icon
                        </label>
                        <input
                            type="text"
                            value={editService.icon}
                            onChange={(e) =>
                                onEditServiceChange("icon", e.target.value)
                            }
                            className="w-full p-2 border border-[var(--color-border)] rounded-md"
                            placeholder="Service icon"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={editService.title}
                            onChange={(e) =>
                                onEditServiceChange("title", e.target.value)
                            }
                            className="w-full p-2 border border-[var(--color-border)] rounded-md "
                            placeholder="Service title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                            Description
                        </label>
                        <textarea
                            value={editService.description}
                            onChange={(e) =>
                                onEditServiceChange(
                                    "description",
                                    e.target.value
                                )
                            }
                            className="w-full p-2 border border-[var(--color-border)] rounded-md "
                            placeholder="Service description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                            Features (comma separated) *
                        </label>
                        <textarea
                            value={editService.features}
                            onChange={(e) =>
                                onEditServiceChange("features", e.target.value)
                            }
                            className="w-full p-2 border border-[var(--color-border)] rounded-md "
                            placeholder="Feature 1, Feature 2, Feature 3"
                            rows={3}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Separate features with commas
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                            Price *
                        </label>
                        <input
                            type="text"
                            value={editService.price}
                            onChange={(e) =>
                                onEditServiceChange("price", e.target.value)
                            }
                            className="w-full p-2 border border-[var(--color-border)] rounded-md "
                            placeholder="Service price"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-[var(--color-text)] bg-gray-300 hover:bg-gray-400 rounded-md transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-[var(--color-info)] hover:bg-blue-700 rounded-md transition duration-300"
                        >
                            Update Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditServiceModal;
