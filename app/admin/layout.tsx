"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { Shield } from "lucide-react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";
import { getAdminSessionExpiry, logoutAdmin } from "../lib/firebase/admin";

const endAdminSession = async () => {
    await logoutAdmin();
    localStorage.removeItem("adminUser");
    window.location.replace("/admin/login");
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/admin/login") {
            setIsAuthenticated(true);
            return;
        }

        let expiryTimer: ReturnType<typeof setTimeout> | undefined;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            clearTimeout(expiryTimer);
            if (user && user.emailVerified) {
                const msLeft = (await getAdminSessionExpiry(user)) - Date.now();
                if (msLeft <= 0) {
                    await endAdminSession();
                    return;
                }
                const adminDoc = await getDoc(doc(db, "admins", user.uid));
                if (adminDoc.exists() && adminDoc.data().isActive) {
                    expiryTimer = setTimeout(endAdminSession, msLeft);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    router.push("/admin/login");
                }
            } else {
                setIsAuthenticated(false);
                router.push("/admin/login");
            }
        });

        // A page restored from the back/forward cache skips the auth check above, so reload it
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) window.location.reload();
        };
        window.addEventListener("pageshow", handlePageShow);

        return () => {
            unsubscribe();
            clearTimeout(expiryTimer);
            window.removeEventListener("pageshow", handlePageShow);
        };
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
        return (
            <LanguageProvider storageKey="preferred-language-admin">
                <ThemeProvider scope="admin">{children}</ThemeProvider>
            </LanguageProvider>
        );
    }

    return (
        <LanguageProvider storageKey="preferred-language-admin">
            <ThemeProvider scope="admin">
                <div className="min-h-screen bg-[var(--color-background)] flex">
                    <AdminSidebar />
                    <div className="flex-1 flex flex-col">
                        <AdminHeader />
                        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
                    </div>
                </div>
            </ThemeProvider>
        </LanguageProvider>
    );
}
