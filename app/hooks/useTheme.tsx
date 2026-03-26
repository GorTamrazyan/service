"use client";

import { useState, useEffect } from "react";

export function useTheme() {
    const [isDark, setIsDark] = useState<boolean | null>(null); 
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        
        if (typeof window !== "undefined" && !isInitialized) {
            const savedTheme = localStorage.getItem("theme");

            let shouldBeDark = false;

            if (savedTheme) {

                shouldBeDark = savedTheme === "dark";
            } else {

                shouldBeDark = false;
                localStorage.setItem("theme", "light");
            }

            setIsDark(shouldBeDark);
            document.documentElement.classList.toggle("dark", shouldBeDark);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const toggleTheme = () => {
        if (isDark === null) return; 

        const newIsDark = !isDark;
        setIsDark(newIsDark);

        localStorage.setItem("theme", newIsDark ? "dark" : "light");

        document.documentElement.classList.toggle("dark", newIsDark);
    };

    return {
        isDark: isDark ?? false, 
        toggleTheme,
        isInitialized,
    };
}
