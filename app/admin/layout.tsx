// admin/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { Shield } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip authentication check for login page
        if (pathname === "/admin/login") {
            setIsAuthenticated(true);
            return;
        }

        const checkAuth = async () => {
            const sessionToken = localStorage.getItem("adminSessionToken");
            if (sessionToken) {
                // In a real app, verify session with server
                // For now, just check if token exists
                const adminUser = localStorage.getItem("adminUser");
                if (adminUser) {
                    try {
                        const userData = JSON.parse(adminUser);
                        const loginTime = new Date(userData.loginTime);
                        const now = new Date();
                        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
                        
                        // Session valid for 8 hours
                        if (hoursSinceLogin < 8) {
                            setIsAuthenticated(true);
                            return;
                        }
                    } catch (error) {
                        console.error("Error parsing admin user data:", error);
                    }
                }
            }
            
            // Clear invalid session and redirect
            localStorage.removeItem("adminSessionToken");
            localStorage.removeItem("adminUser");
            setIsAuthenticated(false);
            router.push("/admin/login");
        };

        // Small delay to ensure client-side rendering
        setTimeout(checkAuth, 100);
    }, [pathname, router]);

    // Loading state
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-text)]/70">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated and not on login page
    if (isAuthenticated === false && pathname !== "/admin/login") {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-4" />
                    <p className="text-[var(--color-text)]/70">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Login page - render without sidebar/header
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Authenticated - render full admin layout
    return (
        <div className="min-h-screen bg-[var(--color-background)] flex">
            {/* Sidebar */}
            <AdminSidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}