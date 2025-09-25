// admin/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { T } from "../../components/T";
import { loginAdmin } from "../../lib/firebase/admin";

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Removed automatic admin initialization

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const { admin, sessionToken } = await loginAdmin(credentials.email, credentials.password);
            
            // Store admin session in localStorage
            localStorage.setItem("adminSessionToken", sessionToken);
            localStorage.setItem("adminUser", JSON.stringify({
                id: admin.id,
                email: admin.email,
                username: admin.username,
                role: admin.role,
                permissions: admin.permissions,
                loginTime: new Date().toISOString()
            }));
            
            console.log("✅ Admin logged in successfully:", admin);
            router.push("/admin");
        } catch (error: any) {
            console.error("❌ Login error:", error);
            setError(error.message || "Ошибка входа");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] rounded-2xl p-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                        <T>Admin Panel</T>
                    </h1>
                    <p className="text-[var(--color-text)]/70">
                        <T>ONIK'S VINYL Administration</T>
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-[var(--color-background)] rounded-2xl shadow-2xl border border-[var(--color-text)]/10 p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <T>Email</T>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text)]/50" />
                                <input
                                    type="email"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                                    className="w-full pl-10 pr-4 py-3 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                                    placeholder="Введите email администратора"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <T>Password</T>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text)]/50" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={credentials.password}
                                    onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                                    className="w-full pl-10 pr-12 py-3 border border-[var(--color-text)]/30 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                                    placeholder="Введите пароль"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/60 hover:text-[var(--color-text)] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] text-white font-medium py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <T>Signing in...</T>
                                </div>
                            ) : (
                                <T>Sign In</T>
                            )}
                        </button>
                    </form>

                    
                    
                </div>

                {/* Back to Site */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => router.push("/client/dashboard/home")}
                        className="text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors"
                    >
                        <T>← Back to main site</T>
                    </button>
                </div>
            </div>
        </div>
    );
}