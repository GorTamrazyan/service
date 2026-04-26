import React from "react";
import {
    FaEdit,
    FaSave,
    FaTimes,
    FaUserCircle,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaShieldAlt,
} from "react-icons/fa";
import { UserProfile } from "../../../../types/profile";
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
    return (
        <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-serif font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                            <FaUserCircle className="w-5 h-5 text-[var(--color-accent)]" />
                            <T>Personal Information</T>
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                                    <T>First Name</T>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profile?.firstName || ""}
                                    onChange={onInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-[var(--color-background)] text-[var(--color-text)] ${
                                        isEditing
                                            ? "border-[var(--color-text)]/30 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                            : "border-[var(--color-text)]/20 opacity-60"
                                    }`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                                    <T>Last Name</T>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profile?.lastName || ""}
                                    onChange={onInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-[var(--color-background)] text-[var(--color-text)] ${
                                        isEditing
                                            ? "border-[var(--color-text)]/30 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                            : "border-[var(--color-text)]/20 opacity-60"
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-serif font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                            <FaEnvelope className="w-5 h-5 text-[var(--color-accent)]" />
                            <T>Contact Information</T>
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                                    <T>Email Address</T>
                                </label>
                                <input
                                    type="email"
                                    value={profile?.email || ""}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-text)]/20 bg-[var(--color-background)] text-[var(--color-text)] opacity-60 cursor-not-allowed"
                                />
                                <p className="text-sm text-[var(--color-text)]/60 mt-1">
                                    <T>Email cannot be changed</T>
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                                    <T>Phone Number</T>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile?.phone || ""}
                                    onChange={onInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-[var(--color-background)] text-[var(--color-text)] ${
                                        isEditing
                                            ? "border-[var(--color-text)]/30 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                            : "border-[var(--color-text)]/20 opacity-60"
                                    }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-serif font-semibold text-[var(--color-text)] flex items-center gap-2">
                            <FaMapMarkerAlt className="w-5 h-5 text-[var(--color-accent)]" />
                            <T>Address Information</T>
                        </h3>
                        <FaShieldAlt className="w-5 h-5 text-[var(--color-text)]/40" />
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                                    <T>Street</T>
                                </label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={profile?.address?.street || ""}
                                    onChange={onInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-[var(--color-background)] text-[var(--color-text)] ${
                                        isEditing
                                            ? "border-[var(--color-text)]/30 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                            : "border-[var(--color-text)]/20 opacity-60"
                                    }`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                                    <T>House No.</T>
                                </label>
                                <input
                                    type="text"
                                    name="address.houseNumber"
                                    value={profile?.address?.houseNumber || ""}
                                    onChange={onInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-[var(--color-background)] text-[var(--color-text)] ${
                                        isEditing
                                            ? "border-[var(--color-text)]/30 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                            : "border-[var(--color-text)]/20 opacity-60"
                                    }`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                                <T>Apartment/Unit</T>
                            </label>
                            <input
                                type="text"
                                name="address.apartmentNumber"
                                value={profile?.address?.apartmentNumber || ""}
                                onChange={onInputChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 rounded-xl border transition-all bg-[var(--color-background)] text-[var(--color-text)] ${
                                    isEditing
                                        ? "border-[var(--color-text)]/30 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                        : "border-[var(--color-text)]/20 opacity-60"
                                }`}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                                    <T>City</T>
                                </label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={profile?.address?.city || ""}
                                    onChange={onInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-[var(--color-background)] text-[var(--color-text)] ${
                                        isEditing
                                            ? "border-[var(--color-text)]/30 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                            : "border-[var(--color-text)]/20 opacity-60"
                                    }`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                                    <T>ZIP Code</T>
                                </label>
                                <input
                                    type="text"
                                    name="address.zipCode"
                                    value={profile?.address?.zipCode || ""}
                                    onChange={onInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-[var(--color-background)] text-[var(--color-text)] ${
                                        isEditing
                                            ? "border-[var(--color-text)]/30 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                            : "border-[var(--color-text)]/20 opacity-60"
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
