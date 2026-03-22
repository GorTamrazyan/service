"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { Shield } from "lucide-react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";

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

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.emailVerified) {
                const adminDoc = await getDoc(doc(db, "admins", user.uid));
                if (adminDoc.exists() && adminDoc.data().isActive) {
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

        return () => unsubscribe();
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
