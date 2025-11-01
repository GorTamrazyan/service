import React, { useState } from "react";
import { Bell, Shield, Globe, Moon, Sun, Smartphone, Mail, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useLanguage } from "../../../contexts/LanguageContext";
import { T } from "../../T";
import { auth } from "../../../lib/firebase/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase";
import { useRouter } from "next/navigation";

export default function SettingsPanel() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: true,
    });

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    
    const { isDark, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const router = useRouter();

    // Handle dark mode toggle
    const handleDarkModeToggle = () => {
        toggleTheme();
    };

    // Handle language change
    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
    };

    // Handle password change
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError("Новые пароли не совпадают");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("Новый пароль должен содержать минимум 6 символов");
            return;
        }

        setIsChangingPassword(true);

        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                setPasswordError("Пользователь не найден");
                return;
            }

            // Reauthenticate user with current password
            const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, passwordData.newPassword);

            setPasswordSuccess("Пароль успешно изменен!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            });
            
            // Close modal after success
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess("");
            }, 2000);

        } catch (error: any) {
            console.error("Ошибка при изменении пароля:", error);
            if (error.code === 'auth/wrong-password') {
                setPasswordError("Неверный текущий пароль");
            } else if (error.code === 'auth/weak-password') {
                setPasswordError("Слишком слабый пароль");
            } else {
                setPasswordError("Произошла ошибка при изменении пароля");
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Handle account deletion
    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setDeleteError("");

        if (!deleteConfirmPassword) {
            setDeleteError("Введите ваш пароль для подтверждения");
            return;
        }

        setIsDeletingAccount(true);

        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                setDeleteError("Пользователь не найден");
                return;
            }

            // Reauthenticate user before deletion
            const credential = EmailAuthProvider.credential(user.email, deleteConfirmPassword);
            await reauthenticateWithCredential(user, credential);

            // Delete user profile from Firestore
            try {
                await deleteDoc(doc(db, "users", user.uid));
                console.log("Профиль пользователя удален из Firestore");
            } catch (firestoreError) {
                console.warn("Ошибка при удалении профиля из Firestore:", firestoreError);
            }

            // Delete Firebase Auth account
            await deleteUser(user);
            
            console.log("Аккаунт успешно удален");
            
            // Redirect to home page
            router.push("/");

        } catch (error: any) {
            console.error("Ошибка при удалении аккаунта:", error);
            if (error.code === 'auth/wrong-password') {
                setDeleteError("Неверный пароль");
            } else if (error.code === 'auth/requires-recent-login') {
                setDeleteError("Требуется повторная авторизация. Войдите в систему заново и попробуйте еще раз.");
            } else {
                setDeleteError("Произошла ошибка при удалении аккаунта");
            }
        } finally {
            setIsDeletingAccount(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-[var(--color-primary)]">
                    <T>Settings</T>
                </h1>
                <p className="text-[var(--color-text)]/70">
                    <T>Manage your account preferences</T>
                </p>
            </div>

            {/* Notifications Settings */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/80 px-8 py-6 border-b border-[var(--color-text)]/10">
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--color-accent)] rounded-xl p-2">
                            <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                                <T>Notifications</T>
                            </h3>
                            <p className="text-[var(--color-text)]/70 mt-1">
                                <T>Manage notification preferences</T>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-lg p-2">
                                <Mail className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-[var(--color-primary)]">
                                    <T>Email Notifications</T>
                                </p>
                                <p className="text-sm text-[var(--color-text)]/70">
                                    <T>Receive order updates via email</T>
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.email}
                                onChange={(e) =>
                                    setNotifications({
                                        ...notifications,
                                        email: e.target.checked,
                                    })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--color-text)]/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-accent)]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-text)]/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 rounded-lg p-2">
                                <Smartphone className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-[var(--color-primary)]">
                                    <T>Push Notifications</T>
                                </p>
                                <p className="text-sm text-[var(--color-text)]/70">
                                    <T>Get instant mobile notifications</T>
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.push}
                                onChange={(e) =>
                                    setNotifications({
                                        ...notifications,
                                        push: e.target.checked,
                                    })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--color-text)]/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-accent)]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-text)]/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 rounded-lg p-2">
                                <Smartphone className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-medium text-[var(--color-primary)]">
                                    <T>SMS Notifications</T>
                                </p>
                                <p className="text-sm text-[var(--color-text)]/70">
                                    <T>Receive important updates via SMS</T>
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.sms}
                                onChange={(e) =>
                                    setNotifications({
                                        ...notifications,
                                        sms: e.target.checked,
                                    })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--color-text)]/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-accent)]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-text)]/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/80 px-8 py-6 border-b border-[var(--color-text)]/10">
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--color-primary)] rounded-xl p-2">
                            {isDark ? (
                                <Moon className="w-5 h-5 text-white" />
                            ) : (
                                <Sun className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                                <T>Appearance</T>
                            </h3>
                            <p className="text-[var(--color-text)]/70 mt-1">
                                <T>Customize your visual experience</T>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`rounded-lg p-2 ${
                                    isDark ? "bg-slate-800" : "bg-amber-100"
                                }`}
                            >
                                {isDark ? (
                                    <Moon className="w-5 h-5 text-white" />
                                ) : (
                                    <Sun className="w-5 h-5 text-amber-600" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-[var(--color-primary)]">
                                    <T>Dark Mode</T>
                                </p>
                                <p className="text-sm text-[var(--color-text)]/70">
                                    <T>Switch between light and dark themes</T>
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDark}
                                onChange={handleDarkModeToggle}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--color-text)]/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-accent)]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-text)]/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-lg p-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-[var(--color-primary)]">
                                    <T>Language</T>
                                </p>
                                <p className="text-sm text-[var(--color-text)]/70">
                                    <T>Choose your preferred language</T>
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) =>
                                    handleLanguageChange(e.target.value)
                                }
                                className="appearance-none bg-gradient-to-r from-[var(--color-background)] to-[var(--color-secondary)]/20 border-2 border-[var(--color-accent)]/30 rounded-xl px-4 py-3 pr-10 focus:ring-4 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] text-[var(--color-text)] font-medium shadow-lg hover:shadow-xl hover:border-[var(--color-accent)]/50 transition-all duration-300 cursor-pointer min-w-[10px]"
                            >
                                <option
                                    value="en"
                                    className="bg-[var(--color-background)] text-[var(--color-text)] py-2"
                                >
                                    🇺🇸 English
                                </option>
                                <option
                                    value="es"
                                    className="bg-[var(--color-background)] text-[var(--color-text)] py-2"
                                >
                                    🇪🇸 Español
                                </option>
                                <option
                                    value="ru"
                                    className="bg-[var(--color-background)] text-[var(--color-text)] py-2"
                                >
                                    🇷🇺 Русский
                                </option>
                                <option
                                    value="hy"
                                    className="bg-[var(--color-background)] text-[var(--color-text)] py-2"
                                >
                                    🇦🇲 Հայերեն
                                </option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-[var(--color-accent)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-[var(--color-background)] rounded-2xl shadow-xl border border-[var(--color-text)]/10 overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/80 px-8 py-6 border-b border-[var(--color-text)]/10">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 rounded-xl p-2">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                                <T>Security</T>
                            </h3>
                            <p className="text-[var(--color-text)]/70 mt-1">
                                <T>Protect your account and data</T>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full text-left p-4 rounded-xl border border-[var(--color-text)]/20  hover:bg-green-100 transition-colors duration-200 group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-[var(--color-primary)] group-hover:text-[var(--color-accent)] ">
                                    <T>Change Password</T>
                                </p>
                                <p className="text-sm text-[var(--color-text)]/70">
                                    <T>Update your account password</T>
                                </p>
                            </div>
                            <div className="text-[var(--color-text)]/60 group-hover:text-[var(--color-accent)]">
                                →
                            </div>
                        </div>
                    </button>

                    <button className="w-full text-left p-4 rounded-xl border border-[var(--color-text)]/20 hover:bg-[var(--color-secondary)]/30 transition-colors duration-200 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-[var(--color-primary)] group-hover:text-[var(--color-accent)]">
                                    <T>Two-Factor Authentication</T>
                                </p>
                                <p className="text-sm text-[var(--color-text)]/70">
                                    <T>Add extra security to your account</T>
                                </p>
                            </div>
                            <div className="text-[var(--color-text)]/60 group-hover:text-[var(--color-accent)]">
                                →
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full text-left p-4 rounded-xl border border-red-200 hover:bg-red-50 transition-colors duration-200 group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-red-600">
                                    <T>Delete Account</T>
                                </p>
                                <p className="text-sm text-red-500">
                                    <T>
                                        Permanently delete your account and data
                                    </T>
                                </p>
                            </div>
                            <div className="text-red-400 group-hover:text-red-600">
                                →
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-background)] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]/80 px-6 py-4 border-b border-[var(--color-text)]/10 flex items-center justify-between ">
                            <h3 className="text-xl font-semibold text-[var(--color-primary)]">
                                <T>Change Password</T>
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordError("");
                                    setPasswordSuccess("");
                                    setPasswordData({
                                        currentPassword: "",
                                        newPassword: "",
                                        confirmNewPassword: "",
                                    });
                                }}
                                className="text-[var(--color-text)]/60 hover:text-[var(--color-text)] text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6">
                            <form
                                onSubmit={handlePasswordChange}
                                className="space-y-6"
                            >
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        <T>Current Password</T>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPasswords.current
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={passwordData.currentPassword}
                                            onChange={(e) =>
                                                setPasswordData((prev) => ({
                                                    ...prev,
                                                    currentPassword:
                                                        e.target.value,
                                                }))
                                            }
                                            className="w-full px-4 py-3 border border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                            placeholder="Введите текущий пароль"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    "current"
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/60 hover:text-[var(--color-text)]"
                                        >
                                            {showPasswords.current ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        <T>New Password</T>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPasswords.new
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={passwordData.newPassword}
                                            onChange={(e) =>
                                                setPasswordData((prev) => ({
                                                    ...prev,
                                                    newPassword: e.target.value,
                                                }))
                                            }
                                            className="w-full px-4 py-3 border border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                            placeholder="Введите новый пароль"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility("new")
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/60 hover:text-[var(--color-text)]"
                                        >
                                            {showPasswords.new ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        <T>Confirm New Password</T>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPasswords.confirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                passwordData.confirmNewPassword
                                            }
                                            onChange={(e) =>
                                                setPasswordData((prev) => ({
                                                    ...prev,
                                                    confirmNewPassword:
                                                        e.target.value,
                                                }))
                                            }
                                            className="w-full px-4 py-3 border border-[var(--color-text)]/30 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                            placeholder="Повторите новый пароль"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    "confirm"
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/60 hover:text-[var(--color-text)]"
                                        >
                                            {showPasswords.confirm ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {passwordError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                        {passwordError}
                                    </div>
                                )}

                                {/* Success Message */}
                                {passwordSuccess && (
                                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                                        {passwordSuccess}
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setPasswordError("");
                                            setPasswordSuccess("");
                                            setPasswordData({
                                                currentPassword: "",
                                                newPassword: "",
                                                confirmNewPassword: "",
                                            });
                                        }}
                                        className="flex-1 px-4 py-3 border border-[var(--color-text)]/30 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-secondary)]/30 transition-colors"
                                    >
                                        <T>Cancel</T>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isChangingPassword}
                                        className="flex-1 px-4 py-3 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {isChangingPassword ? (
                                            "Изменяется..."
                                        ) : (
                                            <T>Change Password</T>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-background)] rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 border-b border-red-200 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-white">
                                <T>Delete Account</T>
                            </h3>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteError("");
                                    setDeleteConfirmPassword("");
                                }}
                                className="text-white/80 hover:text-white text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-red-100 rounded-full p-3">
                                        <Shield className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--color-primary)]">
                                            <T>Are you sure?</T>
                                        </h4>
                                        <p className="text-sm text-[var(--color-text)]/70">
                                            <T>This action cannot be undone</T>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-700">
                                        <T>
                                            Deleting your account will
                                            permanently remove:
                                        </T>
                                    </p>
                                    <ul className="mt-2 text-sm text-red-600 list-disc list-inside space-y-1">
                                        <li>
                                            <T>Your profile information</T>
                                        </li>
                                        <li>
                                            <T>Order history</T>
                                        </li>
                                        <li>
                                            <T>Saved addresses</T>
                                        </li>
                                        <li>
                                            <T>All account data</T>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <form
                                onSubmit={handleDeleteAccount}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                        <T>Enter your password to confirm:</T>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showDeletePassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={deleteConfirmPassword}
                                            onChange={(e) =>
                                                setDeleteConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 border border-red-300 rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Введите ваш пароль"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowDeletePassword(
                                                    !showDeletePassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/60 hover:text-[var(--color-text)]"
                                        >
                                            {showDeletePassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {deleteError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                        {deleteError}
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setDeleteError("");
                                            setDeleteConfirmPassword("");
                                        }}
                                        className="flex-1 px-4 py-3 border border-[var(--color-text)]/30 rounded-lg text-[var(--color-text)] hover:bg-green-300 transition-colors"
                                    >
                                        <T>Cancel</T>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isDeletingAccount}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {isDeletingAccount ? (
                                            "Удаляется..."
                                        ) : (
                                            <T>Delete Account</T>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}