// components/profile/ProfileContent.tsx
import React from "react";
import { ProfileContentProps } from "../../types/profile";
import PersonalInfoPanel from "./panels/PersonalInfoPanel";
import OrdersPanel from "./panels/OrdersPanel";
import SettingsPanel from "./panels/SettingsPanel";

export default function ProfileContent({
    profile,
    activeSection,
    isEditing,
    onInputChange,
    onEdit,
    onSave,
    onCancel,
}: ProfileContentProps) {
    return (
        <div className="max-w-4xl mx-auto w-full">
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
    );
}
