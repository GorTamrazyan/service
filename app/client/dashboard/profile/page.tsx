// app/client/dashboard/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import SidebarNavigation from "../../components/profile/SidebarNavigation";
import ProfileContent from "../../components/profile/ProfileContent";
import { UserProfile } from "../../../types/profile";
import { useLanguage } from "../../../contexts/LanguageContext";
import { T } from "@/app/client/components/T";

export default function ProfilePage() {
    const { t } = useLanguage();

    // Состояния
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState("personalInfo");
    const router = useRouter();

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
                // Профиль существует - загружаем данные
                const data = docSnap.data() as UserProfile;
                // Убеждаемся, что email синхронизирован с Firebase Auth
                data.email = user?.email || data.email;
                console.log("✅ Loaded profile:", data);
                console.log("🔐 User email from auth:", user?.email);
                setProfile(data);
            } else {
                // Профиль не существует - создаем новый
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
                console.log("🔐 User email from auth:", user?.email);
                setProfile(newProfile);

                // Сохраняем базовый профиль в Firebase
                if (user) {
                    await setDoc(userDocRef, newProfile, { merge: true });
                }
            }
        } catch (err: any) {
            setError("Ошибка при загрузке профиля: " + err.message);
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
                // Обновляем поле адреса
                const addressField = name.split(
                    "."
                )[1] as keyof UserProfile["address"];
                setProfile({
                    ...profile,
                    address: { ...profile.address, [addressField]: value },
                });
            } else {
                // Обновляем обычное поле
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
            // Убеждаемся что email всегда актуальный перед сохранением
            const updatedProfile = {
                ...profile,
                email: user.email || profile.email,
            };
            console.log("💾 Saving profile:", updatedProfile);

            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, updatedProfile, { merge: true });
            setProfile(updatedProfile); // Обновляем локальное состояние
            setIsEditing(false);
        } catch (err: any) {
            setError("Ошибка при сохранении профиля: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Выход из системы
    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/");
        } catch (err: any) {
            setError("Ошибка при выходе: " + err.message);
            console.error(err);
        }
    };

    // Начать редактирование
    const handleEdit = () => setIsEditing(true);

    // Отменить редактирование
    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            fetchUserProfile(user.uid); // Перезагружаем данные
        }
    };

    // Смена активной секции
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        setIsEditing(false); // Выходим из режима редактирования при смене секции
    };

    // Loading состояние
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--color-background)]">
                <p className="text-xl text-[var(--color-text)]">
                    <T>Loading profile...</T>
                </p>
            </div>
        );
    }

    // Ошибка
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--color-background)]">
                <p className="text-xl text-red-600">{error}</p>
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
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col lg:flex-row sm:pt-20 pt-7 ">
            {/* Боковая навигация */}
            <div className="lg:w-80 lg:min-w-80 bg-[var(--color-secondary)]">
                <SidebarNavigation
                    profile={profile}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    onLogout={handleLogout}
                />
            </div>

            {/* Основной контент */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-[var(--color-background)]">
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
    );
}
