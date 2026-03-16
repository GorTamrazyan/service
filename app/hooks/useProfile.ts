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

                if (user) {
                    await setDoc(userDocRef, newProfile, { merge: true });
                }
            }
        } catch (err: any) {
            setError("Error loading profile: " + err.message);
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async (updatedProfile: UserProfile) => {
        if (!user || !updatedProfile) {
            throw new Error("No user data or profile");
        }

        setLoading(true);
        setError(null);

        try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, updatedProfile, { merge: true });
            setProfile(updatedProfile);
            return true;
        } catch (err: any) {
            setError("Error saving profile: " + err.message);
            console.error("Profile save error:", err);
            return false;
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchUserProfile(currentUser.uid);
            } else {
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
    };
};
