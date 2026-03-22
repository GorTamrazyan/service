"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase/firebase";
import { AdminUser } from "../../lib/firebase/admin";

interface AdminProtectionProps {
    children: React.ReactNode;
    requiredPermission?: string;
}

export default function AdminProtection({ children, requiredPermission }: AdminProtectionProps) {
    const [status, setStatus] = useState<"loading" | "allowed" | "denied" | "no_permission">("loading");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.emailVerified) {
                const adminDoc = await getDoc(doc(db, "admins", user.uid));
                if (adminDoc.exists() && adminDoc.data().isActive) {
                    const adminData = adminDoc.data() as Omit<AdminUser, 'id'>;
                    if (requiredPermission && !adminData.permissions.includes(requiredPermission)) {
                        setStatus("no_permission");
                    } else {
                        setStatus("allowed");
                    }
                } else {
                    setStatus("denied");
                }
            } else {
                setStatus("denied");
            }
        });

        return () => unsubscribe();
    }, [requiredPermission]);

    useEffect(() => {
        if (status === "denied") {
            router.push("/admin/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-text)]/70">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (status === "no_permission") {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-[var(--color-text)]/30 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[var(--color-primary)] mb-2">Access Denied</h2>
                    <p className="text-[var(--color-text)]/60">You don't have permission to view this page.</p>
                </div>
            </div>
        );
    }

    if (status === "denied") {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-4" />
                    <p className="text-[var(--color-text)]/70">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
