"use client";
import { useState } from "react";
import React from "react";
import { auth } from "../../lib/firebase/firebase";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import {
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    query,
    where,
    collection,
    getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MdEmail, MdLock, MdCheckCircle, MdInfo } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendWelcomeEmailHelper } from "../../lib/email/helpers";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [verificationSent, setVerificationSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const router = useRouter();

    const checkEmailExists = async (email: string) => {
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error checking email:", error);
            return false;
        }
    };

    const createUserProfile = async (userId: string, email: string) => {
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
            } else {
                console.log("ℹ️ User profile already exists");
            }
        } catch (error) {
            console.error("❌ Error creating profile:", error);
        }
    };

    const handleEmailPasswordSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            
            const emailExists = await checkEmailExists(email);
            if (emailExists) {
                setError("An account with this email already exists.");
                setIsLoading(false);
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = userCredential.user;
            console.log("Successful registration via Email/Password:", user);

            await createUserProfile(user.uid, email);

            try {
                await sendEmailVerification(user, {
                    url: `${window.location.origin}/client/dashboard/home`,
                    handleCodeInApp: false,
                });

                setVerificationSent(true);
                console.log(
                    "✅ Verification email successfully sent to:",
                    email,
                );
                console.log("📧 Check your inbox and spam folder");

                try {
                    await sendWelcomeEmailHelper(email, email.split("@")[0]);
                    console.log("✅ Welcome email sent");
                } catch (welcomeEmailError) {
                    console.error(
                        "⚠️ Error sending welcome email:",
                        welcomeEmailError,
                    );
                }
            } catch (emailError: any) {
                console.error("❌ Error sending email:", emailError);
                setError(
                    `Registration successful, but failed to send verification email: ${emailError.message}`,
                );
            }
        } catch (firebaseError: any) {
            if (firebaseError.code === "auth/email-already-in-use") {
                setError("An account with this email already exists.");
            } else if (firebaseError.code === "auth/weak-password") {
                setError("Password is too weak. Use at least 6 characters.");
            } else if (firebaseError.code === "auth/invalid-email") {
                setError("Invalid email address format.");
            } else {
                setError("Registration failed. Please try again.");
            }
            console.error(
                "Registration error via Email/Password:",
                firebaseError,
            );
        } finally {
            setIsLoading(false);
        }

        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Successful registration via Google:", user);

            if (user.email) {
                await createUserProfile(user.uid, user.email);

                try {
                    await sendWelcomeEmailHelper(
                        user.email,
                        user.displayName || user.email.split("@")[0],
                    );
                } catch (welcomeEmailError) {
                    console.error(
                        "⚠️ Error sending welcome email:",
                        welcomeEmailError,
                    );
                }
            }

            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            if (firebaseError.code !== "auth/popup-closed-by-user") {
                setError("Failed to sign in with Google. Please try again.");
            }
            console.error("Google registration error:", firebaseError);
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
            console.log("Successful registration via Apple/iCloud:", user);

            if (user.email) {
                await createUserProfile(user.uid, user.email);

                try {
                    await sendWelcomeEmailHelper(
                        user.email,
                        user.displayName || user.email.split("@")[0],
                    );
                } catch (welcomeEmailError) {
                    console.error(
                        "⚠️ Error sending welcome email:",
                        welcomeEmailError,
                    );
                }
            }

            router.push("/client/dashboard/home");
        } catch (firebaseError: any) {
            if (firebaseError.code !== "auth/popup-closed-by-user") {
                setError("Failed to sign in with Apple. Please try again.");
            }
            console.error("Apple/iCloud registration error:", firebaseError);
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
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-primary)] rounded-2xl mb-4 shadow">
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
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-2">
                                Create Account
                            </h2>
                            <p className="text-[var(--color-text)]/60 text-sm">
                                Join us to get started with premium fencing
                                solutions
                            </p>
                        </div>

                        <form
                            onSubmit={handleEmailPasswordSubmit}
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
                                        autoComplete="new-password"
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
                                <p className="text-xs text-[var(--color-text)]/60">
                                    Must be at least 6 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-[var(--color-text)]"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdLock className="h-5 w-5 text-[var(--color-text)]/40 group-focus-within:text-[var(--color-primary)]" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-input-bg)] border-2 border-[var(--color-input-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-[var(--color-error)]/10 border-2 border-[var(--color-error)]/30 text-[var(--color-error)] px-4 py-3 rounded-xl text-sm flex items-start space-x-2 animate-shake">
                                    <MdInfo className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {verificationSent && (
                                <div className="space-y-4 animate-fadeIn">
                                    <div className="bg-[var(--color-success)]/10 border-2 border-[var(--color-success)]/30 text-[var(--color-success)] px-4 py-4 rounded-xl">
                                        <div className="flex items-start space-x-3">
                                            <MdCheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-bold text-[var(--color-text)] mb-2">
                                                    Registration Successful!
                                                </p>
                                                <p className="text-sm text-[var(--color-text)]/70 mb-4">
                                                    Please check your email and
                                                    click the verification link
                                                    to activate your account.
                                                </p>
                                                <Link
                                                    href="/client/sign-in"
                                                    className="inline-flex items-center justify-center bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                                                >
                                                    Go to Sign In
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <details className="group">
                                        <summary className="cursor-pointer text-[var(--color-info)] hover:text-[var(--color-info)]/80 font-medium text-sm flex items-center space-x-2 transition-colors">
                                            <span>
                                                🔧 Didn't receive the email?
                                            </span>
                                            <svg
                                                className="w-4 h-4 transform transition-transform group-open:rotate-180"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </summary>
                                        <div className="mt-3 pl-6 text-sm text-[var(--color-text)]/70 space-y-2">
                                            <p className="font-medium">
                                                Try the following:
                                            </p>
                                            <ul className="space-y-1.5 list-disc list-inside">
                                                <li>
                                                    Check your spam or junk
                                                    folder
                                                </li>
                                                <li>
                                                    Verify your email address is
                                                    correct
                                                </li>
                                                <li>
                                                    Wait a few minutes for the
                                                    email to arrive
                                                </li>
                                                <li>
                                                    Try registering again if
                                                    needed
                                                </li>
                                            </ul>
                                        </div>
                                    </details>
                                </div>
                            )}

                            <div className="flex items-start space-x-3">
                                <input
                                    id="agreedToTerms"
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 accent-[var(--color-primary)] cursor-pointer flex-shrink-0"
                                />
                                <label htmlFor="agreedToTerms" className="text-sm text-[var(--color-text)]/70 cursor-pointer">
                                    I agree to the{" "}
                                    <Link href="/terms" target="_blank" className="text-[var(--color-primary)] hover:text-[var(--color-accent)] font-semibold underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" target="_blank" className="text-[var(--color-primary)] hover:text-[var(--color-accent)] font-semibold underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || verificationSent || !agreedToTerms}
                                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-semibold py-3.5 px-6 rounded-full text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            <span>Creating Account...</span>
                                        </span>
                                    ) : (
                                        "Create Account"
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
                                    disabled={isLoading || !agreedToTerms}
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
                                    disabled={isLoading || !agreedToTerms}
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
                                Already have an account?{" "}
                                <Link
                                    href="/client/sign-in"
                                    className="text-[var(--color-primary)] hover:text-[var(--color-accent)] font-semibold transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>

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
