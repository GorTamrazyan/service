// components/admin/AdminHeader.tsx
"use client";

import React, { useState } from "react";
import { Bell, Search, User, Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { T } from "../T";

export default function AdminHeader() {
    const [searchQuery, setSearchQuery] = useState("");
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="bg-[var(--color-background)] border-b border-[var(--color-text)]/10 px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Search */}
                <div className="flex items-center gap-6 flex-1 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text)]/50" />
                        <input
                            type="text"
                            placeholder="Search products, orders, users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-secondary)]/30 text-[var(--color-text)] placeholder-[var(--color-text)]/50 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-[var(--color-secondary)]/50 transition-colors"
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-[var(--color-text)]" />
                        ) : (
                            <Moon className="w-5 h-5 text-[var(--color-text)]" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button className="p-2 rounded-lg hover:bg-[var(--color-secondary)]/50 transition-colors">
                            <Bell className="w-5 h-5 text-[var(--color-text)]" />
                            {/* Notification badge */}
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                3
                            </span>
                        </button>
                    </div>

                    {/* Admin Profile */}
                    <div className="relative">
                        <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-secondary)]/50 transition-colors">
                            <div className="bg-[var(--color-accent)] rounded-full p-2">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-medium text-[var(--color-primary)]">
                                    Admin User
                                </p>
                                <p className="text-xs text-[var(--color-text)]/60">
                                    <T>Administrator</T>
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Breadcrumb or Page Info */}
            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-[var(--color-text)]/60">
                        <T>Today:</T> {new Date().toLocaleDateString('ru-RU', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                        <p className="text-[var(--color-text)]/60"><T>Online Users</T></p>
                        <p className="font-bold text-green-500">12</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[var(--color-text)]/60"><T>Pending Orders</T></p>
                        <p className="font-bold text-yellow-500">5</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[var(--color-text)]/60"><T>Low Stock</T></p>
                        <p className="font-bold text-red-500">2</p>
                    </div>
                </div>
            </div>
        </header>
    );
}