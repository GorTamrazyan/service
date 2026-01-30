// app/contexts/ThemeContext.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
    isInitialized: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    scope?: string; // "admin" | "client" | undefined (global)
}

export function ThemeProvider({ children, scope }: ThemeProviderProps) {
    const [isDark, setIsDark] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const storageKey = scope ? `theme-${scope}` : "theme";

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem(storageKey);

            let shouldBeDark = false;

            if (savedTheme) {
                shouldBeDark = savedTheme === "dark";
            } else {
                shouldBeDark = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches;
                localStorage.setItem(storageKey, shouldBeDark ? "dark" : "light");
            }

            setIsDark(shouldBeDark);

            if (scope) {
                // Scoped: apply class to container div
                containerRef.current?.classList.toggle("dark", shouldBeDark);
            } else {
                // Global: apply to documentElement
                document.documentElement.classList.toggle("dark", shouldBeDark);
            }

            setIsInitialized(true);
        }
    }, [storageKey, scope]);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        localStorage.setItem(storageKey, newIsDark ? "dark" : "light");

        if (scope) {
            containerRef.current?.classList.toggle("dark", newIsDark);
        } else {
            document.documentElement.classList.toggle("dark", newIsDark);
        }
    };

    if (scope) {
        return (
            <ThemeContext.Provider value={{ isDark, toggleTheme, isInitialized }}>
                <div ref={containerRef} className="contents">
                    {children}
                </div>
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, isInitialized }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
