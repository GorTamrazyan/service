// components/profile/SidebarNavigation.tsx
import React from "react";
import { LogOut, User, ShoppingBag, Settings, Star } from "lucide-react";
import { SidebarNavigationProps } from "../../../types/profile";
import { T } from "../T";

export default function SidebarNavigation({
    profile,
    activeSection,
    onSectionChange,
    onLogout,
}: SidebarNavigationProps) {
    // Используем T компонент для переводов

    const menuItems = [
        {
            id: "personalInfo",
            title: <T>Personal Info</T>,
            description: <T>Manage personal details</T>,
            icon: User,
        },
        {
            id: "orders",
            title: <T>Orders</T>,
            description: <T>View order history</T>,
            icon: ShoppingBag,
        },
        {
            id: "settings",
            title: <T>Settings</T>,
            description: <T>Account preferences</T>,
            icon: Settings,
        },
    ];

    const getInitials = () => {
        const firstName = profile.firstName || "J";
        const lastName = profile.lastName || "D";
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    return (
        <div className="bg-[var(--color-secondary)] text-[var(--color-text)] flex flex-col shadow-2xl lg:h-full">
            {/* Header */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)]">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                            <span className="text-base sm:text-lg lg:text-xl font-bold text-white">
                                {getInitials()}
                            </span>
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                <Star className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-white truncate">
                            {profile.firstName} {profile.lastName}
                        </h2>
                        <p className="text-white/80 text-xs sm:text-sm opacity-90 truncate">
                            {profile.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2 lg:flex lg:flex-col lg:space-y-2">
                <div className="flex lg:flex-col justify-center lg:justify-start space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                className={`flex-shrink-0 lg:w-full p-2 sm:p-3 lg:p-4 text-left flex lg:flex-row flex-col lg:items-center items-center gap-1 sm:gap-2 lg:gap-4 rounded-lg lg:rounded-xl transition-all duration-200 group w-20 md:w-24 lg:w-full lg:min-w-0 ${
                                    isActive
                                        ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] shadow-lg transform scale-105"
                                        : "hover:bg-[var(--color-text)]/10 hover:transform hover:scale-105"
                                }`}
                                onClick={() => onSectionChange(item.id)}
                            >
                                <div
                                    className={`p-1.5 sm:p-2 rounded-md lg:rounded-lg transition-all duration-200 flex-shrink-0 ${
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-[var(--color-text)]/20 text-[var(--color-text)] group-hover:bg-[var(--color-text)]/30 group-hover:text-white"
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>

                                {/* Mobile: show below icon, Desktop: show to the right */}
                                <div className="flex-1 lg:block">
                                    <div
                                        className={`text-xs sm:text-sm lg:text-base font-semibold transition-colors duration-200 text-center lg:text-left ${
                                            isActive
                                                ? "text-white"
                                                : "text-[var(--color-text)] group-hover:text-white"
                                        }`}
                                    >
                                        {item.title}
                                    </div>
                                    <div
                                        className={`text-xs transition-colors duration-200 text-center lg:text-left hidden lg:block ${
                                            isActive
                                                ? "text-white/80"
                                                : "text-[var(--color-text)]/60 group-hover:text-white/80"
                                        }`}
                                    >
                                        {item.description}
                                    </div>
                                </div>

                                {isActive && (
                                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full animate-pulse hidden lg:block"></div>
                                )}
                            </button>
                        );
                    })}
                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        className="w-20 md:w-24 lg:w-full p-2 sm:p-3 lg:p-4 text-left flex lg:flex-row flex-col lg:items-center items-center gap-1 sm:gap-2 lg:gap-4 rounded-lg lg:rounded-xl text-[var(--color-text)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                    >
                        <div className="p-1.5 sm:p-2 rounded-md lg:rounded-lg bg-[var(--color-text)]/20 text-[var(--color-text)]/60 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all duration-200 flex-shrink-0">
                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 lg:block">
                            <div className="text-xs sm:text-sm lg:text-base font-semibold text-center lg:text-left">
                                <T>Sign Out</T>
                            </div>
                            <div className="text-xs text-[var(--color-text)]/60 text-center lg:text-left hidden lg:block">
                                <T>End your session</T>
                            </div>
                        </div>
                    </button>
                </div>
            </nav>
        </div>
    );
}
