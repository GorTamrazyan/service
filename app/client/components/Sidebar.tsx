"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "../../lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { T } from "./T";
import { User } from "firebase/auth";

import {
    FaUserCircle,
    FaShoppingBag,
    FaMapMarkerAlt,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/client/dashboard/login");
        } catch (err: any) {
            console.error("Logout error:", err.message);
            
        }
    };

    const navItems = [
        {
            name: "Orders",
            href: "/client/dashboard/orders",
            icon: FaShoppingBag,
            label: "Orders",
        },
        {
            name: "Addresses",
            href: "/client/dashboard/addresses",
            icon: FaMapMarkerAlt,
            label: "Addresses",
        },
        {
            name: "Account",
            href: "/client/dashboard/profile",
            icon: FaCog,
            label: "Account",
        },
    ];

    return (
        <nav className="text-white flex flex-col h-full">

            <div className="flex items-center mb-10 pt-4">
                <FaUserCircle className="text-[var(--color-accent)] text-6xl mr-4" />
                <div>
                    <h2 className="text-xl font-bold">
                        {user?.displayName || <T>User</T>}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {user?.email || <T>Guest</T>}
                    </p>
                </div>
            </div>

            <ul className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                                    isActive
                                        ? "bg-[var(--color-accent)] text-white shadow-lg"
                                        : "hover:bg-white/10 text-gray-300 hover:text-white"
                                }`}
                            >
                                <Icon className="text-xl" />
                                <span className="font-medium">
                                    <T>{item.label}</T>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-auto pt-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg w-full text-left hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300"
                >
                    <FaSignOutAlt className="text-xl" />
                    <span className="font-medium">
                        <T>Sign Out</T>
                    </span>
                </button>
            </div>
        </nav>
    );
}
