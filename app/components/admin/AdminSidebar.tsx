// components/admin/AdminSidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { T } from "../T";
import { logoutAdmin } from "../../lib/firebase/admin";

const menuItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin"
    },
    {
        title: "Products",
        icon: Package,
        href: "/admin/products"
    },
    {
        title: "Orders",
        icon: ShoppingCart,
        href: "/admin/orders"
    },
    {
        title: "Users",
        icon: Users,
        href: "/admin/users"
    },
    {
        title: "Analytics",
        icon: BarChart3,
        href: "/admin/analytics"
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/admin/settings"
    }
];

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <div className={`bg-[var(--color-secondary)] border-r border-[var(--color-text)]/10 transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
        }`}>
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--color-text)]/10">
                    {!isCollapsed && (
                        <div className="flex items-center space-x-3">
                            {/* Fence Logo */}
                            <div className="text-[var(--color-accent)]">
                                <svg width="32" height="24" viewBox="0 0 60 40" fill="currentColor">
                                    <rect x="8" y="8" width="6" height="24" />
                                    <rect x="18" y="8" width="6" height="24" />
                                    <rect x="28" y="8" width="6" height="24" />
                                    <rect x="38" y="8" width="6" height="24" />
                                    <rect x="4" y="12" width="44" height="4" />
                                    <rect x="4" y="20" width="44" height="4" />
                                    <polygon points="8,8 11,4 14,8" />
                                    <polygon points="18,8 21,4 24,8" />
                                    <polygon points="28,8 31,4 34,8" />
                                    <polygon points="38,8 41,4 44,8" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-[var(--color-primary)]">
                                    ADMIN
                                </h1>
                                <p className="text-xs text-[var(--color-text)]/70">
                                    ONIK'S VINYL
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-[var(--color-background)]/20 transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-[var(--color-text)]" />
                        ) : (
                            <ChevronLeft className="w-4 h-4 text-[var(--color-text)]" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    isActive 
                                        ? 'bg-[var(--color-accent)] text-white shadow-lg' 
                                        : 'text-[var(--color-text)] hover:bg-[var(--color-background)]/30'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${
                                    isActive ? 'text-white' : 'text-[var(--color-text)] group-hover:text-[var(--color-accent)]'
                                }`} />
                                {!isCollapsed && (
                                    <span className={`font-medium ${
                                        isActive ? 'text-white' : 'text-[var(--color-text)]'
                                    }`}>
                                        <T>{item.title}</T>
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-[var(--color-text)]/10">
                    <button 
                        onClick={async () => {
                            try {
                                const sessionToken = localStorage.getItem("adminSessionToken");
                                if (sessionToken) {
                                    await logoutAdmin(sessionToken);
                                }
                                localStorage.removeItem("adminSessionToken");
                                localStorage.removeItem("adminUser");
                                window.location.href = "/admin/login";
                            } catch (error) {
                                console.error("Logout error:", error);
                                // Even if logout fails, clear local storage and redirect
                                localStorage.removeItem("adminSessionToken");
                                localStorage.removeItem("adminUser");
                                window.location.href = "/admin/login";
                            }
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors hover:bg-red-500/10 text-red-500 hover:text-red-600 ${
                            isCollapsed ? 'justify-center' : ''
                        }`}
                    >
                        <LogOut className="w-5 h-5" />
                        {!isCollapsed && (
                            <span className="font-medium">
                                <T>Logout</T>
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}