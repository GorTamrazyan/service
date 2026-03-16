"use client";

import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase";
import {
    checkEmailVerification,
    resendVerificationEmail,
} from "../../lib/firebase/auth-utils";

interface EmailVerificationCheckerProps {
    user: User;
    onVerified: () => void;
}

export default function EmailVerificationChecker({
    user,
    onVerified,
}: EmailVerificationCheckerProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [resendSent, setResendSent] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const checkVerification = async () => {
            try {
                const isVerified = await checkEmailVerification(user);
                if (isVerified) {
                    onVerified();
                }
            } catch (error) {
                console.error("Ошибка при проверке верификации:", error);
            }
        };

        checkVerification();

        const interval = setInterval(checkVerification, 5000);

        return () => clearInterval(interval);
    }, [user, onVerified]);

    const handleResendEmail = async () => {
        setIsChecking(true);
        setError("");

        try {
            await resendVerificationEmail(user);
            setResendSent(true);
        } catch (error) {
            setError("Ошибка при отправке email");
            console.error("Ошибка при повторной отправке:", error);
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                    <div className="text-6xl mb-4">📧</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Подтвердите ваш email
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Мы отправили письмо для подтверждения на адрес:
                        <br />
                        <strong>{user.email}</strong>
                    </p>
                    <p className="text-gray-600 mb-6">
                        Перейдите по ссылке в письме для завершения регистрации.
                        Страница автоматически обновится после подтверждения.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {resendSent && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
                            Email отправлен повторно. Проверьте вашу почту.
                        </div>
                    )}

                    <button
                        onClick={handleResendEmail}
                        disabled={isChecking}
                        className="w-full bg-[var(--color-accent)] hover:opacity-90 disabled:opacity-50 text-[var(--color-primary)] font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out"
                    >
                        {isChecking ? "Отправляется..." : "Отправить повторно"}
                    </button>

                    <p className="text-sm text-gray-500 mt-4">
                        Не получили письмо? Проверьте папку "Спам" или нажмите
                        кнопку выше.
                    </p>
                </div>
            </div>
        </div>
    );
}
