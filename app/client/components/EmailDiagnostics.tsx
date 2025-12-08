// components/EmailDiagnostics.tsx
"use client";

import React, { useState } from "react";
import { auth } from "../../lib/firebase/firebase";
import { sendEmailVerification, User } from "firebase/auth";

interface EmailDiagnosticsProps {
    user?: User;
}

export default function EmailDiagnostics({ user }: EmailDiagnosticsProps) {
    const [testing, setTesting] = useState(false);
    const [results, setResults] = useState<string[]>([]);

    const addResult = (message: string) => {
        setResults((prev) => [
            ...prev,
            `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
    };

    const testEmailSending = async () => {
        setTesting(true);
        setResults([]);

        try {
            const currentUser = user || auth.currentUser;

            if (!currentUser) {
                addResult("❌ Пользователь не авторизован");
                setTesting(false);
                return;
            }

            addResult(
                `🔍 Тестирование отправки email для: ${currentUser.email}`
            );
            addResult(
                `📧 Email верифицирован: ${
                    currentUser.emailVerified ? "Да" : "Нет"
                }`
            );

            // Проверяем настройки Firebase
            addResult("🔧 Проверка настроек Firebase...");
            addResult(`🆔 UID пользователя: ${currentUser.uid}`);
            addResult(
                `📱 Провайдеры: ${currentUser.providerData
                    .map((p) => p.providerId)
                    .join(", ")}`
            );

            // Попытка отправки email
            addResult("📤 Попытка отправки email...");

            await sendEmailVerification(currentUser, {
                url: `${window.location.origin}/client/dashboard/home`,
                handleCodeInApp: false,
            });

            addResult("✅ Email успешно отправлен!");
            addResult("📋 Проверьте:");
            addResult("   • Папку 'Входящие'");
            addResult("   • Папку 'Спам/Нежелательная почта'");
            addResult("   • Папку 'Промокции' (Gmail)");
            addResult("   • Настройки безопасности почты");
        } catch (error: any) {
            addResult(`❌ Ошибка отправки: ${error.message}`);
            addResult(`🔍 Код ошибки: ${error.code || "Неизвестно"}`);

            // Анализ распространенных ошибок
            if (error.code === "auth/too-many-requests") {
                addResult("⚠️ Слишком много запросов. Попробуйте позже.");
            } else if (error.code === "auth/user-not-found") {
                addResult("⚠️ Пользователь не найден в системе.");
            } else if (error.code === "auth/invalid-email") {
                addResult("⚠️ Неверный формат email адреса.");
            }
        } finally {
            setTesting(false);
        }
    };

    const clearResults = () => {
        setResults([]);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🔧 Диагностика Email Верификации
                </h3>
                <p className="text-gray-600 text-sm">
                    Этот инструмент поможет определить проблемы с отправкой
                    email для верификации.
                </p>
            </div>

            <div className="flex gap-3 mb-4">
                <button
                    onClick={testEmailSending}
                    disabled={testing}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    {testing ? "🔄 Тестируется..." : "🧪 Тестировать отправку"}
                </button>

                <button
                    onClick={clearResults}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    🗑️ Очистить
                </button>
            </div>

            {results.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                    <h4 className="font-semibold text-gray-900 mb-3">
                        📊 Результаты диагностики:
                    </h4>
                    <div className="space-y-1">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className="text-sm font-mono text-gray-700"
                            >
                                {result}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                    💡 Частые причины проблем:
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Email попал в папку спам</li>
                    <li>• Настройки безопасности почтового провайдера</li>
                    <li>• Превышен лимит отправки Firebase</li>
                    <li>• Неправильные настройки домена в Firebase</li>
                    <li>• Блокировка со стороны почтового сервиса</li>
                </ul>
            </div>
        </div>
    );
}
