// app/client/dashboard/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaUserEdit, FaSave, FaSignOutAlt, FaTimes } from "react-icons/fa";

interface UserProfile {
    firstName: string;
    lastName: string;
    phone: string;
    address: {
        street: string;
        houseNumber: string;
        apartmentNumber: string;
        city: string;
        zipCode: string;
    };
    email: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState("account");
    const router = useRouter();

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

    const fetchUserProfile = async (uid: string) => {
        setLoading(true);
        try {
            const userDocRef = doc(db, "users", uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                setProfile(data);
            } else {
                setProfile({
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
                });
                if (user) {
                    await setDoc(
                        userDocRef,
                        { email: user.email, ...profile },
                        { merge: true }
                    );
                }
            }
        } catch (err: any) {
            setError("Ошибка при загрузке профиля: " + err.message);
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
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, profile, { merge: true });
            setIsEditing(false);
        } catch (err: any) {
            setError("Ошибка при сохранении профиля: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/client/dashboard/login");
        } catch (err: any) {
            setError("Ошибка при выходе: " + err.message);
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-[#0F172A]">Загрузка профиля...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-600">
                    Профиль не найден. Пожалуйста, войдите снова.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Навигационная панель */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-6 py-4 font-medium ${
                            activeSection === "orders"
                                ? "text-[#0F172A] border-b-2 border-[#D6AD60]"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveSection("orders")}
                    >
                        Orders
                    </button>
                    <button
                        className={`px-6 py-4 font-medium ${
                            activeSection === "addresses"
                                ? "text-[#0F172A] border-b-2 border-[#D6AD60]"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveSection("addresses")}
                    >
                        Addresses
                    </button>
                    <button
                        className={`px-6 py-4 font-medium ${
                            activeSection === "account"
                                ? "text-[#0F172A] border-b-2 border-[#D6AD60]"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveSection("account")}
                    >
                        Account
                    </button>
                    <button
                        className="px-6 py-4 font-medium text-gray-500 ml-auto flex items-center"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="mr-2" /> Sign out
                    </button>
                </div>

                {/* Информация пользователя */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-[#0F172A]">
                        {profile.firstName || "John"}{" "}
                        {profile.lastName || "Doe"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {profile.email || "johndoe@example.com"}
                    </p>
                </div>

                {/* Секции контента */}
                <div className="p-6">
                    {/* Секция Orders */}
                    {activeSection === "orders" && (
                        <div>
                            <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                                Orders
                            </h2>
                            <p className="text-gray-600 mb-6">
                                View your order history
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-center text-gray-500">
                                    No orders yet
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Секция Addresses */}
                    {activeSection === "addresses" && (
                        <div>
                            <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                                Addresses
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Manage your addresses
                            </p>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-[#0F172A]">
                                            Delivery Address
                                        </h3>
                                        <p className="mt-2 text-gray-600">
                                            {profile.address.street ||
                                                "123 Main St"}
                                            ,
                                            {profile.address.houseNumber ||
                                                "10"}
                                            {profile.address.apartmentNumber &&
                                                `, Apt ${profile.address.apartmentNumber}`}
                                        </p>
                                        <p className="text-gray-600">
                                            {profile.address.city || "New York"}
                                            ,
                                            {profile.address.zipCode || "10001"}
                                        </p>
                                    </div>
                                    <button
                                        className="text-[#D6AD60] hover:text-[#0F172A] transition-colors"
                                        onClick={() =>
                                            setActiveSection("account")
                                        }
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Секция Account */}
                    {activeSection === "account" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-[#0F172A]">
                                        Personal Info
                                    </h2>
                                    <p className="text-gray-600">
                                        Update your personal information
                                    </p>
                                </div>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-[#D6AD60] text-[#0F172A] py-2 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors duration-200 flex items-center"
                                    >
                                        <FaUserEdit className="mr-2" /> Edit
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors duration-200 flex items-center"
                                        >
                                            <FaSave className="mr-2" /> Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                if (user)
                                                    fetchUserProfile(user.uid);
                                            }}
                                            className="bg-gray-400 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-500 transition-colors duration-200 flex items-center"
                                        >
                                            <FaTimes className="mr-2" /> Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <p className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                                        {profile.email}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={profile.firstName}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6AD60] focus:border-[#D6AD60] ${
                                            !isEditing
                                                ? "bg-gray-50 text-gray-600"
                                                : "bg-white text-[#1F2937]"
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={profile.lastName}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6AD60] focus:border-[#D6AD60] ${
                                            !isEditing
                                                ? "bg-gray-50 text-gray-600"
                                                : "bg-white text-[#1F2937]"
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6AD60] focus:border-[#D6AD60] ${
                                            !isEditing
                                                ? "bg-gray-50 text-gray-600"
                                                : "bg-white text-[#1F2937]"
                                        }`}
                                    />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-[#0F172A] mt-8 mb-4">
                                Delivery Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="address.street"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Street
                                    </label>
                                    <input
                                        type="text"
                                        id="address.street"
                                        name="address.street"
                                        value={profile.address.street}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6AD60] focus:border-[#D6AD60] ${
                                            !isEditing
                                                ? "bg-gray-50 text-gray-600"
                                                : "bg-white text-[#1F2937]"
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="address.houseNumber"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        House Number
                                    </label>
                                    <input
                                        type="text"
                                        id="address.houseNumber"
                                        name="address.houseNumber"
                                        value={profile.address.houseNumber}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6AD60] focus:border-[#D6AD60] ${
                                            !isEditing
                                                ? "bg-gray-50 text-gray-600"
                                                : "bg-white text-[#1F2937]"
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="address.apartmentNumber"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Apartment Number
                                    </label>
                                    <input
                                        type="text"
                                        id="address.apartmentNumber"
                                        name="address.apartmentNumber"
                                        value={profile.address.apartmentNumber}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6AD60] focus:border-[#D6AD60] ${
                                            !isEditing
                                                ? "bg-gray-50 text-gray-600"
                                                : "bg-white text-[#1F2937]"
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="address.city"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="address.city"
                                        name="address.city"
                                        value={profile.address.city}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6AD60] focus:border-[#D6AD60] ${
                                            !isEditing
                                                ? "bg-gray-50 text-gray-600"
                                                : "bg-white text-[#1F2937]"
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="address.zipCode"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        id="address.zipCode"
                                        name="address.zipCode"
                                        value={profile.address.zipCode}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6AD60] focus:border-[#D6AD60] ${
                                            !isEditing
                                                ? "bg-gray-50 text-gray-600"
                                                : "bg-white text-[#1F2937]"
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
