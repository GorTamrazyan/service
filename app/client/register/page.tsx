// client/register/page.tsx
"use client";
import { useState } from "react";
import React from "react";
// Отрегулируйте путь в соответствии с расположением вашего firebase.config.ts относительно этого файла
import { auth } from "../../lib/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Импортируем useRouter

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter(); // Инициализируем useRouter

    const handleEmailPasswordSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Пароли не совпадают.");
            return;
        }

        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            console.log("Успешная регистрация через Email/Пароль:", user);
            // Перенаправление на панель управления или домашнюю страницу после успешной регистрации
            router.push("/client/dashboard/home"); // <--- ПЕРЕНАПРАВЛЕНИЕ ЗДЕСЬ
        } catch (firebaseError: any) {
            setError(firebaseError.message);
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
            // Перенаправление на панель управления или домашнюю страницу после успешной регистрации через Google
            router.push("/client/dashboard/home"); // <--- ПЕРЕНАПРАВЛЕНИЕ ЗДЕСЬ
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
            // Перенаправление на панель управления или домашнюю страницу после успешной регистрации через Apple
            router.push("/client/dashboard/home"); // <--- ПЕРЕНАПРАВЛЕНИЕ ЗДЕСЬ
        } catch (firebaseError: any) {
            setError(firebaseError.message);
            console.error(
                "Ошибка регистрации через Apple/iCloud:",
                firebaseError
            );
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundImage: "url('/')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="relative p-8 bg-white bg-opacity-90 rounded-2xl shadow-xl w-96 backdrop-filter backdrop-blur-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
                    Регистрация
                </h2>

                <form
                    onSubmit={handleEmailPasswordSubmit}
                    className="space-y-4"
                >
                    <div>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
                            id="password"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
                            id="confirmPassword"
                            type="password"
                            placeholder="Подтвердите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center -mt-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out font-medium"
                    >
                        Зарегистрироваться
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm text-gray-500 bg-white px-2">
                        или
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200 ease-in-out"
                        onClick={handleGoogleSignIn}
                    >
                        <FcGoogle className="w-5 h-5 mr-3" />
                        Зарегистрироваться через Google
                    </button>
                    <button
                        className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200 ease-in-out"
                        onClick={handleAppleSignIn}
                    >
                        <FaApple className="w-5 h-5 mr-3" />
                        Зарегистрироваться через iCloud
                    </button>
                </div>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Уже есть аккаунт?{" "}
                        <Link
                            href="/client/sign-in"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
