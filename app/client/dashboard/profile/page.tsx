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

    useEffect(() => {
        const section = searchParams.get("section");
        if (section) {
            setActiveSection(section);
        }
    }, [searchParams]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (!currentUser) {
                router.push("/client/dashboard/login");
                return;
            }
            setUser(currentUser);
            await fetchUserProfile(currentUser.uid, currentUser);
        });

        return () => unsubscribe();
    }, [router]);

    const fetchUserProfile = async (uid: string, currentUser?: typeof user) => {
        setLoading(true);
        try {
            const userDocRef = doc(db, "users", uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                data.email = currentUser?.email || data.email;
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
                    email: currentUser?.email || "",
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

            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setError("Error saving profile: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/client/dashboard/home");
        } catch (err: any) {
            setError("Error logging out: " + err.message);
            console.error(err);
        }
    };

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            fetchUserProfile(user.uid);
        }
    };

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="mb-8 mx-auto w-16 h-16 flex items-center justify-center">
                        <FaSpinner className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
                    </div>
                    <h2 className="font-serif text-2xl font-semibold text-[var(--color-primary)] mb-2">
                        <T>Loading Your Profile</T>
                    </h2>
                    <p className="text-[var(--color-text)]/60">
                        <T>Please wait while we fetch your information</T>
                    </p>
                </div>
            </div>
        );
    }

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
                        className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-semibold py-3 px-6 rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                    >
                        <T>Try Again</T>
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--color-background)]">
                <p className="text-xl text-[var(--color-text)]">
                    {t("common.profile.notFound")}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">

            <header className="bg-[var(--color-card-bg)] border-b border-[var(--color-border)] py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-primary)] mb-2">
                                <T>My Account</T>
                            </h1>
                            <p className="text-[var(--color-text)]/70">
                                <T>
                                    Manage your profile, orders, and preferences
                                </T>
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {saveSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <FaCheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                            <div>
                                <h4 className="font-semibold">
                                    <T>Profile Updated!</T>
                                </h4>
                                <p className="text-sm text-green-700">
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

                    <div className="lg:col-span-1">
                        <SidebarNavigation
                            profile={profile}
                            activeSection={activeSection}
                            onSectionChange={handleSectionChange}
                            onLogout={handleLogout}
                        />
                    </div>

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

        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <div className="mb-8 mx-auto w-16 h-16 flex items-center justify-center">
                            <FaSpinner className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
                        </div>
                        <h2 className="font-serif text-2xl font-semibold text-[var(--color-primary)] mb-2">
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
