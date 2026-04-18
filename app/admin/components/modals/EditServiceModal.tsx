import React from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Service } from "../../../lib/firebase/products/types";

interface EditServiceModalProps {
    isOpen: boolean;
    editingService: Service | null;
    editService: {
        icon: string;
        title: string;
        description: string;
        features: string[];
        price: string;
    };
    error: string | null;
    onUpdateService: (e: React.FormEvent) => void;
    onClose: () => void;
    onEditServiceChange: (field: string, value: string) => void;
    onFeaturesChange: (features: string[]) => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
    isOpen,
    editService,
    error,
    onUpdateService,
    onClose,
    onEditServiceChange,
    onFeaturesChange,
}) => {
    if (!isOpen) return null;

    const handleFeatureChange = (index: number, value: string) => {
        const updated = [...editService.features];
        updated[index] = value;
        onFeaturesChange(updated);
    };

    const addFeature = () => {
        onFeaturesChange([...editService.features, ""]);
    };

    const removeFeature = (index: number) => {
        onFeaturesChange(editService.features.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--color-primary)]">
                        Edit Service
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--color-secondary)]/20 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onUpdateService} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                            Icon
                        </label>
                        <input
                            type="text"
                            value={editService.icon}
                            onChange={(e) => onEditServiceChange("icon", e.target.value)}
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                            placeholder="e.g. FaHammer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={editService.title}
                            onChange={(e) => onEditServiceChange("title", e.target.value)}
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                            Description
                        </label>
                        <textarea
                            value={editService.description}
                            onChange={(e) => onEditServiceChange("description", e.target.value)}
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                            Price *
                        </label>
                        <input
                            type="text"
                            value={editService.price}
                            onChange={(e) => onEditServiceChange("price", e.target.value)}
                            className="w-full px-4 py-2 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-[var(--color-text)]">
                                Features
                                <span className="ml-2 text-xs text-[var(--color-text)]/50">
                                    ({editService.features.length})
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="flex items-center gap-1 text-xs px-3 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-lg hover:bg-[var(--color-accent)]/20 transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                                Add
                            </button>
                        </div>

                        <div className="space-y-2">
                            {editService.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder={`Feature ${index + 1}`}
                                        className="flex-1 px-3 py-2 border border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    />
                                    {editService.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-white bg-[var(--color-accent)] hover:opacity-90 rounded-xl transition-opacity"
                        >
                            Update Service
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-white bg-gray-500 hover:opacity-90 rounded-xl transition-opacity"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditServiceModal;
