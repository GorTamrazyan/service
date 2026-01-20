import React, { useState } from "react";
import {
    FaBell,
    FaShieldAlt,
    FaGlobe,
    FaMoon,
    FaSun,
    FaMobileAlt,
    FaEnvelope,
    FaEye,
    FaEyeSlash,
    FaCog,
} from "react-icons/fa";
import { useTheme } from "../../../../hooks/useTheme";
import { useLanguage } from "../../../../contexts/LanguageContext";
import { T } from "../../T";
import { auth } from "../../../../lib/firebase/firebase";
import {
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    deleteUser,
} from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase/firebase";
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
        confirmNewPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
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

    const handleDarkModeToggle = () => {
        toggleTheme();
    };

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError("Новые пароли не совпадают");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError(
                "Новый пароль должен содержать минимум 6 символов"
            );
            return;
        }

        setIsChangingPassword(true);

        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                setPasswordError("Пользователь не найден");
                return;
            }

            const credential = EmailAuthProvider.credential(
                user.email,
                passwordData.currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, passwordData.newPassword);

            setPasswordSuccess("Пароль успешно изменен!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });

            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess("");
            }, 2000);
        } catch (error: any) {
            console.error("Ошибка при изменении пароля:", error);
            if (error.code === "auth/wrong-password") {
                setPasswordError("Неверный текущий пароль");
            } else if (error.code === "auth/weak-password") {
                setPasswordError("Слишком слабый пароль");
            } else {
                setPasswordError("Произошла ошибка при изменении пароля");
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

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

            const credential = EmailAuthProvider.credential(
                user.email,
                deleteConfirmPassword
            );
            await reauthenticateWithCredential(user, credential);

            try {
                await deleteDoc(doc(db, "users", user.uid));
                console.log("Профиль пользователя удален из Firestore");
            } catch (firestoreError) {
                console.warn(
                    "Ошибка при удалении профиля из Firestore:",
                    firestoreError
                );
            }

            await deleteUser(user);
            console.log("Аккаунт успешно удален");
            router.push("/");
        } catch (error: any) {
            console.error("Ошибка при удалении аккаунта:", error);
            if (error.code === "auth/wrong-password") {
                setDeleteError("Неверный пароль");
            } else {
                setDeleteError("Произошла ошибка при удалении аккаунта");
            }
        } finally {
            setIsDeletingAccount(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Appearance Settings */}
            <div className="bg-[var(--color-secondary)] rounded-2xl shadow-xl p-6 border border-[var(--color-text)]/10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-3">
                        <FaCog className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[var(--color-text)]">
                            <T>Appearance</T>
                        </h3>
                        <p className="text-sm text-[var(--color-text)]/60">
                            <T>Customize how the app looks</T>
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--color-text)]/5 to-[var(--color-text)]/10 rounded-xl hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                            {isDark ? (
                                <FaMoon className="w-5 h-5 text-indigo-600" />
                            ) : (
                                <FaSun className="w-5 h-5 text-yellow-600" />
                            )}
                            <div>
                                <p className="font-semibold text-[var(--color-text)]">
                                    <T>Dark Mode</T>
                                </p>
                                <p className="text-xs text-[var(--color-text)]/60">
                                    <T>Switch between light and dark theme</T>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDarkModeToggle}
                            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                                isDark
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                                    : "bg-[var(--color-text)]/20"
                            }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-5 h-5 bg-[var(--color-secondary)] rounded-full shadow-md transform transition-transform duration-300 ${
                                    isDark ? "translate-x-7" : ""
                                }`}
                            />
                        </button>
                    </div>

                    {/* Language Selector */}
                    <div className="p-4 bg-gradient-to-r from-[var(--color-text)]/5 to-[var(--color-text)]/10 rounded-xl hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <FaGlobe className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="font-semibold text-[var(--color-text)]">
                                    <T>Language</T>
                                </p>
                                <p className="text-xs text-[var(--color-text)]/60">
                                    <T>Choose your preferred language</T>
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            {["en", "ru", "hy"].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(lang)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        language === lang
                                            ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] text-white shadow-lg transform scale-105"
                                            : "bg-[var(--color-secondary)] text-[var(--color-text)] hover:bg-[var(--color-text)]/5 border border-[var(--color-text)]/20"
                                    }`}
                                >
                                    {lang === "en"
                                        ? "English"
                                        : lang === "ru"
                                        ? "Русский"
                                        : "Հայերեն"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-[var(--color-secondary)] rounded-2xl shadow-xl p-6 border border-[var(--color-text)]/10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-3">
                        <FaBell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[var(--color-text)]">
                            <T>Notifications</T>
                        </h3>
                        <p className="text-sm text-[var(--color-text)]/60">
                            <T>Manage your notification preferences</T>
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            key: "email",
                            icon: FaEnvelope,
                            label: "Email Notifications",
                            desc: "Receive updates via email",
                        },
                        {
                            key: "push",
                            icon: FaMobileAlt,
                            label: "Push Notifications",
                            desc: "Get alerts on your device",
                        },
                        {
                            key: "sms",
                            icon: FaMobileAlt,
                            label: "SMS Notifications",
                            desc: "Receive text messages",
                        },
                    ].map((item) => (
                        <div
                            key={item.key}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--color-text)]/5 to-[var(--color-text)]/10 rounded-xl hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-[var(--color-text)]">
                                        <T>{item.label}</T>
                                    </p>
                                    <p className="text-xs text-[var(--color-text)]/60">
                                        <T>{item.desc}</T>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    setNotifications((prev) => ({
                                        ...prev,
                                        [item.key]:
                                            !prev[
                                                item.key as keyof typeof prev
                                            ],
                                    }))
                                }
                                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                                    notifications[
                                        item.key as keyof typeof notifications
                                    ]
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                        : "bg-[var(--color-text)]/20"
                                }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-5 h-5 bg-[var(--color-secondary)] rounded-full shadow-md transform transition-transform duration-300 ${
                                        notifications[
                                            item.key as keyof typeof notifications
                                        ]
                                            ? "translate-x-7"
                                            : ""
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="bg-[var(--color-secondary)] rounded-2xl shadow-xl p-6 border border-[var(--color-text)]/10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-3">
                        <FaShieldAlt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[var(--color-text)]">
                            <T>Security</T>
                        </h3>
                        <p className="text-sm text-[var(--color-text)]/60">
                            <T>Manage your account security</T>
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full p-4 bg-[var(--color-text)]/5 rounded-xl hover:shadow-lg hover:bg-[var(--color-text)]/10 transition-all text-left border border-[var(--color-border)]"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 rounded-lg p-2">
                                    <FaShieldAlt className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[var(--color-text)]">
                                        <T>Change Password</T>
                                    </p>
                                    <p className="text-xs text-[var(--color-text)]/60">
                                        <T>Update your account password</T>
                                    </p>
                                </div>
                            </div>
                            <span className="text-blue-600">→</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full p-4 bg-red-500/10 rounded-xl hover:shadow-lg hover:bg-red-500/20 transition-all text-left border border-red-500/30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-600 rounded-lg p-2">
                                    <FaShieldAlt className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-red-600">
                                        <T>Delete Account</T>
                                    </p>
                                    <p className="text-xs text-[var(--color-text)]/60">
                                        <T>Permanently delete your account</T>
                                    </p>
                                </div>
                            </div>
                            <span className="text-red-600">→</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-[var(--color-secondary)] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">
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
                                    className="text-white/80 hover:text-white text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <form
                                onSubmit={handlePasswordChange}
                                className="space-y-4"
                            >
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
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
                                            className="w-full px-4 py-3 border border-[var(--color-text)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    "current"
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/40 hover:text-[var(--color-text)]/70"
                                        >
                                            {showPasswords.current ? (
                                                <FaEyeSlash className="w-5 h-5" />
                                            ) : (
                                                <FaEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
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
                                            className="w-full px-4 py-3 border border-[var(--color-text)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility("new")
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/40 hover:text-[var(--color-text)]/70"
                                        >
                                            {showPasswords.new ? (
                                                <FaEyeSlash className="w-5 h-5" />
                                            ) : (
                                                <FaEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
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
                                            className="w-full px-4 py-3 border border-[var(--color-text)]/30 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    "confirm"
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/40 hover:text-[var(--color-text)]/70"
                                        >
                                            {showPasswords.confirm ? (
                                                <FaEyeSlash className="w-5 h-5" />
                                            ) : (
                                                <FaEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Error/Success Messages */}
                                {passwordError && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-4 py-3 rounded-xl text-sm">
                                        {passwordError}
                                    </div>
                                )}
                                {passwordSuccess && (
                                    <div className="bg-green-500/10 border border-green-500/30 text-green-600 px-4 py-3 rounded-xl text-sm">
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
                                        className="flex-1 px-4 py-3 border-2 border-[var(--color-text)]/30 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-text)]/5 transition-colors font-medium"
                                    >
                                        <T>Cancel</T>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isChangingPassword}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg"
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-[var(--color-secondary)] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">
                                    <T>Delete Account</T>
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteError("");
                                        setDeleteConfirmPassword("");
                                    }}
                                    className="text-white/80 hover:text-white text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-red-100 rounded-full p-3">
                                        <FaShieldAlt className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--color-text)]">
                                            <T>Are you sure?</T>
                                        </h4>
                                        <p className="text-sm text-[var(--color-text)]/60">
                                            <T>This action cannot be undone</T>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                    <p className="text-sm text-red-600 font-semibold mb-2">
                                        <T>
                                            Deleting your account will
                                            permanently remove:
                                        </T>
                                    </p>
                                    <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
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
                                    <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
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
                                            className="w-full px-4 py-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/40 hover:text-[var(--color-text)]/70"
                                        >
                                            {showDeletePassword ? (
                                                <FaEyeSlash className="w-5 h-5" />
                                            ) : (
                                                <FaEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {deleteError && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-4 py-3 rounded-xl text-sm">
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
                                        className="flex-1 px-4 py-3 border-2 border-[var(--color-text)]/30 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-text)]/5 transition-colors font-medium"
                                    >
                                        <T>Cancel</T>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isDeletingAccount}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg"
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
