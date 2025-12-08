// client/register/page.tsx
"use client";
import { useState } from "react";
import React from "react";
import { auth } from "../../lib/firebase/firebase";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import {
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    query,
    where,
    collection,
    getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmailDiagnostics from "../components/EmailDiagnostics";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [verificationSent, setVerificationSent] = useState(false);

    const router = useRouter();

    // Функция для проверки существования email в базе данных
    const checkEmailExists = async (email: string) => {
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Ошибка при проверке email:", error);
            return false;
        }
    };

    // Функция для создания профиля пользователя в Firestore (если не существует)
    const createUserProfile = async (userId: string, email: string) => {
        try {
            const userDocRef = doc(db, "users", userId);
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                const newProfile = {
                    firstName: "",
                    lastName: "",
                    phone: "",
                    address: {
                        street: "",
                        houseNumber: "",
                        apartmentNumber: "",
                        city: "",
                        zipCode: "",
                    },
                    email: email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                await setDoc(userDocRef, newProfile);
                console.log(
                    "✅ Профиль пользователя создан в Firestore:",
                    newProfile
                );
            } else {
                console.log("ℹ️ Профиль пользователя уже существует");
            }
        } catch (error) {
            console.error("❌ Ошибка при создании профиля:", error);
        }
    };

    const handleEmailPasswordSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Пароли не совпадают.");
            return;
        }

        setError("");

        try {
            // Проверяем, существует ли уже email в базе данных
            const emailExists = await checkEmailExists(email);
            if (emailExists) {
                setError("Пользователь с таким email уже существует.");
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            console.log("Успешная регистрация через Email/Пароль:", user);

            // Создаем профиль пользователя в Firestore
            await createUserProfile(user.uid, email);

            // Отправляем email для верификации
            try {
                await sendEmailVerification(user, {
                    url: `${window.location.origin}/client/dashboard/home`,
                    handleCodeInApp: false, // Изменено на false
                });

                setVerificationSent(true);
                console.log(
                    "✅ Email для верификации успешно отправлен на:",
                    email
                );
                console.log("📧 Проверьте папку 'Входящие' и 'Спам'");
            } catch (emailError: any) {
                console.error("❌ Ошибка отправки email:", emailError);
                setError(
                    `Регистрация успешна, но не удалось отправить email для подтверждения: ${emailError.message}`
                );
                // Не устанавливаем verificationSent как true при ошибке
            }

            // Не перенаправляем сразу на dashboard, пока email не подтвержден
        } catch (firebaseError: any) {
            if (firebaseError.code === "auth/email-already-in-use") {
                setError("Пользователь с таким email уже существует.");
            } else {
                setError(firebaseError.message);
            }
            console.error(
                "Ошибка регистрации через Email/Пароль:",
                firebaseError
            );
        }

        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Успешная регистрация через Google:", user);

            // Создаем профиль пользователя в Firestore, если его еще нет
            if (user.email) {
                await createUserProfile(user.uid, user.email);
            }

            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            setError(firebaseError.message);
            console.error("Ошибка регистрации через Google:", firebaseError);
        }
    };

    const handleAppleSignIn = async () => {
        const provider = new OAuthProvider("apple.com");
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Успешная регистрация через Apple/iCloud:", user);

            // Создаем профиль пользователя в Firestore, если его еще нет
            if (user.email) {
                await createUserProfile(user.uid, user.email);
            }

            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            setError(firebaseError.message);
            console.error(
                "Ошибка регистрации через Apple/iCloud:",
                firebaseError
            );
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
            {/* Header with logo */}
            <div className="bg-[var(--color-secondary)] w-full py-6">
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                        {/* Fence icon */}
                        <div className="text-[var(--color-accent)]">
                            <svg
                                width="60"
                                height="40"
                                viewBox="0 0 60 40"
                                fill="currentColor"
                            >
                                <rect x="8" y="8" width="6" height="24" />
                                <rect x="18" y="8" width="6" height="24" />
                                <rect x="28" y="8" width="6" height="24" />
                                <rect x="38" y="8" width="6" height="24" />
                                <rect x="4" y="12" width="44" height="4" />
                                <rect x="4" y="20" width="44" height="4" />
                                <polygon points="8,8 11,4 14,8" />
                                <polygon points="18,8 21,4 24,8" />
                                <polygon points="28,8 31,4 34,8" />
                                <polygon points="38,8 41,4 44,8" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-[var(--color-text)]">
                            ONIK'S VINYL
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* REGISTER title */}
                    <div className="text-center mb-8">
                        <h2 className="text-5xl font-bold text-[var(--color-primary)] mb-8">
                            REGISTER
                        </h2>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleEmailPasswordSubmit}
                        className="space-y-6"
                    >
                        {/* Email field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-lg font-medium text-[var(--color-text)] mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 border-2 border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] text-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-lg font-medium text-[var(--color-text)] mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="w-full px-4 py-3 border-2 border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] text-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-lg font-medium text-[var(--color-text)] mb-2"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="w-full px-4 py-3 border-2 border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] text-lg"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Verification sent message */}
                        {verificationSent && (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                                    <p className="mb-3">
                                        Регистрация успешна! Проверьте вашу
                                        почту и перейдите по ссылке для
                                        подтверждения email.
                                    </p>
                                    <div className="flex gap-2">
                                        <Link
                                            href="/client/sign-in"
                                            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
                                        >
                                            Перейти к входу
                                        </Link>
                                    </div>
                                </div>

                                {/* Email Diagnostics */}
                                <details className="mt-4">
                                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                        🔧 Не получили email? Нажмите для
                                        диагностики
                                    </summary>
                                    <div className="mt-3">
                                        <EmailDiagnostics />
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Register button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-primary)] font-bold py-4 px-6 rounded-lg text-xl transition duration-150 ease-in-out"
                            >
                                REGISTER
                            </button>
                        </div>

                        {/* Social login buttons */}
                        <div className="space-y-3 pt-4 h-20 flex">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center py-3 px-4 m-1 border-2 border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-secondary)]/20 transition duration-150 ease-in-out"
                            >
                                <FcGoogle className="h-6 w-6 mr-3" />
                                <span className="text-[var(--color-text)] font-medium">
                                    Continue with Google
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleAppleSignIn}
                                className="w-full flex items-center justify-center py-3 px-4 m-1 border-2 border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] hover:bg-[var(--color-secondary)]/20 transition duration-150 ease-in-out"
                            >
                                <FaApple className="h-6 w-6 mr-3 text-[var(--color-text)]" />
                                <span className="text-[var(--color-text)] font-medium">
                                    Continue with Apple
                                </span>
                            </button>
                        </div>

                        {/* Sign in link */}
                        <div className="text-center pt-6">
                            <Link
                                href="/client/sign-in"
                                className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition duration-150 ease-in-out font-medium"
                            >
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
