"use client"; 

import { useEffect } from "react";
import { getAnalytics } from "firebase/analytics";
import { app } from "../../lib/firebase/firebase"; 

export default function FirebaseAnalyticsInitializer() {
    useEffect(() => {
        
        if (typeof window !== "undefined") {
            try {
                const analytics = getAnalytics(app);
                console.log("Firebase Analytics initialized on client side.");
                
            } catch (e) {
                console.error("Failed to initialize Firebase Analytics:", e);
            }
        }
    }, []); 

    return null; 
}
