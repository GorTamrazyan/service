import React from "react";
import {
    FaSignOutAlt,
    FaUserCircle,
    FaShoppingBag,
    FaCog,
    FaStar,
} from "react-icons/fa";
import { SidebarNavigationProps } from "../../../types/profile";
import { T } from "../T";

export default function SidebarNavigation({
    profile,
    activeSection,
    onSectionChange,
    onLogout,
}: SidebarNavigationProps) {
    const menuItems = [
        {
            id: "personalInfo",
            title: "Personal Info",
            description: "Manage personal details",
            icon: FaUserCircle,
            color: "text-blue-500",
        },
        {
            id: "orders",
            title: "Orders",
            description: "View order history",
            icon: FaShoppingBag,
            color: "text-green-500",
        },
        {
            id: "settings",
            title: "Settings",
            description: "Account preferences",
            icon: FaCog,
            color: "text-purple-500",
        },
    ];

    const getInitials = () => {
        const firstName = profile.firstName || "J";
        const lastName = profile.lastName || "D";
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    return (
        <div className="sticky top-8 space-y-6">

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-20 h-20 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-background)] flex items-center justify-center mb-4">
                        <FaUserCircle className="w-16 h-16 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[var(--color-primary)]">
                        {profile?.firstName} {profile?.lastName}
                    </h3>
                    <p className="text-[var(--color-text)]/70 text-sm mt-1">
                        {profile?.email}
                    </p>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                activeSection === item.id
                                    ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)]"
                                    : "hover:bg-[var(--color-text)]/5 text-[var(--color-text)]"
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">
                                <T>{item.title}</T>
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
                <h3 className="font-serif text-base font-semibold text-[var(--color-primary)] mb-4">
                    <T>Account Overview</T>
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text)]/70">
                            <T>Member Since</T>
                        </span>
                        <span className="font-semibold text-[var(--color-text)]">2024</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text)]/70">
                            <T>Total Orders</T>
                        </span>
                        <span className="font-semibold text-[var(--color-text)]">0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text)]/70">
                            <T>Wishlist Items</T>
                        </span>
                        <span className="font-semibold text-[var(--color-text)]">0</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onLogout}
                className="w-full inline-flex items-center justify-center gap-2 border border-red-300 hover:border-red-500 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-full transition-colors"
            >
                <FaSignOutAlt className="w-4 h-4" />
                <T>Sign Out</T>
            </button>
        </div>
    );
}
