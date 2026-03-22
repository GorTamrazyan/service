"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, User, Moon, Sun, KeyRound, X, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { T } from "@/app/client/components/T";
import NotificationsDropdown from "../components/modals/NotificationsDropdown";
import {
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../lib/firebase/firebase";

export default function AdminHeader() {
    const [searchQuery, setSearchQuery] = useState("");
    const { isDark, toggleTheme } = useTheme();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const openModal = () => {
        setDropdownOpen(false);
        setError("");
        setSuccess("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowModal(true);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        setSaving(true);
        try {
            const user = auth.currentUser;
            if (!user || !user.email) throw new Error("Not authenticated");

            // Re-authenticate first (required by Firebase before sensitive operations)
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            await updatePassword(user, newPassword);
            setSuccess("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setError("Current password is incorrect");
            } else if (err.code === "auth/weak-password") {
                setError("New password is too weak");
            } else {
                setError(err.message || "Failed to change password");
            }
        } finally {
            setSaving(false);
        }
    };

    // Read admin info from localStorage for display
    const adminUser = (() => {
        try {
            const raw = localStorage.getItem("adminUser");
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    })();

    return (
        <header className="bg-[var(--color-background)] border-b border-[var(--color-text)]/10 px-8 py-4">
            <div className="flex items-center justify-between">

                <div className="flex items-center gap-6 flex-1 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text)]/50" />
                        <input
                            type="text"
                            placeholder="Search products, orders, users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-secondary)]/30 text-[var(--color-text)] placeholder-[var(--color-text)]/50 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-[var(--color-secondary)]/50 transition-colors"
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-[var(--color-text)]" />
                        ) : (
                            <Moon className="w-5 h-5 text-[var(--color-text)]" />
                        )}
                    </button>

                    <NotificationsDropdown />

                    {/* Profile button with dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-secondary)]/50 transition-colors"
                        >
                            <div className="bg-[var(--color-accent)] rounded-full p-2">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-medium text-[var(--color-primary)]">
                                    {adminUser?.username || "Admin"}
                                </p>
                                <p className="text-xs text-[var(--color-text)]/60">
                                    {adminUser?.role === "super_admin" ? "Super Admin" : adminUser?.role === "admin" ? "Admin" : "Moderator"}
                                </p>
                            </div>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-background)] border border-[var(--color-text)]/10 rounded-xl shadow-lg z-50 overflow-hidden">
                                <button
                                    onClick={openModal}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-secondary)] transition-colors"
                                >
                                    <KeyRound className="w-4 h-4 text-[var(--color-accent)]" />
                                    Change Password
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-[var(--color-text)]/60">
                        <T>Today:</T>{" "}
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* Change Password Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-background)] rounded-2xl shadow-2xl w-full max-w-sm">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--color-text)]/10">
                            <h2 className="text-lg font-bold text-[var(--color-primary)]">Change Password</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-[var(--color-text)]/50 hover:text-[var(--color-text)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        required
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                    />
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/50">
                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/50">
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-[var(--color-text)]/20 rounded-xl bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-[var(--color-text)]/20 text-[var(--color-text)] rounded-xl hover:bg-[var(--color-secondary)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
}
