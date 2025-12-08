// components/GuestBrowsingWrapper.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "../../hooks/useAuthState";
import EmailVerificationChecker from "./EmailVerificationChecker";

interface GuestBrowsingWrapperProps {
    children: React.ReactNode;
}

export default function GuestBrowsingWrapper({
    children,
}: GuestBrowsingWrapperProps) {
    const [user, loading, error] = useAuthState();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (user) {
            // Пользователи Google автоматически верифицированы
            const isGoogleUser = user.providerData.some(
                (provider) => provider.providerId === "google.com"
            );
            const isAppleUser = user.providerData.some(
                (provider) => provider.providerId === "apple.com"
            );

            if (isGoogleUser || isAppleUser || user.emailVerified) {
                setIsVerified(true);
            } else {
                setIsVerified(false);
            }
        } else {
            setIsVerified(true);
        }
    }, [user]);

    const handleVerified = () => {
        setIsVerified(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-[var(--color-text)]">Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-red-600">Ошибка: {error.message}</div>
            </div>
        );
    }

    if (user && !isVerified) {
        return (
            <EmailVerificationChecker user={user} onVerified={handleVerified} />
        );
    }

    return <>{children}</>;
}
