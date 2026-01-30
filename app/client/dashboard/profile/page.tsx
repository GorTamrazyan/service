// app/client/dashboard/profile/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { auth, db } from "../../../lib/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarNavigation from "../../components/profile/SidebarNavigation";
import ProfileContent from "../../components/profile/ProfileContent";
import { UserProfile } from "../../../types/profile";
import { useLanguage } from "../../../contexts/LanguageContext";
import { T } from "@/app/client/components/T";
import { FaSpinner, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";

function ProfilePageContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();

    // Состояния
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState(
        searchParams.get("section") || "personalInfo"
    );
    const [saveSuccess, setSaveSuccess] = useState(false);
    const router = useRouter();

    // Проверка URL параметров для установки активной секции
    useEffect(() => {
        const section = searchParams.get("section");
        if (section) {
            setActiveSection(section);
        }
    }, [searchParams]);

    // Проверка аутентификации и загрузка профиля
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (!currentUser) {
                router.push("/client/dashboard/login");
                return;
            }
            setUser(currentUser);
            await fetchUserProfile(currentUser.uid);
        });

        return () => unsubscribe();
    }, [router]);

    // Загрузка профиля пользователя из Firebase
    const fetchUserProfile = async (uid: string) => {
        setLoading(true);
        try {
            const userDocRef = doc(db, "users", uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                data.email = user?.email || data.email;
                console.log("✅ Loaded profile:", data);
                console.log("📧 User email from auth:", user?.email);
                setProfile(data);
            } else {
                const newProfile: UserProfile = {
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
                    email: user?.email || "",
                };
                console.log("🆕 Created new profile:", newProfile);
                console.log("📧 User email from auth:", user?.email);
                setProfile(newProfile);

                if (user) {
                    await setDoc(userDocRef, newProfile, { merge: true });
                }
            }
        } catch (err: any) {
            setError("Error loading profile: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Обработка изменений в форме
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (profile) {
            if (name.startsWith("address.")) {
                const addressField = name.split(
                    "."
                )[1] as keyof UserProfile["address"];
                setProfile({
                    ...profile,
                    address: { ...profile.address, [addressField]: value },
                });
            } else {
                setProfile({ ...profile, [name]: value });
            }
        }
    };

    // Сохранение профиля
    const handleSaveProfile = async () => {
        if (!user || !profile) return;

        setLoading(true);
        setError(null);
        try {
            const updatedProfile = {
                ...profile,
                email: user.email || profile.email,
            };
            console.log("💾 Saving profile:", updatedProfile);

            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, updatedProfile, { merge: true });
            setProfile(updatedProfile);
            setIsEditing(false);
            setSaveSuccess(true);

            // Скрыть уведомление об успехе через 3 секунды
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setError("Error saving profile: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Выход из системы
    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/client/dashboard/home");
        } catch (err: any) {
            setError("Error logging out: " + err.message);
            console.error(err);
        }
    };

    // Начать редактирование
    const handleEdit = () => setIsEditing(true);

    // Отменить редактирование
    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            fetchUserProfile(user.uid);
        }
    };

    // Смена активной секции
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        setIsEditing(false);
    };

    // Loading состояние
    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative mb-8 mx-auto w-24 h-24">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center">
                            <FaSpinner className="w-12 h-12 text-[var(--color-accent)] animate-spin" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-accent)] animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                        <T>Loading Your Profile</T>
                    </h2>
                    <p className="text-[var(--color-text)]/60">
                        <T>Please wait while we fetch your information</T>
                    </p>
                </div>
            </div>
        );
    }

    // Ошибка
    if (error) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                                !
                            </span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        <T>Oops! Something went wrong</T>
                    </h2>
                    <p className="text-[var(--color-text)]/70 mb-8">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white font-bold py-3 px-6 rounded-full hover:scale-105 transition-all duration-200"
                    >
                        <T>Try Again</T>
                    </button>
                </div>
            </div>
        );
    }

    // Профиль не найден
    if (!profile) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--color-background)]">
                <p className="text-xl text-[var(--color-text)]">
                    {t("common.profile.notFound")}
                </p>
            </div>
        );
    }

    // Основной интерфейс
    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
            {/* Header */}
            <header className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/90 to-[var(--color-accent)]/90 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                                <T>My Account</T>
                            </h1>
                            <p className="text-white/80">
                                <T>
                                    Manage your profile, orders, and preferences
                                </T>
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Notification */}
                {saveSuccess && (
                    <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 shadow-lg animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <FaCheckCircle className="w-6 h-6" />
                            <div>
                                <h4 className="font-bold">
                                    <T>Profile Updated!</T>
                                </h4>
                                <p className="text-sm text-white/90">
                                    <T>
                                        Your changes have been saved
                                        successfully.
                                    </T>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Navigation */}
                    <div className="lg:col-span-1">
                        <SidebarNavigation
                            profile={profile}
                            activeSection={activeSection}
                            onSectionChange={handleSectionChange}
                            onLogout={handleLogout}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <ProfileContent
                            profile={profile}
                            activeSection={activeSection}
                            isEditing={isEditing}
                            onInputChange={handleInputChange}
                            onEdit={handleEdit}
                            onSave={handleSaveProfile}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <div className="relative mb-8 mx-auto w-24 h-24">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center">
                                <FaSpinner className="w-12 h-12 text-[var(--color-accent)] animate-spin" />
                            </div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-accent)] animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                            <T>Loading Your Profile</T>
                        </h2>
                        <p className="text-[var(--color-text)]/60">
                            <T>Please wait while we fetch your information</T>
                        </p>
                    </div>
                </div>
            }
        >
            <ProfilePageContent />
        </Suspense>
    );
}
