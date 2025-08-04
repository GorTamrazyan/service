// client/signIn/page.tsx
"use client";
import { useState } from "react";
import React from "react";
import { auth } from "../../lib/firebase/firebase";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleEmailPasswordSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            console.log("Успешный вход через Email/Пароль:", user);
            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            setError(firebaseError.message);
            console.error("Ошибка входа через Email/Пароль:", firebaseError);
        }

        setEmail("");
        setPassword("");
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Успешный вход через Google:", user);
            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            setError(firebaseError.message);
            console.error("Ошибка входа через Google:", firebaseError);
        }
    };

    const handleAppleSignIn = async () => {
        const provider = new OAuthProvider("apple.com");
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Успешный вход через Apple/iCloud:", user);
            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            setError(firebaseError.message);
            console.error("Ошибка входа через Apple/iCloud:", firebaseError);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Фоновое изображение как отдельный элемент */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />

            {/* Оверлей для затемнения фона */}
            <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

            {/* Основной контент */}
            <div className="relative z-20 max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Вход в аккаунт
                        </h2>
                    </div>

                    <form
                        className="mt-8 space-y-6"
                        onSubmit={handleEmailPasswordSignIn}
                    >
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email адрес
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Email адрес"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Пароль
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            >
                                Войти
                            </button>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Или продолжить с
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 ease-in-out"
                                >
                                    <FcGoogle className="h-5 w-5 mr-2" />
                                    <span>Google</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAppleSignIn}
                                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 ease-in-out"
                                >
                                    <FaApple className="h-5 w-5 mr-2" />
                                    <span>Apple</span>
                                </button>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Нет аккаунта?{" "}
                                <Link
                                    href="/client/register"
                                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                                >
                                    Зарегистрироваться
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
