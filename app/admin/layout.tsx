"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { Shield } from "lucide-react";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        
        if (pathname === "/admin/login") {
            setIsAuthenticated(true);
            return;
        }

        const checkAuth = async () => {
            const sessionToken = localStorage.getItem("adminSessionToken");
            if (sessionToken) {
                
                const adminUser = localStorage.getItem("adminUser");
                if (adminUser) {
                    try {
                        const userData = JSON.parse(adminUser);
                        const loginTime = new Date(userData.loginTime);
                        const now = new Date();
                        const hoursSinceLogin =
                            (now.getTime() - loginTime.getTime()) /
                            (1000 * 60 * 60);

                        if (hoursSinceLogin < 8) {
                            setIsAuthenticated(true);
                            return;
                        }
                    } catch (error) {
                        console.error("Error parsing admin user data:", error);
                    }
                }
            }

            localStorage.removeItem("adminSessionToken");
            localStorage.removeItem("adminUser");
            setIsAuthenticated(false);
            router.push("/admin/login");
        };

        setTimeout(checkAuth, 100);
    }, [pathname, router]);

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

    if (isAuthenticated === false && pathname !== "/admin/login") {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-4" />
                    <p className="text-[var(--color-text)]/70">
                        Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    if (pathname === "/admin/login") {
        return <ThemeProvider scope="admin">{children}</ThemeProvider>;
    }

    return (
        <ThemeProvider scope="admin">
            <div className="min-h-screen bg-[var(--color-background)] flex">

                <AdminSidebar />

                <div className="flex-1 flex flex-col">
                    <AdminHeader />
                    <main className="flex-1 p-8 overflow-y-auto">{children}</main>
                </div>
            </div>
        </ThemeProvider>
    );
}
