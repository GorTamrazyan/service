// hooks/useProfile.ts
// ОПЦИОНАЛЬНО - Custom hook для переиспользования логики профиля

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { UserProfile } from "../types/profile";

export const useProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка профиля из Firebase
    const fetchUserProfile = async (uid: string) => {
        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                setProfile(data);
            } else {
                // Создаем пустой профиль для нового пользователя
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

                setProfile(newProfile);

                // Сохраняем базовый профиль в БД
                if (user) {
                    await setDoc(userDocRef, newProfile, { merge: true });
                }
            }
        } catch (err: any) {
            setError("Ошибка при загрузке профиля: " + err.message);
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Сохранение профиля
    const saveProfile = async (updatedProfile: UserProfile) => {
        if (!user || !updatedProfile) {
            throw new Error("Нет данных пользователя или профиля");
        }

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, updatedProfile, { merge: true });
            setProfile(updatedProfile);
            return true;
        } catch (err: any) {
            setError("Ошибка при сохранении профиля: " + err.message);
            console.error("Profile save error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Обновление профиля локально
    const updateProfile = (updates: Partial<UserProfile>) => {
        if (profile) {
            setProfile({ ...profile, ...updates });
        }
    };

    // Обновление адреса
    const updateAddress = (addressUpdates: Partial<UserProfile["address"]>) => {
        if (profile) {
            setProfile({
                ...profile,
                address: { ...profile.address, ...addressUpdates },
            });
        }
    };

    // Слушатель изменений аутентификации
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                await fetchUserProfile(currentUser.uid);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return {
        user,
        profile,
        loading,
        error,
        fetchUserProfile,
        saveProfile,
        updateProfile,
        updateAddress,
        setProfile,
        setError,
    };
};

// Пример использования в компоненте:
// const { profile, loading, saveProfile, updateProfile } = useProfile();
