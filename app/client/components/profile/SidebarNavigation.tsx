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

            <div className="bg-[var(--color-secondary)] rounded-2xl shadow-xl p-6 border border-[var(--color-text)]/10">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] p-1 mb-4">
                        <div className="w-full h-full rounded-full bg-[var(--color-secondary)] flex items-center justify-center">
                            <FaUserCircle className="w-20 h-20 text-[var(--color-primary)]" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text)]">
                        {profile?.firstName} {profile?.lastName}
                    </h3>
                    <p className="text-[var(--color-text)]/70 text-sm mt-1">
                        {profile?.email}
                    </p>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                activeSection === item.id
                                    ? "bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border-l-4 border-[var(--color-accent)]"
                                    : "hover:bg-[var(--color-text)]/5"
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                            <span className="font-medium text-[var(--color-text)]">
                                <T>{item.title}</T>
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">
                    <T>Account Overview</T>
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">
                            <T>Member Since</T>
                        </span>
                        <span className="font-semibold">2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">
                            <T>Total Orders</T>
                        </span>
                        <span className="font-semibold">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">
                            <T>Wishlist Items</T>
                        </span>
                        <span className="font-semibold">0</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onLogout}
                className="w-full group inline-flex items-center justify-center gap-2 border-2 border-red-300 hover:border-red-500 text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
                <FaSignOutAlt className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <T>Sign Out</T>
            </button>
        </div>
    );
}
