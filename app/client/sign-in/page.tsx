"use client";
import { useState } from "react";
import React from "react";
import { auth } from "../../lib/firebase/firebase";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider,
    sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MdEmail, MdLock, MdInfo, MdWarning } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailNotVerified, setEmailNotVerified] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const createUserProfileIfNotExists = async (
        userId: string,
        email: string,
    ) => {
        try {
            const userDocRef = doc(db, "users", userId);
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                const newProfile = {
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
                    email: email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                await setDoc(userDocRef, newProfile);
                console.log(
                    "✅ User profile created in Firestore:",
                    newProfile,
                );
                return true; 
            } else {
                console.log("ℹ️ User profile already exists");
                return false; 
            }
        } catch (error) {
            console.error("❌ Error creating profile:", error);
            return false;
        }
    };

    const handleEmailPasswordSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setEmailNotVerified(false);
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = userCredential.user;

            if (!user.emailVerified) {
                setEmailNotVerified(true);
                setError("Please verify your email before signing in.");
                setIsLoading(false);
                return;
            }

            console.log("Successful sign in via Email/Password:", user);
            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            if (
                firebaseError.code === "auth/invalid-credential" ||
                firebaseError.code === "auth/user-not-found" ||
                firebaseError.code === "auth/wrong-password"
            ) {
                setError("Invalid email or password. Please try again.");
            } else if (firebaseError.code === "auth/too-many-requests") {
                setError("Too many attempts. Please wait 10-15 minutes before trying again. Check your email (including Spam) for the verification link.");
            } else {
                setError("Failed to sign in. Please try again.");
            }
            console.error("Sign in error via Email/Password:", firebaseError);
        } finally {
            setIsLoading(false);
        }

        setPassword("");
    };

    const resendVerificationEmail = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await sendEmailVerification(user, {
                    url: `${window.location.origin}/client/dashboard/home`,
                    handleCodeInApp: false,
                });
                setVerificationSent(true);
                console.log("✅ Verification email resent to:", user.email);
                console.log("📧 Check your inbox and spam folder");
            }
        } catch (error: any) {
            console.error("❌ Error resending verification email:", error);
            if (error.code === "auth/too-many-requests") {
                setError("Too many requests. Please wait 10-15 minutes and check your inbox (including Spam folder) for the verification email.");
            } else {
                setError(`Failed to send verification email: ${error.message}`);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Successful sign in via Google:", user);

            if (user.email) {
                const userDocRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDocRef);
                const isNewUser = !docSnap.exists();

                await createUserProfileIfNotExists(user.uid, user.email);

                if (isNewUser) {
                    try {
                        const { sendWelcomeEmailHelper } =
                            await import("../../lib/email/helpers");
                        await sendWelcomeEmailHelper(
                            user.email,
                            user.displayName || user.email.split("@")[0],
                        );
                        console.log("✅ Welcome email sent to new Google user");
                    } catch (welcomeEmailError) {
                        console.error(
                            "⚠️ Error sending welcome email:",
                            welcomeEmailError,
                        );
                    }
                }
            }

            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            if (firebaseError.code !== "auth/popup-closed-by-user") {
                setError("Failed to sign in with Google. Please try again.");
            }
            console.error("Google sign in error:", firebaseError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAppleSignIn = async () => {
        const provider = new OAuthProvider("apple.com");
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Successful sign in via Apple/iCloud:", user);

            if (user.email) {
                const userDocRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDocRef);
                const isNewUser = !docSnap.exists();

                await createUserProfileIfNotExists(user.uid, user.email);

                if (isNewUser) {
                    try {
                        const { sendWelcomeEmailHelper } =
                            await import("../../lib/email/helpers");
                        await sendWelcomeEmailHelper(
                            user.email,
                            user.displayName || user.email.split("@")[0],
                        );
                        console.log("✅ Welcome email sent to new Apple user");
                    } catch (welcomeEmailError) {
                        console.error(
                            "⚠️ Error sending welcome email:",
                            welcomeEmailError,
                        );
                    }
                }
            }

            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            if (firebaseError.code !== "auth/popup-closed-by-user") {
                setError("Failed to sign in with Apple. Please try again.");
            }
            console.error("Apple/iCloud sign in error:", firebaseError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col relative overflow-hidden">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full py-6 bg-[var(--color-secondary)] shadow-sm border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center group"
                    >
                        <div className="flex items-center space-x-4 transition-transform duration-300 group-hover:scale-105">

                            <div className="text-[var(--color-accent)] transform transition-all duration-300 group-hover:rotate-6">
                                <svg
                                    width="60"
                                    height="40"
                                    viewBox="0 0 60 40"
                                    className="drop-shadow-lg"
                                    fill="currentColor"
                                >
                                    <rect x="8" y="8" width="6" height="24" />
                                    <rect x="18" y="8" width="6" height="24" />
                                    <rect x="28" y="8" width="6" height="24" />
                                    <rect x="38" y="8" width="6" height="24" />
                                    <rect x="4" y="12" width="44" height="4" />
                                    <rect x="4" y="20" width="44" height="4" />
                                    <polygon points="8,8 11,4 14,8" />
                                    <polygon points="18,8 21,4 24,8" />
                                    <polygon points="28,8 31,4 34,8" />
                                    <polygon points="38,8 41,4 44,8" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-[var(--color-primary)]">
                                ONIK'S VINYL
                            </h1>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="relative flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    <div className="bg-[var(--color-card-bg)] rounded-2xl shadow-2xl border border-[var(--color-border)] p-8 md:p-10 transition-all duration-300 hover:shadow-3xl">

                        <div className="text-center mb-8">
                            <button
                                onClick={() => window.location.href = "/"}
                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl mb-4 shadow-lg hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                            </button>
                            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-[var(--color-text)]/60 text-sm">
                                Sign in to access your account
                            </p>
                        </div>

                        <form
                            onSubmit={handleEmailPasswordSignIn}
                            className="space-y-5"
                        >

                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-[var(--color-text)]"
                                >
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdEmail className="h-5 w-5 text-[var(--color-text)]/40 group-focus-within:text-[var(--color-primary)]" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-input-bg)] border-2 border-[var(--color-input-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-[var(--color-text)]"
                                >
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdLock className="h-5 w-5 text-[var(--color-text)]/40 group-focus-within:text-[var(--color-primary)]" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-input-bg)] border-2 border-[var(--color-input-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="text-right">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {error && (
                                <div className="bg-[var(--color-error)]/10 border-2 border-[var(--color-error)]/30 text-[var(--color-error)] px-4 py-3 rounded-xl text-sm animate-shake">
                                    <div className="flex items-start space-x-2">
                                        <MdInfo className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <span>{error}</span>
                                            {emailNotVerified && (
                                                <div className="mt-3">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            resendVerificationEmail
                                                        }
                                                        className="text-[var(--color-info)] hover:text-[var(--color-info)]/80 underline font-medium transition-colors"
                                                    >
                                                        Resend verification
                                                        email
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {verificationSent && (
                                <div className="bg-[var(--color-success)]/10 border-2 border-[var(--color-success)]/30 text-[var(--color-success)] px-4 py-3 rounded-xl text-sm animate-fadeIn">
                                    <div className="flex items-start space-x-2">
                                        <MdWarning className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        <span>
                                            Verification email sent. Please
                                            check your inbox and spam folder.
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:from-[var(--color-primary)]/90 hover:to-[var(--color-accent)]/90 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <svg
                                                className="animate-spin h-5 w-5"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span>Signing In...</span>
                                        </span>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[var(--color-border)]"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[var(--color-card-bg)] text-[var(--color-text)]/60">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="flex items-center justify-center py-3 px-4 bg-[var(--color-input-bg)] border-2 border-[var(--color-input-border)] rounded-xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                                >
                                    <FcGoogle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[var(--color-text)] font-medium text-sm">
                                        Google
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAppleSignIn}
                                    disabled={isLoading}
                                    className="flex items-center justify-center py-3 px-4 bg-[var(--color-input-bg)] border-2 border-[var(--color-input-border)] rounded-xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                                >
                                    <FaApple className="h-5 w-5 mr-2 text-[var(--color-text)] group-hover:scale-110 transition-transform" />
                                    <span className="text-[var(--color-text)] font-medium text-sm">
                                        Apple
                                    </span>
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-8 pt-6 border-t border-[var(--color-border)]">
                            <p className="text-[var(--color-text)]/70 text-sm">
                                Don't have an account?{" "}
                                <Link
                                    href="/client/register"
                                    className="text-[var(--color-primary)] hover:text-[var(--color-accent)] font-semibold transition-colors duration-200"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-[var(--color-text)]/50 text-xs mt-6">
                        Protected by industry-standard security measures
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    10%,
                    30%,
                    50%,
                    70%,
                    90% {
                        transform: translateX(-5px);
                    }
                    20%,
                    40%,
                    60%,
                    80% {
                        transform: translateX(5px);
                    }
                }

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

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
