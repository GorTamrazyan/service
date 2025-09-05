// components/profile/SidebarNavigation.tsx
import React from "react";
import { LogOut, ChevronRight, Link } from "lucide-react";
import { SidebarNavigationProps } from "../../types/profile";

export default function SidebarNavigation({
    profile,
    activeSection,
    onSectionChange,
    onLogout,
}: SidebarNavigationProps) {
    const menuItems = [
        {
            id: "orders",
            title: "Orders",
            description: "View your order history",
        },
        {
            id: "settings",
            title: "Settings",
            description: "Change your account settings",
        },
        {
            id: "personalInfo",
            title: "Personal Info",
            description: "Update your personal information",
        },
    ];

    return (
        <div className="w-80 bg-[#2d3748] text-white flex flex-col">
            {/* Заголовок Profile */}
            <div className="p-6">
                <h1 className="text-2xl font-bold">Profile</h1>
            </div>

            {/* Профиль пользователя с аватаром */}
            <div className="px-6 pb-8">
                <div className="flex items-center space-x-4">
                    {/* Аватар */}
                    <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-[#a0896b] rounded-full"></div>
                    </div>
                    {/* Информация о пользователе */}
                    <div>
                        <h2 className="font-semibold text-lg">
                            {profile.firstName || "John"}{" "}
                            {profile.lastName || "Doe"}
                        </h2>
                        <p className="text-gray-300 text-sm">{profile.email}</p>
                    </div>
                </div>
            </div>

            {/* Навигационное меню */}
            <nav className="flex-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-600 transition-colors ${
                            activeSection === item.id ? "bg-gray-600" : ""
                        }`}
                        onClick={() => onSectionChange(item.id)}
                    >
                        <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-300">
                                {item.description}
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                ))}
            </nav>

            {/* Кнопка выхода */}
            <div className="p-6 border-t border-gray-600">
                <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left flex items-center text-gray-300 hover:text-white transition-colors"
                >
                    <LogOut className="mr-3 w-5 h-5" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
