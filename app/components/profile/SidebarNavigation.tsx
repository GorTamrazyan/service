// components/profile/SidebarNavigation.tsx
import React from "react";
import { LogOut, User, ShoppingBag, Settings, Star } from "lucide-react";
import { SidebarNavigationProps } from "../../types/profile";
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
        <div className="w-80 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-700 dark:to-slate-600 text-white dark:text-[var(--color-text)] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                            <span className="text-xl font-bold text-white">
                                {getInitials()}
                            </span>
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                <Star className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">
                            {profile.firstName || "John"} {profile.lastName || "Doe"}
                        </h2>
                        <p className="text-blue-100 text-sm opacity-90 truncate">
                            {profile.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                        <button
                            key={item.id}
                            className={`w-full p-4 text-left flex items-center gap-4 rounded-xl transition-all duration-200 group ${
                                isActive
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105"
                                    : "hover:bg-slate-700/50 hover:transform hover:scale-105"
                            }`}
                            onClick={() => onSectionChange(item.id)}
                        >
                            <div className={`p-2 rounded-lg transition-all duration-200 ${
                                isActive 
                                    ? "bg-white/20 text-white" 
                                    : "bg-slate-700 text-slate-300 group-hover:bg-slate-600 group-hover:text-white"
                            }`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className={`font-semibold transition-colors duration-200 ${
                                    isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                                }`}>
                                    {item.title}
                                </div>
                                <div className={`text-xs transition-colors duration-200 ${
                                    isActive ? "text-blue-100" : "text-slate-400 group-hover:text-slate-300"
                                }`}>
                                    {item.description}
                                </div>
                            </div>
                            {isActive && (
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={onLogout}
                    className="w-full p-4 text-left flex items-center gap-4 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                >
                    <div className="p-2 rounded-lg bg-slate-700 text-slate-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all duration-200">
                        <LogOut className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold"><T>Sign Out</T></div>
                        <div className="text-xs text-slate-400"><T>End your session</T></div>
                    </div>
                </button>
            </div>
        </div>
    );
}
