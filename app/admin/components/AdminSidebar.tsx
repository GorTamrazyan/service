"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Package,
    Wrench,
    ShoppingCart,
    Users,
    UserCog,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { T } from "../../client/components/T";
import { logoutAdmin } from "../../lib/firebase/admin";

const menuItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
        permission: null,
    },
    {
        title: "Products",
        icon: Package,
        href: "/admin/products",
        permission: "manage_products",
    },
    {
        title: "Services",
        icon: Wrench,
        href: "/admin/service_consultation",
        permission: "manage_products",
    },
    {
        title: "Consultation",
        icon: Calendar,
        href: "/admin/consultation",
        permission: "manage_orders",
    },
    {
        title: "Orders",
        icon: ShoppingCart,
        href: "/admin/orders",
        permission: "manage_orders",
    },
    {
        title: "Users",
        icon: Users,
        href: "/admin/users",
        permission: "manage_users",
    },
    {
        title: "Admins",
        icon: UserCog,
        href: "/admin/admins",
        permission: "manage_admins",
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/admin/settings",
        permission: "manage_settings",
    },
];

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [permissions, setPermissions] = useState<string[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        try {
            const raw = localStorage.getItem("adminUser");
            if (raw) {
                const data = JSON.parse(raw);
                setPermissions(data.permissions || []);
            }
        } catch {
            setPermissions([]);
        }
    }, []);

    const visibleItems = menuItems.filter(
        (item) => !item.permission || permissions.includes(item.permission)
    );

    return (
        <div
            className={`bg-[var(--color-secondary)] border-r border-[var(--color-text)]/10 transition-all duration-300 ${
                isCollapsed ? "w-24" : "w-64"
            }`}
        >
            <div className="flex flex-col h-full">

                <div className="flex items-center justify-between p-6 border-b border-[var(--color-text)]/10">
                    <div className="flex items-center space-x-3">
                        <div className="text-[var(--color-accent)]">
                            <svg
                                width="32"
                                height="24"
                                viewBox="0 0 60 40"
                                fill="currentColor"
                            >
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
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-lg font-bold text-[var(--color-primary)]">
                                    ADMIN
                                </h1>
                                <p className="text-xs text-[var(--color-text)]/70">
                                    ONIK'S VINYL
                                </p>
                            </div>
                        )}
                    </div>

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

                <nav className="flex-1 p-4 space-y-2">
                    {visibleItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    isActive
                                        ? "bg-[var(--color-accent)] text-white shadow-lg"
                                        : "text-[var(--color-text)] hover:bg-[var(--color-background)]/30"
                                }`}
                            >
                                <Icon
                                    className={`w-5 h-5 ${
                                        isActive
                                            ? "text-white"
                                            : "text-[var(--color-text)] group-hover:text-[var(--color-accent)]"
                                    }`}
                                />
                                {!isCollapsed && (
                                    <span
                                        className={`font-medium ${
                                            isActive
                                                ? "text-white"
                                                : "text-[var(--color-text)] group-hover:text-[var(--color-accent)]"
                                        }`}
                                    >
                                        <T>{item.title}</T>
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    <button
                        onClick={async () => {
                            try {
                                await logoutAdmin();
                                localStorage.removeItem("adminUser");
                                window.location.href = "/admin/login";
                            } catch (error) {
                                console.error("Logout error:", error);
                                window.location.href = "/admin/login";
                            }
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors hover:bg-red-500/10 text-red-500 hover:text-red-600 ${
                            isCollapsed ? "justify-center" : ""
                        }`}
                    >
                        <LogOut className="w-5 h-5" />
                        {!isCollapsed && (
                            <span className="font-medium">
                                <T>Logout</T>
                            </span>
                        )}
                    </button>
                </nav>
            </div>
        </div>
    );
}
