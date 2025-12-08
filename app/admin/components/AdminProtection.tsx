// components/admin/AdminProtection.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

interface AdminProtectionProps {
    children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const checkAuth = () => {
            try {
                const sessionToken = localStorage.getItem("adminSessionToken");
                const adminUser = localStorage.getItem("adminUser");

                console.log("Checking auth:", { sessionToken, adminUser });

                if (sessionToken && adminUser) {
                    try {
                        const userData = JSON.parse(adminUser);
                        const loginTime = new Date(userData.loginTime);
                        const now = new Date();
                        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
                        
                        console.log("Hours since login:", hoursSinceLogin);
                        
                        // Session expires after 8 hours
                        if (hoursSinceLogin < 8) {
                            console.log("User is authenticated");
                            setIsAuthenticated(true);
                        } else {
                            console.log("Session expired");
                            // Clear expired session
                            localStorage.removeItem("adminSessionToken");
                            localStorage.removeItem("adminUser");
                            setIsAuthenticated(false);
                        }
                    } catch (parseError) {
                        console.error("Error parsing admin user data:", parseError);
                        localStorage.removeItem("adminSessionToken");
                        localStorage.removeItem("adminUser");
                        setIsAuthenticated(false);
                    }
                } else {
                    console.log("No valid admin session found");
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && isAuthenticated === false) {
            console.log("Redirecting to login page");
            router.push("/admin/login");
        }
    }, [isAuthenticated, router, isMounted]);

    // Don't render anything until mounted (prevents hydration mismatch)
    if (!isMounted) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-text)]/70">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated === null) {
        // Loading state
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-text)]/70">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated === false) {
        // Redirecting to login
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-4" />
                    <p className="text-[var(--color-text)]/70">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // User is authenticated
    return <>{children}</>;
}