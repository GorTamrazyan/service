"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "../../hooks/useAuthState";
import EmailVerificationChecker from "./EmailVerificationChecker";
import { useRouter } from "next/navigation";
import { T } from "./T";

interface EmailVerificationWrapperProps {
    children: React.ReactNode;
    requireVerification?: boolean;
}

export default function EmailVerificationWrapper({
    children,
    requireVerification = true,
}: EmailVerificationWrapperProps) {
    const [user, loading, error] = useAuthState();
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user && requireVerification) {
            
            const isGoogleUser = user.providerData.some(
                (provider) => provider.providerId === "google.com",
            );
            const isAppleUser = user.providerData.some(
                (provider) => provider.providerId === "apple.com",
            );

            console.log("EmailVerificationWrapper: checking user", {
                email: user.email,
                emailVerified: user.emailVerified,
                isGoogleUser,
                isAppleUser,
                providerData: user.providerData,
            });

            if (isGoogleUser || isAppleUser || user.emailVerified) {
                console.log("EmailVerificationWrapper: user verified");
                setIsVerified(true);
            } else {
                console.log("EmailVerificationWrapper: user not verified");
                setIsVerified(false);
            }
        } else if (!requireVerification) {
            setIsVerified(true);
        }
    }, [user, requireVerification]);

    const handleVerified = () => {
        setIsVerified(true);
        
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-[var(--color-text)]">
                    <T>Loading...</T>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-red-600">
                    <T>Error</T>: {error.message}
                </div>
            </div>
        );
    }

    if (!user) {
        
        router.push("/client/sign-in");
        return null;
    }

    if (requireVerification && !isVerified) {
        return (
            <EmailVerificationChecker user={user} onVerified={handleVerified} />
        );
    }

    return <>{children}</>;
}
