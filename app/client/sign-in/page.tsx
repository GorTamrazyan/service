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
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header with logo */}
            <div className="bg-red-600 w-full py-6">
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                        {/* Fence icon */}
                        <div className="text-yellow-400">
                            <svg width="60" height="40" viewBox="0 0 60 40" fill="currentColor">
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
                        <h1 className="text-4xl font-bold text-gray-800">ONIK'S VINYL</h1>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* LOGIN title */}
                    <div className="text-center mb-8">
                        <h2 className="text-5xl font-bold text-gray-800 mb-8">LOGIN</h2>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleEmailPasswordSignIn} className="space-y-6">
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Forgot password link */}
                        <div className="text-left">
                            <Link 
                                href="/forgot-password" 
                                className="text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Login button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-4 px-6 rounded-lg text-xl transition duration-150 ease-in-out"
                            >
                                LOGIN
                            </button>
                        </div>

                        {/* Social login buttons */}
                        <div className="space-y-3 pt-4 h-20 flex" >
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center py-3 px-4 m-0 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
                            >
                                <FcGoogle className="h-6 w-6 mr-3" />
                                <span className="text-gray-700 font-medium">Continue with Google</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleAppleSignIn}
                                className="w-full flex items-center justify-center py-3 px-4 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
                            >
                                <FaApple className="h-6 w-6 mr-3 text-gray-800" />
                                <span className="text-gray-700 font-medium">Continue with Apple</span>
                            </button>
                        </div>

                        {/* Create account link */}
                        <div className="text-center pt-6">
                            <Link
                                href="/client/register"
                                className="text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out font-medium"
                            >
                                Create an account
                            </Link>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}