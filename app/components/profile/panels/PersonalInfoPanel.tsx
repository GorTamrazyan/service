import React from "react";
import { Edit, Save, X } from "lucide-react";
import { UserProfile } from "../../../types/profile";
import { T } from "../../T";

interface PersonalInfoPanelProps {
    profile: UserProfile;
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

export default function PersonalInfoPanel({
    profile,
    isEditing,
    onInputChange,
    onEdit,
    onSave,
    onCancel,
}: PersonalInfoPanelProps) {
    // Используем T компонент для переводов
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-[var(--color-primary)]">
                        <T>Personal Information</T>
                    </h1>
                    <p className="text-[var(--color-text)]/70">
                        <T>Manage your personal details and information</T>
                    </p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                        <Edit className="w-4 h-4" />
                        <T>Edit</T>
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={onSave}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <Save className="w-4 h-4" />
                            <T>Save</T>
                        </button>
                        <button
                            onClick={onCancel}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <X className="w-4 h-4" />
                            <T>Cancel</T>
                        </button>
                    </div>
                )}
            </div>

            {/* Personal Info Card */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/80 px-8 py-6 border-b border-[var(--color-text)]/10">
                    <h3 className="text-xl font-semibold text-[var(--color-primary)]"><T>Personal Information</T></h3>
                    <p className="text-[var(--color-text)]/70 mt-1"><T>Manage your personal details and information</T></p>
                </div>
                
                <div className="p-8 space-y-6">
                    {/* Email (read-only) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--color-text)]">
                            <T>Email</T>
                        </label>
                        <div className="relative">
                            <div className="px-4 py-3 bg-[var(--color-secondary)]/20 border border-[var(--color-text)]/20 rounded-xl text-[var(--color-text)] font-mono">
                                {profile.email}
                            </div>
                            <div className="absolute right-3 top-3">
                                <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text)]/60 bg-[var(--color-secondary)]/30 px-2 py-1 rounded-md">
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-text)]">
                                <T>First Name</T>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={profile.firstName}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-[var(--color-secondary)]/20 border-[var(--color-text)]/20 text-[var(--color-text)]/60 cursor-not-allowed"
                                        : "bg-[var(--color-background)] border-[var(--color-text)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-[var(--color-text)]/50"
                                }`}
                                placeholder="Enter your first name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="lastName" className="block text-sm font-medium text-[var(--color-text)]">
                                <T>Last Name</T>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={profile.lastName}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-[var(--color-secondary)]/20 border-[var(--color-text)]/20 text-[var(--color-text)]/60 cursor-not-allowed"
                                        : "bg-[var(--color-background)] border-[var(--color-text)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-[var(--color-text)]/50"
                                }`}
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text)]">
                            <T>Phone</T>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={onInputChange}
                            readOnly={!isEditing}
                            className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                !isEditing
                                    ? "bg-[var(--color-secondary)]/20 border-[var(--color-text)]/20 text-[var(--color-text)]/60 cursor-not-allowed"
                                    : "bg-[var(--color-background)] border-[var(--color-text)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-[var(--color-text)]/50"
                            }`}
                            placeholder="Enter your phone number"
                        />
                    </div>
                </div>
            </div>

            {/* Address Card */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/80 px-8 py-6 border-b border-[var(--color-text)]/10">
                    <h3 className="text-xl font-semibold text-[var(--color-primary)]"><T>Address Information</T></h3>
                    <p className="text-[var(--color-text)]/70 mt-1"><T>Manage your personal details and information</T></p>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="address.street" className="block text-sm font-medium text-[var(--color-text)]">
                                <T>Street</T>
                            </label>
                            <input
                                type="text"
                                id="address.street"
                                name="address.street"
                                value={profile.address.street}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-[var(--color-secondary)]/20 border-[var(--color-text)]/20 text-[var(--color-text)]/60 cursor-not-allowed"
                                        : "bg-[var(--color-background)] border-[var(--color-text)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-[var(--color-text)]/50"
                                }`}
                                placeholder="Enter street name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address.houseNumber" className="block text-sm font-medium text-[var(--color-text)]">
                                <T>House Number</T>
                            </label>
                            <input
                                type="text"
                                id="address.houseNumber"
                                name="address.houseNumber"
                                value={profile.address.houseNumber}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-[var(--color-secondary)]/20 border-[var(--color-text)]/20 text-[var(--color-text)]/60 cursor-not-allowed"
                                        : "bg-[var(--color-background)] border-[var(--color-text)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-[var(--color-text)]/50"
                                }`}
                                placeholder="Enter house number"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address.apartmentNumber" className="block text-sm font-medium text-[var(--color-text)]">
                                <T>Apartment Number</T>
                            </label>
                            <input
                                type="text"
                                id="address.apartmentNumber"
                                name="address.apartmentNumber"
                                value={profile.address.apartmentNumber}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-[var(--color-secondary)]/20 border-[var(--color-text)]/20 text-[var(--color-text)]/60 cursor-not-allowed"
                                        : "bg-[var(--color-background)] border-[var(--color-text)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-[var(--color-text)]/50"
                                }`}
                                placeholder="Apt, suite, etc. (optional)"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address.city" className="block text-sm font-medium text-[var(--color-text)]">
                                <T>City</T>
                            </label>
                            <input
                                type="text"
                                id="address.city"
                                name="address.city"
                                value={profile.address.city}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-[var(--color-secondary)]/20 border-[var(--color-text)]/20 text-[var(--color-text)]/60 cursor-not-allowed"
                                        : "bg-[var(--color-background)] border-[var(--color-text)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-[var(--color-text)]/50"
                                }`}
                                placeholder="Enter city name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address.zipCode" className="block text-sm font-medium text-[var(--color-text)]">
                                <T>Zip Code</T>
                            </label>
                            <input
                                type="text"
                                id="address.zipCode"
                                name="address.zipCode"
                                value={profile.address.zipCode}
                                onChange={onInputChange}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200 ${
                                    !isEditing
                                        ? "bg-[var(--color-secondary)]/20 border-[var(--color-text)]/20 text-[var(--color-text)]/60 cursor-not-allowed"
                                        : "bg-[var(--color-background)] border-[var(--color-text)]/30 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] hover:border-[var(--color-text)]/50"
                                }`}
                                placeholder="Enter ZIP code"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}