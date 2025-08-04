// app/client/components/FirebaseAnalyticsInitializer.tsx
"use client"; // Важно: этот компонент должен быть клиентским

import { useEffect } from "react";
import { getAnalytics } from "firebase/analytics";
import { app } from "../lib/firebase/firebase"; // Импортируем только app

export default function FirebaseAnalyticsInitializer() {
    useEffect(() => {
        // Убедимся, что код выполняется только на клиенте
        if (typeof window !== "undefined") {
            try {
                const analytics = getAnalytics(app);
                console.log("Firebase Analytics initialized on client side.");
                // Вы можете экспортировать 'analytics' из этого компонента,
                // если вам нужен доступ к нему в других местах на клиенте
                // (например, для отслеживания событий).
                // Но для большинства случаев, этого достаточно для инициализации.
            } catch (e) {
                console.error("Failed to initialize Firebase Analytics:", e);
            }
        }
    }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

    return null; // Этот компонент ничего не рендерит
}
