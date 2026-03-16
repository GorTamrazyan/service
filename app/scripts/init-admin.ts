import { initializeDefaultAdmin } from "../lib/firebase/admin";

initializeDefaultAdmin().then(() => {
    console.log("✅ Инициализация завершена");
    process.exit(0);
}).catch((error) => {
    console.error("❌ Ошибка инициализации:", error);
    process.exit(1);
});