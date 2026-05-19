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

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-serif text-2xl font-semibold text-[var(--color-primary)]">
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
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-full hover:bg-[var(--color-text)]/5 transition-colors"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                        <T>Cancel</T>
                                    </button>
                                    <button
                                        onClick={onSave}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                                    >
                                        <FaSave className="w-4 h-4" />
                                        <T>Save Changes</T>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onEdit}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                                >
                                    <FaEdit className="w-4 h-4" />
                                    <T>Edit Profile</T>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
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
