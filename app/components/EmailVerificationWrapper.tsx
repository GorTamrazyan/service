// components/EmailVerificationWrapper.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import EmailVerificationChecker from './EmailVerificationChecker';
import { useRouter } from 'next/navigation';

interface EmailVerificationWrapperProps {
    children: React.ReactNode;
    requireVerification?: boolean;
}

export default function EmailVerificationWrapper({
    children,
    requireVerification = true
}: EmailVerificationWrapperProps) {
    const [user, loading, error] = useAuthState();
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user && requireVerification) {
            // Пользователи Google автоматически верифицированы
            const isGoogleUser = user.providerData.some(provider => provider.providerId === 'google.com');
            const isAppleUser = user.providerData.some(provider => provider.providerId === 'apple.com');

            console.log('EmailVerificationWrapper: проверка пользователя', {
                email: user.email,
                emailVerified: user.emailVerified,
                isGoogleUser,
                isAppleUser,
                providerData: user.providerData
            });

            if (isGoogleUser || isAppleUser || user.emailVerified) {
                console.log('EmailVerificationWrapper: пользователь верифицирован');
                setIsVerified(true);
            } else {
                console.log('EmailVerificationWrapper: пользователь не верифицирован');
                setIsVerified(false);
            }
        } else if (!requireVerification) {
            setIsVerified(true);
        }
    }, [user, requireVerification]);

    const handleVerified = () => {
        setIsVerified(true);
        // Просто обновляем состояние, не перезагружаем страницу
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

    if (!user) {
        // Пользователь не авторизован - перенаправляем на страницу входа
        router.push('/client/sign-in');
        return null;
    }

    if (requireVerification && !isVerified) {
        return <EmailVerificationChecker user={user} onVerified={handleVerified} />;
    }

    return <>{children}</>;
}