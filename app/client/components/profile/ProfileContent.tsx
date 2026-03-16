import React from "react";
import { ProfileContentProps } from "../../../types/profile";
import PersonalInfoPanel from "./panels/PersonalInfoPanel";
import OrdersPanel from "./panels/OrdersPanel";
import SettingsPanel from "./panels/SettingsPanel";
import {
    FaEdit,
    FaSave,
    FaTimes,
    FaUserCircle,
    FaHistory,
    FaCog,
} from "react-icons/fa";
import { T } from "../T";

export default function ProfileContent({
    profile,
    activeSection,
    isEditing,
    onInputChange,
    onEdit,
    onSave,
    onCancel,
}: ProfileContentProps) {
    const navItems = [
        { id: "personalInfo", label: "Personal Info", icon: FaUserCircle },
        { id: "orders", label: "Orders", icon: FaHistory },
        { id: "settings", label: "Settings", icon: FaCog },
    ];

    const currentSection = navItems.find((item) => item.id === activeSection);

    return (
        <div className="max-w-4xl mx-auto w-full">

            <div className="bg-[var(--color-secondary)] rounded-2xl shadow-xl p-6 border border-[var(--color-text)]/10 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-[var(--color-text)]">
                            {activeSection === "personalInfo" && <T>Personal Info</T>}
                            {activeSection === "orders" && <T>Orders</T>}
                            {activeSection === "settings" && <T>Settings</T>}
                        </h2>
                        <p className="text-[var(--color-text)]/70 mt-1">
                            {activeSection === "personalInfo" && (
                                <T>Update your personal information</T>
                            )}
                            {activeSection === "orders" && (
                                <T>View your past orders and invoices</T>
                            )}
                            {activeSection === "settings" && (
                                <T>Configure your account preferences</T>
                            )}
                        </p>
                    </div>
                    {activeSection === "personalInfo" && (
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={onCancel}
                                        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-text)]/30 text-[var(--color-text)] rounded-lg hover:bg-[var(--color-text)]/10 transition-colors"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                        <T>Cancel</T>
                                    </button>
                                    <button
                                        onClick={onSave}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/90 text-[var(--color-primary)] font-bold rounded-lg hover:scale-105 transition-all"
                                    >
                                        <FaSave className="w-4 h-4" />
                                        <T>Save Changes</T>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onEdit}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white font-bold rounded-lg hover:scale-105 transition-all"
                                >
                                    <FaEdit className="w-4 h-4" />
                                    <T>Edit Profile</T>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[var(--color-secondary)] rounded-2xl shadow-xl p-6 border border-[var(--color-text)]/10">
                {activeSection === "personalInfo" && (
                    <PersonalInfoPanel
                        profile={profile}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        onEdit={onEdit}
                        onSave={onSave}
                        onCancel={onCancel}
                    />
                )}
                {activeSection === "orders" && <OrdersPanel />}
                {activeSection === "settings" && <SettingsPanel />}
            </div>
        </div>
    );
}
